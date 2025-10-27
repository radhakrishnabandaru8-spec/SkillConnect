import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with professionals and learners worldwide</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[
            { icon: Users, label: "Members", value: "234,567" },
            { icon: MessageSquare, label: "Discussions", value: "45,678" },
            { icon: TrendingUp, label: "Active Today", value: "12,345" },
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join group chats, connect with mentors, and engage in real-time discussions
          </p>
          <Button className="bg-gradient-primary" size="lg">Join the Waitlist</Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
