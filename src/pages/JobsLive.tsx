import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Briefcase, DollarSign, Heart, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AddJobDialog from "@/components/AddJobDialog";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  job_type: string;
  location: string;
  salary_range: string;
  requirements: string[];
  created_at: string;
  is_saved?: boolean;
  is_applied?: boolean;
}

const JobsLive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      let query = (supabase.from("jobs") as any)
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // If user is logged in, check which jobs are saved and applied
      if (user) {
        const { data: savedJobs } = await (supabase.from("saved_jobs") as any)
          .select("job_id")
          .eq("user_id", user.id);

        const { data: applications } = await (supabase.from("applications") as any)
          .select("job_id")
          .eq("applicant_id", user.id);

        const savedJobIds = new Set((savedJobs as any)?.map((s: any) => s.job_id));
        const appliedJobIds = new Set((applications as any)?.map((a: any) => a.job_id));
        const jobsWithStatus = (data as any).map((job: any) => ({
          ...job,
          is_saved: savedJobIds.has(job.id),
          is_applied: appliedJobIds.has(job.id)
        }));
        setJobs(jobsWithStatus);
      } else {
        setJobs(data || []);
      }
    } catch (error: any) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      const job = jobs.find(j => j.id === jobId);
      if (job?.is_saved) {
        // Unsave
        await (supabase.from("saved_jobs") as any)
          .delete()
          .eq("user_id", user.id)
          .eq("job_id", jobId);
        toast.success("Job removed from saved");
      } else {
        // Save
        await (supabase.from("saved_jobs") as any)
          .insert({ user_id: user.id, job_id: jobId });
        toast.success("Job saved successfully");
      }
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      return;
    }

    try {
      await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: "pending"
        } as any);
      toast.success("Application submitted successfully!");
      fetchJobs();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("You've already applied to this job");
      } else {
        toast.error("Failed to submit application");
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = !jobType || job.job_type === jobType;
    return matchesSearch && matchesLocation && matchesType;
  });

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
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 bg-white"
            />
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${filteredJobs.length} jobs found`}
          </p>
          {(profile?.role === "employer" || profile?.role === "instructor") && (
            <AddJobDialog onJobAdded={fetchJobs} />
          )}
        </div>

        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-card transition-all hover:shadow-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">{job.company}</CardDescription>
                  </div>
                  <Badge className="bg-gradient-primary text-white">
                    {job.job_type.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-primary">{job.salary_range}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className={job.is_applied ? "bg-green-600" : "bg-gradient-primary"}
                    onClick={() => !job.is_applied && handleApply(job.id)}
                    disabled={job.is_applied}
                  >
                    {job.is_applied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Applied
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                  <Button 
                    variant={job.is_saved ? "default" : "outline"}
                    onClick={() => handleSaveJob(job.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${job.is_saved ? "fill-current" : ""}`} />
                    {job.is_saved ? "Saved" : "Save Job"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!loading && filteredJobs.length === 0 && (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsLive;
