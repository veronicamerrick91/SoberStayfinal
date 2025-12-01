import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Building, FileText, Activity, 
  Check, X, Eye, ShieldAlert, BarChart3, AlertTriangle,
  Mail, MessageSquare, Settings, DollarSign, TrendingUp,
  Search, Download, Flag, Lock, Clock
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useState } from "react";

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview, management & controls</p>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="border-red-500 text-red-500 px-3 py-1">
                <ShieldAlert className="w-3 h-3 mr-1" /> Admin Mode
             </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-border p-1 grid w-full grid-cols-6 lg:grid-cols-10 gap-1">
            <TabsTrigger value="overview" className="text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
            <TabsTrigger value="listings" className="text-xs">Listings</TabsTrigger>
            <TabsTrigger value="applications" className="text-xs">Apps</TabsTrigger>
            <TabsTrigger value="messaging" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs">Safety</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>

          {/* DASHBOARD OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div className="text-xs text-muted-foreground">850 Tenants • 390 Providers</div>
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
                  <div className="text-xs text-primary font-bold">12 pending verification</div>
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
                  <div className="text-xs text-muted-foreground">+45 this week</div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <h3 className="text-3xl font-bold text-primary">$12.4k</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">From subscriptions this month</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Alerts & Flags</span>
                    <Badge className="bg-red-500/20 text-red-500">3 Critical</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: AlertTriangle, title: "Suspicious Activity", desc: "Multiple failed logins", color: "red" },
                    { icon: Flag, title: "Inappropriate Message", desc: "Flagged by AI moderation", color: "amber" },
                    { icon: Lock, title: "Payment Failed", desc: "Provider account suspended", color: "red" },
                  ].map((alert, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg bg-${alert.color}-500/10 border border-${alert.color}-500/20`}>
                      <alert.icon className={`w-5 h-5 text-${alert.color}-500 mt-0.5 shrink-0`} />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "Provider Verified", user: "Recovery First LLC", time: "10 mins ago" },
                    { action: "Application Approved", user: "John Smith → Serenity House", time: "1 hour ago" },
                    { action: "Listing Published", user: "New Beginnings Cottage", time: "3 hours ago" },
                    { action: "Support Ticket Resolved", user: "#2341", time: "5 hours ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-border/50 pb-3 last:border-0">
                      <div>
                        <p className="text-white font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* USERS MANAGEMENT */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">User Management</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search users..." className="bg-background/50 border-white/10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Button size="sm" variant="outline">Filter</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Connor", role: "Tenant", email: "sarah@example.com", status: "Active", verified: true },
                    { name: "Recovery First LLC", role: "Provider", email: "recovery@example.com", status: "Active", verified: true },
                    { name: "John Doe", role: "Tenant", email: "john@example.com", status: "Suspended", verified: false },
                    { name: "Hope House", role: "Provider", email: "hopehouse@example.com", status: "Pending", verified: false },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === "Provider" ? "default" : "secondary"}>{user.role}</Badge>
                        <Badge variant={user.status === "Active" ? "default" : "outline"} className={user.status === "Active" ? "bg-green-500/80" : user.status === "Suspended" ? "bg-red-500/80" : "bg-amber-500/80"}>{user.status}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10">Edit</Button>
                          <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:bg-red-500/10">Suspend</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LISTINGS MANAGEMENT */}
          <TabsContent value="listings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Listing Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_PROPERTIES.map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex gap-4 flex-1">
                        <img src={prop.image} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <p className="text-white font-medium">{prop.name}</p>
                          <p className="text-xs text-muted-foreground">{prop.address}, {prop.city}</p>
                          <div className="flex gap-2 mt-2">
                            {prop.isVerified && <Badge className="bg-green-500/80 text-xs">Verified</Badge>}
                            <Badge variant="outline" className="text-xs">${prop.price}/{prop.pricePeriod}</Badge>
                            <Badge variant="secondary" className="text-xs">{prop.bedsAvailable} beds</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Review</Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10">Flag</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPLICATIONS REVIEW */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Application Review System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Michael Johnson", property: "Serenity House", status: "Pending Review", date: "2 hours ago", completeness: 100 },
                    { name: "Emma Wilson", property: "New Beginnings", status: "Needs Info", date: "1 day ago", completeness: 75 },
                    { name: "James Martinez", property: "The Harbor", status: "Approved", date: "3 days ago", completeness: 100 },
                  ].map((app, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground">{app.property} • {app.date}</p>
                        </div>
                        <Badge className={app.status === "Approved" ? "bg-green-500/80" : app.status === "Pending Review" ? "bg-amber-500/80" : "bg-blue-500/80"}>{app.status}</Badge>
                      </div>
                      <div className="mb-3 space-y-1">
                        <p className="text-xs text-muted-foreground">Form Completeness: {app.completeness}%</p>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${app.completeness}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Approve</Button>
                        <Button size="sm" variant="outline" className="border-primary/20">Request Info</Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10">Deny</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGING OVERSIGHT */}
          <TabsContent value="messaging" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Message Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { tenant: "John Smith", provider: "Serenity House", preview: "Can I apply even though...", flagged: true, reason: "Potential trigger mention" },
                    { tenant: "Sarah Connor", provider: "New Beginnings", preview: "Thank you for accepting my application!", flagged: false, reason: null },
                    { tenant: "Mike Chen", provider: "The Harbor", preview: "Where can I find...", flagged: true, reason: "Outside communication attempt" },
                  ].map((msg, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${msg.flagged ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-border/50"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-medium text-sm">{msg.tenant} → {msg.provider}</p>
                          <p className="text-xs text-muted-foreground">{msg.preview}</p>
                        </div>
                        {msg.flagged && <Badge className="bg-red-500/80 text-xs">{msg.reason}</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">View Thread</Button>
                        {msg.flagged && (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-green-500 hover:bg-green-500/10">Clear</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:bg-red-500/10">Ban User</Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPLIANCE & SAFETY */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Safety & Compliance Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Card className="bg-white/5 border-border">
                      <CardContent className="pt-4">
                        <p className="text-xs font-bold text-primary mb-3">Incident Reports</p>
                        <div className="text-3xl font-bold text-white mb-1">7</div>
                        <p className="text-xs text-muted-foreground">3 pending review</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-border">
                      <CardContent className="pt-4">
                        <p className="text-xs font-bold text-primary mb-3">Compliance Issues</p>
                        <div className="text-3xl font-bold text-white mb-1">2</div>
                        <p className="text-xs text-muted-foreground">Missing fire inspection</p>
                      </CardContent>
                    </Card>
                  </div>
                  {[
                    { property: "Serenity House", issue: "Expired Fire Inspection", dueDate: "Jan 15, 2025", severity: "high" },
                    { property: "New Beginnings", issue: "Insurance Certificate Needed", dueDate: "Feb 1, 2025", severity: "high" },
                    { property: "The Harbor", issue: "Background Check Update", dueDate: "March 1, 2025", severity: "medium" },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${item.severity === "high" ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{item.property}</p>
                          <p className="text-xs text-muted-foreground">{item.issue} • Due: {item.dueDate}</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-xs">Request Docs</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BILLING & PAYMENTS */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Billing & Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white">$12,450</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-white">127</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Failed Payments</p>
                      <p className="text-2xl font-bold text-red-500">3</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-3">
                  {[
                    { provider: "Recovery First LLC", plan: "$49/month × 3 listings", status: "Active", nextBilling: "Jan 15, 2025" },
                    { provider: "Hope House", plan: "$49/month × 1 listing", status: "Overdue", nextBilling: "Dec 28, 2024" },
                    { provider: "Serenity Homes", plan: "$49/month × 2 listings", status: "Active", nextBilling: "Jan 10, 2025" },
                  ].map((sub, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                      <div>
                        <p className="text-white font-medium text-sm">{sub.provider}</p>
                        <p className="text-xs text-muted-foreground">{sub.plan}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{sub.nextBilling}</p>
                          <Badge className={sub.status === "Active" ? "bg-green-500/80" : "bg-red-500/80"}>{sub.status}</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-xs">Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Conversion Rate</p>
                  <p className="text-3xl font-bold text-white">24%</p>
                  <p className="text-xs text-green-500 mt-2">↑ 3% vs last week</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Avg. Response Time</p>
                  <p className="text-3xl font-bold text-white">4.2h</p>
                  <p className="text-xs text-muted-foreground mt-2">Provider to tenant</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Platform Traffic</p>
                  <p className="text-3xl font-bold text-white">8.5k</p>
                  <p className="text-xs text-muted-foreground mt-2">Unique visitors this week</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Serenity House", views: 1240, applications: 45, conversionRate: "3.6%" },
                    { name: "New Beginnings Cottage", views: 980, applications: 32, conversionRate: "3.3%" },
                    { name: "The Harbor", views: 742, applications: 28, conversionRate: "3.8%" },
                  ].map((listing, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border/50">
                      <div>
                        <p className="text-white text-sm font-medium">{listing.name}</p>
                      </div>
                      <div className="flex gap-6 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground">Views</p>
                          <p className="text-white font-bold">{listing.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Apps</p>
                          <p className="text-white font-bold">{listing.applications}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Conv. Rate</p>
                          <p className="text-primary font-bold">{listing.conversionRate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT TICKETS */}
          <TabsContent value="support" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "#2451", user: "John Doe (Tenant)", subject: "Payment issue on application", status: "Open", priority: "high", created: "2 hours ago" },
                    { id: "#2450", user: "Recovery LLC (Provider)", subject: "Can't upload photos", status: "In Progress", priority: "medium", created: "4 hours ago" },
                    { id: "#2449", user: "Sarah Connor (Tenant)", subject: "Message notification not working", status: "Resolved", priority: "low", created: "1 day ago" },
                  ].map((ticket, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                      <div>
                        <p className="text-white font-medium text-sm">{ticket.id} • {ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.user} • {ticket.created}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={ticket.priority === "high" ? "bg-red-500/80" : ticket.priority === "medium" ? "bg-amber-500/80" : "bg-gray-500/80"}>{ticket.priority}</Badge>
                        <Badge className={ticket.status === "Open" ? "bg-blue-500/80" : ticket.status === "In Progress" ? "bg-amber-500/80" : "bg-green-500/80"}>{ticket.status}</Badge>
                        <Button size="sm" variant="outline" className="h-8 text-xs">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold">Application Requirements</h3>
                  {[
                    { field: "Photo ID", required: true },
                    { field: "Sobriety Status", required: true },
                    { field: "Treatment History", required: true },
                    { field: "Emergency Contact", required: true },
                    { field: "Insurance Info", required: false },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border/50">
                      <span className="text-white text-sm">{req.field}</span>
                      <Badge className={req.required ? "bg-green-500/80" : "bg-gray-500/80"}>{req.required ? "Required" : "Optional"}</Badge>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-white font-bold">Safety Settings</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Auto-flag drug references", enabled: true },
                      { label: "Monitor external contact attempts", enabled: true },
                      { label: "Require provider verification", enabled: true },
                      { label: "Enable duplicate account detection", enabled: true },
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-white text-sm">{setting.label}</span>
                        <div className={`w-10 h-6 rounded-full ${setting.enabled ? "bg-primary" : "bg-gray-600"} transition-colors`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6 flex gap-2">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                  <Button variant="outline">Reset to Default</Button>
                  <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 ml-auto">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
