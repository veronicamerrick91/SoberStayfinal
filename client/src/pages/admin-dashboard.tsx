import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, FileText, Activity, 
  Check, X, Eye, ShieldAlert, BarChart3
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

export function AdminDashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management.</p>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="border-red-500 text-red-500 px-3 py-1">
                <ShieldAlert className="w-3 h-3 mr-1" /> Admin Mode
             </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="applications">All Applications</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <h3 className="text-3xl font-bold text-white">1,240</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>850 Tenants</span>
                    <span>390 Providers</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                      <h3 className="text-3xl font-bold text-white">145</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-primary font-bold">
                    12 pending verification
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Applications</p>
                      <h3 className="text-3xl font-bold text-white">892</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +45 this week
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <h3 className="text-3xl font-bold text-white">24%</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Visit to Application
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New User Signup", user: "Sarah Connor", role: "Tenant", time: "10 mins ago" },
                      { action: "Listing Submitted", user: "Recovery First LLC", role: "Provider", time: "1 hour ago" },
                      { action: "Application Approved", user: "John Smith", role: "Tenant", time: "3 hours ago" },
                      { action: "New Report", user: "System", role: "Admin", time: "5 hours ago" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                        <div>
                          <p className="text-white font-medium">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.user} ({item.role})</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Pending Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_PROPERTIES.slice(0, 3).map((prop) => (
                      <div key={prop.id} className="flex items-center gap-4">
                        <img src={prop.image} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{prop.name}</h4>
                          <p className="text-xs text-muted-foreground">{prop.address}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* OTHER TABS (Placeholders) */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                User management table would go here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
