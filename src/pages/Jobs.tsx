import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Briefcase, DollarSign } from "lucide-react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      description: "We're looking for an experienced React developer to join our team...",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $110k",
      posted: "1 week ago",
      description: "Create beautiful and intuitive user experiences...",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataMinds",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$130k - $160k",
      posted: "3 days ago",
      description: "Analyze complex data sets and derive insights...",
    },
    {
      id: 4,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      posted: "5 days ago",
      description: "Build and maintain our web applications...",
    },
    {
      id: 5,
      title: "Product Manager",
      company: "InnovateCo",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$110k - $145k",
      posted: "1 week ago",
      description: "Lead product development and strategy...",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "CloudOps",
      location: "Austin, TX",
      type: "Contract",
      salary: "$115k - $150k",
      posted: "4 days ago",
      description: "Manage and optimize our cloud infrastructure...",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-hero py-12">
        <div className="container">
          <h1 className="mb-6 text-4xl font-bold text-white">Find Your Next Opportunity</h1>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 bg-white"
              />
            </div>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="boston">Boston</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">{jobs.length} jobs found</p>
          <Button variant="outline">
            <Briefcase className="mr-2 h-4 w-4" />
            Save Search
          </Button>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="shadow-card transition-all hover:shadow-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">{job.company}</CardDescription>
                  </div>
                  <Badge className="bg-gradient-primary text-white">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-primary">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.posted}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-primary">Apply Now</Button>
                  <Button variant="outline">Save Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
