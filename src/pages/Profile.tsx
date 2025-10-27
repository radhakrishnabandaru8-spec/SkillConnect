import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Settings, Award } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero h-32"></div>
      
      <div className="container -mt-16">
        <Card className="shadow-glow mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">JD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                <p className="text-muted-foreground mb-4">Full Stack Developer | Lifelong Learner</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge>React</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Python</Badge>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button className="bg-gradient-primary">Edit Profile</Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="jobs" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Applied Jobs</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Senior React Developer</CardTitle>
                    <CardDescription>TechCorp Inc. • Applied 2 days ago</CardDescription>
                  </div>
                  <Badge>Under Review</Badge>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Full Stack Engineer</CardTitle>
                    <CardDescription>StartupXYZ • Applied 1 week ago</CardDescription>
                  </div>
                  <Badge variant="outline">Interview Scheduled</Badge>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Complete Web Development Bootcamp</CardTitle>
                    <CardDescription>Dr. Angela Yu • 45% complete</CardDescription>
                  </div>
                  <Button variant="outline">Continue</Button>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>React - The Complete Guide</CardTitle>
                    <CardDescription>Maximilian Schwarzmüller • 78% complete</CardDescription>
                  </div>
                  <Button variant="outline">Continue</Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="grid gap-4 md:grid-cols-2">
            {[
              { title: "First Job Application", desc: "Applied to your first job" },
              { title: "Course Completionist", desc: "Completed 5 courses" },
              { title: "Community Builder", desc: "Joined 10 discussions" },
              { title: "Skill Master", desc: "Earned 15 certificates" },
            ].map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                      <Award className="h-6 w-6 text-white" />
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

export default Profile;
