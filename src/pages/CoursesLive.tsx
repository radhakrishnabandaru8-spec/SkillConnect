import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Users, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AddCourseDialog from "@/components/AddCourseDialog";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  level: string;
  category: string;
  duration_hours: number;
  price: number;
  rating: number;
  student_count: number;
  thumbnail_url?: string;
  is_enrolled?: boolean;
}

const CoursesLive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await (supabase.from("courses") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If user is logged in, check which courses are enrolled
      if (user) {
        const { data: enrollments } = await (supabase.from("enrollments") as any)
          .select("course_id")
          .eq("student_id", user.id);

        const enrolledCourseIds = new Set((enrollments as any)?.map((e: any) => e.course_id));
        const coursesWithEnrollment = (data as any).map((course: any) => ({
          ...course,
          is_enrolled: enrolledCourseIds.has(course.id)
        }));
        setCourses(coursesWithEnrollment);
      } else {
        setCourses(data || []);
      }
    } catch (error: any) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("Please login to enroll in courses");
      return;
    }

    try {
      await (supabase.from("enrollments") as any)
        .insert({
          course_id: courseId,
          student_id: user.id,
          progress: 0,
          completed: false
        });
      
      // Update student count
      const course = courses.find(c => c.id === courseId);
      if (course) {
        await (supabase.from("courses") as any)
          .update({ student_count: course.student_count + 1 })
          .eq("id", courseId);
      }
      
      toast.success("Enrolled successfully!");
      fetchCourses();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("You're already enrolled in this course");
      } else {
        toast.error("Failed to enroll");
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || course.category.toLowerCase().includes(category.toLowerCase());
    const matchesLevel = !level || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero py-12">
        <div className="container">
          <h1 className="mb-6 text-4xl font-bold text-white">Master New Skills</h1>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="What do you want to learn?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 bg-white"
              />
            </div>
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 bg-white"
            />
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${filteredCourses.length} courses available`}
          </p>
          {profile?.role === "instructor" && <AddCourseDialog onCourseAdded={fetchCourses} />}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="shadow-card transition-all hover:shadow-glow overflow-hidden">
              <div className="aspect-video bg-gradient-primary" />
              <CardHeader>
                <div className="mb-2">
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription>{course.instructor_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.student_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours}h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-2xl font-bold text-primary">
                    ${course.price.toFixed(2)}
                  </span>
                  <Button 
                    className={course.is_enrolled ? "bg-green-600" : "bg-gradient-primary"}
                    onClick={() => !course.is_enrolled && handleEnroll(course.id)}
                    disabled={course.is_enrolled}
                  >
                    {course.is_enrolled ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enrolled
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!loading && filteredCourses.length === 0 && (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesLive;
