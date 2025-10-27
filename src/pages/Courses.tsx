import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Users, Clock } from "lucide-react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      students: "45,234",
      duration: "52 hours",
      price: "$79.99",
      level: "Beginner",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Machine Learning A-Z",
      instructor: "Kirill Eremenko",
      rating: 4.9,
      students: "78,901",
      duration: "44 hours",
      price: "$89.99",
      level: "Intermediate",
      category: "Data Science",
    },
    {
      id: 3,
      title: "React - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.7,
      students: "92,456",
      duration: "49 hours",
      price: "$69.99",
      level: "Intermediate",
      category: "Web Development",
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Jose Portilla",
      rating: 4.6,
      students: "56,789",
      duration: "38 hours",
      price: "$74.99",
      level: "Beginner",
      category: "Data Science",
    },
    {
      id: 5,
      title: "AWS Certified Solutions Architect",
      instructor: "Stephane Maarek",
      rating: 4.8,
      students: "34,567",
      duration: "27 hours",
      price: "$99.99",
      level: "Advanced",
      category: "Cloud Computing",
    },
    {
      id: 6,
      title: "UI/UX Design Masterclass",
      instructor: "Daniel Scott",
      rating: 4.7,
      students: "41,234",
      duration: "31 hours",
      price: "$84.99",
      level: "Beginner",
      category: "Design",
    },
  ];

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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="cloud">Cloud Computing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-6">
          <p className="text-muted-foreground">{courses.length} courses available</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="shadow-card transition-all hover:shadow-glow overflow-hidden">
              <div className="aspect-video bg-gradient-primary" />
              <CardHeader>
                <div className="mb-2">
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-2xl font-bold text-primary">{course.price}</span>
                  <Button className="bg-gradient-primary">Enroll Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
