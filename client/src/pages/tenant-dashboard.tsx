import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, FileText, MessageSquare, Heart, Bell, 
  Clock, CheckCircle, XCircle, ChevronRight 
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

export function TenantDashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Welcome back, Alex</h1>
            <p className="text-muted-foreground">Manage your applications and find your safe haven.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              <Badge className="bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">2</Badge>
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Homes</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">3</div>
                  <p className="text-xs text-muted-foreground mt-1">1 pending review</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Saved Homes</CardTitle>
                  <Heart className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-muted-foreground mt-1">2 new verified listings</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">5</div>
                  <p className="text-xs text-muted-foreground mt-1">From 2 providers</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Serenity House", status: "Under Review", date: "Today", progress: 60 },
                      { name: "New Beginnings", status: "Action Required", date: "Yesterday", progress: 40 },
                      { name: "The Harbor", status: "Submitted", date: "Nov 28", progress: 20 },
                    ].map((app, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Home className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-white">{app.name}</span>
                            <span className="text-xs text-muted-foreground">{app.date}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-primary">{app.status}</span>
                            <span className="text-muted-foreground">{app.progress}%</span>
                          </div>
                          <Progress value={app.progress} className="h-1.5" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_PROPERTIES.slice(0, 2).map((home) => (
                      <div key={home.id} className="flex gap-4 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                          <img src={home.image} alt={home.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{home.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{home.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">{home.city}</Badge>
                            <Badge variant="outline" className="text-xs text-primary border-primary/20">${home.price}/{home.pricePeriod}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                   {/* Mock detailed list would go here */}
                   <div className="text-center py-12 text-muted-foreground">
                     <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>You have 3 active applications.</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
