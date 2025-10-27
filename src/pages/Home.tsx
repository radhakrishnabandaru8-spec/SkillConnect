import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, GraduationCap, Users, TrendingUp, Star, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch latest 3 jobs
      const { data: jobsData, error: jobsError } = await (supabase.from("jobs") as any)
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (jobsError) throw jobsError;
      setTrendingJobs(jobsData || []);

      // Fetch top 3 courses
      const { data: coursesData, error: coursesError } = await (supabase.from("courses") as any)
        .select("*")
        .order("rating", { ascending: false })
        .limit(3);

      if (coursesError) throw coursesError;
      setTopCourses(coursesData || []);
    } catch (error: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl animate-fade-in">
              Find Your Dream Job & Master New Skills
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Connect with top employers and learn from industry experts on SkillConnect
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for jobs, courses, or skills..."
                  className="h-12 pl-10 bg-white/95 backdrop-blur"
                />
              </div>
              <Button size="lg" className="h-12 bg-white text-primary hover:bg-white/90">
                Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { icon: Briefcase, label: "Active Jobs", value: "12,345" },
              { icon: GraduationCap, label: "Courses", value: "8,901" },
              { icon: Users, label: "Members", value: "234,567" },
              { icon: TrendingUp, label: "Success Rate", value: "94%" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Trending Jobs</h2>
              <p className="text-muted-foreground">Top opportunities from leading companies</p>
            </div>
            <Link to="/jobs">
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : trendingJobs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No jobs available yet</p>
              </div>
            ) : (
              trendingJobs.map((job) => (
                <Card key={job.id} className="shadow-card transition-all hover:shadow-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{job.company}</CardDescription>
                      </div>
                      <Badge className="bg-gradient-primary">{job.job_type.replace("_", " ")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        {job.salary_range}
                      </div>
                    )}
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <Button 
                      className="w-full bg-gradient-primary"
                      onClick={() => {
                        if (!user) {
                          navigate("/auth");
                        } else {
                          navigate("/jobs");
                        }
                      }}
                    >
                      {user ? "Apply Now" : "Login to Apply"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Top Courses</h2>
              <p className="text-muted-foreground">Learn from the best instructors</p>
            </div>
            <Link to="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : topCourses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No courses available yet</p>
              </div>
            ) : (
              topCourses.map((course) => (
                <Card key={course.id} className="shadow-card transition-all hover:shadow-glow">
                  <div className="aspect-video bg-gradient-primary" />
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.instructor_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-muted-foreground">{course.student_count.toLocaleString()} students</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${course.price.toFixed(2)}</span>
                      <Button 
                        className="bg-gradient-primary"
                        onClick={() => {
                          if (!user) {
                            navigate("/auth");
                          } else {
                            navigate("/courses");
                          }
                        }}
                      >
                        {user ? "Enroll Now" : "Login to Enroll"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Find Jobs</a></li>
                <li><a href="#" className="hover:text-primary">Learn Skills</a></li>
                <li><a href="#" className="hover:text-primary">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Join our community and stay updated with the latest opportunities
              </p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 SkillConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
