import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Application {
  id: string;
  status: string;
  applied_at: string;
  jobs: {
    title: string;
    company: string;
  };
}

interface Enrollment {
  id: string;
  progress: number;
  enrolled_at: string;
  courses: {
    title: string;
    instructor_name: string;
  };
}

const ProfileLive = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch applications
      const { data: appsData, error: appsError } = await (supabase.from("applications") as any)
        .select(`
          id,
          status,
          applied_at,
          jobs (
            title,
            company
          )
        `)
        .eq("applicant_id", user.id)
        .order("applied_at", { ascending: false });

      if (appsError) throw appsError;
      setApplications(appsData || []);

      // Fetch enrollments
      const { data: enrollData, error: enrollError } = await (supabase.from("enrollments") as any)
        .select(`
          id,
          progress,
          enrolled_at,
          courses (
            title,
            instructor_name
          )
        `)
        .eq("student_id", user.id)
        .order("enrolled_at", { ascending: false });

      if (enrollError) throw enrollError;
      setEnrollments(enrollData || []);
    } catch (error: any) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero h-32"></div>
      
      <div className="container -mt-16">
        <Card className="shadow-glow mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {profile.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                <p className="text-muted-foreground mb-4">
                  {profile.role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  {profile.bio && ` | ${profile.bio}`}
                </p>
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {profile.skills.map((skill, idx) => (
                      <Badge key={idx}>{skill}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button className="bg-gradient-primary">Edit Profile</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="jobs" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Applied Jobs
            </TabsTrigger>
            <TabsTrigger value="courses">
              <GraduationCap className="h-4 w-4 mr-2" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4">
            {applications.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">Start applying to jobs to see them here</p>
                <Button className="bg-gradient-primary" onClick={() => navigate("/jobs")}>
                  Browse Jobs
                </Button>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{app.jobs.title}</CardTitle>
                        <CardDescription>
                          {app.jobs.company} • Applied {new Date(app.applied_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={app.status === "pending" ? "outline" : "default"}>
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            {enrollments.length === 0 ? (
              <Card className="p-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                <p className="text-muted-foreground mb-4">Start learning by enrolling in courses</p>
                <Button className="bg-gradient-primary" onClick={() => navigate("/courses")}>
                  Browse Courses
                </Button>
              </Card>
            ) : (
              enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{enrollment.courses.title}</CardTitle>
                        <CardDescription>
                          {enrollment.courses.instructor_name} • {enrollment.progress}% complete
                        </CardDescription>
                      </div>
                      <Button variant="outline">Continue</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="achievements" className="grid gap-4 md:grid-cols-2">
            {[
              { title: "First Job Application", desc: "Applied to your first job", unlocked: applications.length > 0 },
              { title: "Learner", desc: "Enrolled in your first course", unlocked: enrollments.length > 0 },
              { title: "Active Job Seeker", desc: "Applied to 5 jobs", unlocked: applications.length >= 5 },
              { title: "Course Enthusiast", desc: "Enrolled in 3 courses", unlocked: enrollments.length >= 3 },
            ].map((achievement, index) => (
              <Card key={index} className={!achievement.unlocked ? "opacity-50" : ""}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${achievement.unlocked ? "bg-gradient-primary" : "bg-muted"}`}>
                      <Award className={`h-6 w-6 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileLive;
