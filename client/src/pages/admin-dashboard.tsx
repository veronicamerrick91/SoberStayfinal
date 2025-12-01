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
  Search, Download, Flag, Lock, Clock, Upload, Shield, Plus
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { getReports, updateReportStatus } from "@/lib/reports";
import { UserEditModal } from "@/components/user-edit-modal";
import { ListingReviewModal } from "@/components/listing-review-modal";
import { ApplicationDetailsModal } from "@/components/application-details-modal";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: "Tenant" | "Provider";
  email: string;
  phone?: string;
  status: "Active" | "Suspended" | "Pending";
  verified: boolean;
}

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [reviewingListing, setReviewingListing] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [viewingApplication, setViewingApplication] = useState<any | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [safetySettings, setSafetySettings] = useState<any[]>([
    { id: 1, label: "Auto-flag drug references", enabled: true },
    { id: 2, label: "Monitor external contact attempts", enabled: true },
    { id: 3, label: "Require provider verification", enabled: true },
    { id: 4, label: "Enable duplicate account detection", enabled: true },
  ]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignRecipients, setNewCampaignRecipients] = useState("All Tenants");
  const [smsAudience, setSmsAudience] = useState("All Users");
  const [smsContent, setSmsContent] = useState("");
  const [showSubscriptionWaiverModal, setShowSubscriptionWaiverModal] = useState(false);
  const [waivingProvider, setWaivingProvider] = useState("");
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("onSignup");
  const [newWorkflowTemplate, setNewWorkflowTemplate] = useState("welcome");
  const [newWorkflowSubject, setNewWorkflowSubject] = useState("");
  const [newWorkflowBody, setNewWorkflowBody] = useState("");

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setShowEditModal(false);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" }
        : u
    ));
  };

  const handleReviewListing = (listing: any) => {
    setReviewingListing(listing);
    setShowReviewModal(true);
  };

  const handleApproveListing = (listingId: string) => {
    setListings(listings.map(l => l.id === listingId ? { ...l, status: "Approved" } : l));
    setShowReviewModal(false);
  };

  const handleDenyListing = (listingId: string, reason: string) => {
    setListings(listings.map(l => l.id === listingId ? { ...l, status: "Rejected", denialReason: reason } : l));
    setShowReviewModal(false);
  };

  const handleViewApplication = (app: any) => {
    setViewingApplication(app);
    setShowApplicationModal(true);
  };

  const handleApproveApplication = (appId: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Approved" } : a));
  };

  const handleDenyApplication = (appId: string, reason: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Denied", denialReason: reason } : a));
  };

  const handleRequestApplicationInfo = (appId: string, message: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Needs Info", infoRequest: message } : a));
  };

  const handleClearFlag = (msgId: string) => {
    setMessages(messages.map(m => m.id === msgId ? { ...m, flagged: false, reason: null } : m));
  };

  const handleBanUser = (msgId: string) => {
    setMessages(messages.filter(m => m.id !== msgId));
  };

  const handleApproveDocument = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "Approved" } : d));
  };

  const handleRejectDocument = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "Rejected" } : d));
  };

  const toggleSafetySettings = (settingId: number) => {
    setSafetySettings(safetySettings.map(s => s.id === settingId ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSaveSettings = () => {
    // Settings saved
  };

  const handleResetSettings = () => {
    setSafetySettings([
      { id: 1, label: "Auto-flag drug references", enabled: true },
      { id: 2, label: "Monitor external contact attempts", enabled: true },
      { id: 3, label: "Require provider verification", enabled: true },
      { id: 4, label: "Enable duplicate account detection", enabled: true },
    ]);
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      users: users.length,
      listings: listings.length,
      applications: applications.length,
      documents: documents.length,
      reports: reports.length,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleSendCampaign = () => {
    // Campaign sent - action complete
  };

  const handleCreateCampaign = () => {
    setShowNewCampaignModal(true);
    setNewCampaignName("");
    setNewCampaignRecipients("All Tenants");
  };

  const handleSaveNewCampaign = () => {
    if (newCampaignName.trim()) {
      const recipientCounts: any = { "All Tenants": 520, "All Providers": 145, "Active Subscribers": 312, "Inactive Users": 89 };
      setCampaigns([...campaigns, { name: newCampaignName, status: "Draft", recipients: recipientCounts[newCampaignRecipients] || 0 }]);
      setShowNewCampaignModal(false);
    }
  };

  const handleDeleteCampaign = (idx: number) => {
    setCampaigns(campaigns.filter((_, i) => i !== idx));
  };

  const handleSendSMS = () => {
    // SMS sent - action complete
  };

  const handleCreateBlog = () => {
    setShowBlogModal(true);
    setNewBlogTitle("");
  };

  const handleSaveBlog = () => {
    setShowBlogModal(false);
  };

  const handlePublishBlog = () => {
    setShowBlogModal(false);
  };

  const handleCreatePromo = () => {
    setPromoCodes([...promoCodes, { code: "NEWCODE", discount: "20% off", target: "General", used: 0 }]);
  };

  const handleLaunchAd = () => {
    setAdCampaigns([...adCampaigns, { home: "New Ad Campaign", duration: "14 days", cost: "$299", status: "Active" }]);
  };

  const handleEditCampaign = (idx: number) => {
    setEditingCampaign({ ...campaigns[idx], idx });
  };

  const handleSaveCampaign = (updates: any) => {
    if (editingCampaign && editingCampaign.idx !== undefined) {
      setCampaigns(campaigns.map((c, i) => i === editingCampaign.idx ? { ...c, ...updates } : c));
    }
    setEditingCampaign(null);
  };

  const handleManageListing = () => {
    setEditingListing({ provider: "Recovery First LLC", listing: "Downtown Recovery Center" });
  };

  const handleCloseListing = () => {
    setEditingListing(null);
  };

  const handleSaveMarketing = () => {
    // Marketing plan saved
  };

  const handleDownloadReport = () => {
    // Report downloaded
  };

  const handleWaiveSubscription = (providerName: string) => {
    setWaivingProvider(providerName);
    setShowSubscriptionWaiverModal(true);
  };

  const handleConfirmWaiver = () => {
    setShowSubscriptionWaiverModal(false);
    setWaivingProvider("");
  };

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
          <TabsList className="bg-card border border-border p-1 grid w-full grid-cols-7 lg:grid-cols-12 gap-1">
            <TabsTrigger value="overview" className="text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
            <TabsTrigger value="listings" className="text-xs">Listings</TabsTrigger>
            <TabsTrigger value="applications" className="text-xs">Apps</TabsTrigger>
            <TabsTrigger value="messaging" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="verification" className="text-xs">Verification</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">Reports ({reports.length})</TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs">Safety</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
            <TabsTrigger value="workflows" className="text-xs">Workflows</TabsTrigger>
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
                  {[].map((item, i) => (
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
                  <CardTitle className="text-white">User Management ({users.length})</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search users..." className="bg-background/50 border-white/10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Button size="sm" variant="outline">Filter</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === "Provider" ? "default" : "secondary"}>{user.role}</Badge>
                        <Badge variant={user.status === "Active" ? "default" : "outline"} className={user.status === "Active" ? "bg-green-500/80" : user.status === "Suspended" ? "bg-red-500/80" : "bg-amber-500/80"}>{user.status}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" onClick={() => handleEditUser(user)}>Edit</Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={`h-8 ${user.status === "Suspended" ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10"}`}
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            {user.status === "Suspended" ? "Unsuspend" : "Suspend"}
                          </Button>
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
                <CardTitle className="text-white">Listing Management ({listings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      listing.status === "Pending" ? "bg-amber-500/10 border-amber-500/20" :
                      listing.status === "Approved" ? "bg-green-500/10 border-green-500/20" :
                      "bg-red-500/10 border-red-500/20"
                    }`}>
                      <div className="flex gap-4 flex-1">
                        <img src={listing.image} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <p className="text-white font-medium">{listing.name}</p>
                          <p className="text-xs text-muted-foreground">{listing.address}, {listing.city}</p>
                          <div className="flex gap-2 mt-2">
                            {listing.isVerified && <Badge className="bg-green-500/80 text-xs">Verified</Badge>}
                            <Badge variant="outline" className="text-xs">${listing.price}/{listing.pricePeriod}</Badge>
                            <Badge variant="secondary" className="text-xs">{listing.bedsAvailable} beds</Badge>
                            <Badge className={
                              listing.status === "Pending" ? "bg-amber-500/80" :
                              listing.status === "Approved" ? "bg-green-500/80" :
                              "bg-red-500/80"
                            }>{listing.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleReviewListing(listing)} className="bg-primary/20 text-primary hover:bg-primary/30">Review</Button>
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
                <CardTitle className="text-white">Tenant Applications ({applications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                      app.status === "Approved" ? "bg-green-500/10 border-green-500/20" :
                      app.status === "Denied" ? "bg-red-500/10 border-red-500/20" :
                      app.status === "Needs Info" ? "bg-blue-500/10 border-blue-500/20" :
                      "bg-amber-500/10 border-amber-500/20"
                    }`}
                    onClick={() => handleViewApplication(app)}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-white font-medium">{app.tenantName}</p>
                          <p className="text-xs text-muted-foreground">{app.propertyName} • {new Date(app.submittedDate).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{app.email} • {app.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            app.status === "Approved" ? "bg-green-500/80" :
                            app.status === "Denied" ? "bg-red-500/80" :
                            app.status === "Needs Info" ? "bg-blue-500/80" :
                            "bg-amber-500/80"
                          }>{app.status}</Badge>
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">{app.completeness}% Complete</Badge>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${app.completeness}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Click to view full application and take action</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROVIDER VERIFICATION CENTER */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Provider Document Verification ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className={`p-4 rounded-lg border transition-colors ${
                      doc.status === "Approved" ? "bg-green-500/10 border-green-500/20" :
                      doc.status === "Rejected" ? "bg-red-500/10 border-red-500/20" :
                      "bg-amber-500/10 border-amber-500/20"
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-white font-bold">{doc.documentName}</p>
                          <p className="text-sm text-muted-foreground">Provider: {doc.provider}</p>
                          <p className="text-xs text-muted-foreground">{doc.providerEmail}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1"><FileText className="w-3 h-3" /> {doc.documentType}</Badge>
                            <Badge className="text-xs bg-gray-500/80">Submitted: {new Date(doc.uploadedDate).toLocaleDateString()}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            doc.status === "Approved" ? "bg-green-500/80" :
                            doc.status === "Rejected" ? "bg-red-500/80" :
                            "bg-amber-500/80"
                          }>{doc.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                          <Download className="w-3 h-3" /> Download
                        </Button>
                        {doc.status === "Pending Review" && (
                          <>
                            <Button size="sm" onClick={() => handleApproveDocument(doc.id)} className="h-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 gap-1 text-xs">
                              <Check className="w-3 h-3" /> Approve
                            </Button>
                            <Button size="sm" onClick={() => handleRejectDocument(doc.id)} variant="outline" className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1 text-xs">
                              <X className="w-3 h-3" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Required Documents Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Business License",
                    "Insurance Certificate",
                    "Facility Photos",
                    "Safety Compliance Report",
                    "Property Inspection Report"
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border/50">
                      <div className="w-4 h-4 rounded border border-primary/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-sm" />
                      </div>
                      <span className="text-sm text-white">{doc}</span>
                      <span className="text-xs text-muted-foreground ml-auto">Required for all providers</span>
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
                  <MessageSquare className="w-5 h-5" /> Message Moderation ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>All messages are clean</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg border ${msg.flagged ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-border/50"}`}>
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
                              <Button size="sm" onClick={() => handleClearFlag(msg.id)} variant="ghost" className="h-7 text-xs text-green-500 hover:bg-green-500/10">Clear</Button>
                              <Button size="sm" onClick={() => handleBanUser(msg.id)} variant="ghost" className="h-7 text-xs text-red-500 hover:bg-red-500/10">Ban User</Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LISTING REPORTS */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flag className="w-5 h-5" /> Listing Reports ({reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No reports yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className={`p-4 rounded-lg border ${
                        report.status === "New" ? "bg-red-500/10 border-red-500/20" :
                        report.status === "Investigating" ? "bg-amber-500/10 border-amber-500/20" :
                        "bg-green-500/10 border-green-500/20"
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-white font-bold">{report.propertyName}</p>
                            <p className="text-sm text-muted-foreground">Reported by: {report.userName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              report.category === "Safety" ? "bg-red-500/80" :
                              report.category === "Scam" ? "bg-orange-500/80" :
                              report.category === "Inappropriate Content" ? "bg-purple-500/80" :
                              report.category === "Contact Issues" ? "bg-blue-500/80" :
                              "bg-gray-500/80"
                            }>{report.category}</Badge>
                            <Badge className={
                              report.status === "New" ? "bg-red-500/80" :
                              report.status === "Investigating" ? "bg-amber-500/80" :
                              "bg-green-500/80"
                            }>{report.status}</Badge>
                          </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded mb-3 max-h-24 overflow-y-auto">
                          <p className="text-sm text-gray-300">{report.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {report.status === "New" && (
                            <>
                              <Button size="sm" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 h-8 text-xs" 
                                onClick={() => {
                                  updateReportStatus(report.id, "Investigating");
                                  setReports(getReports());
                                }}>
                                Investigate
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 h-8 text-xs">
                                Dismiss
                              </Button>
                            </>
                          )}
                          {report.status === "Investigating" && (
                            <>
                              <Button size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 h-8 text-xs"
                                onClick={() => {
                                  updateReportStatus(report.id, "Resolved");
                                  setReports(getReports());
                                }}>
                                Resolve
                              </Button>
                              <Button size="sm" variant="outline" className="border-primary/20 h-8 text-xs">Contact Provider</Button>
                            </>
                          )}
                          {report.status === "Resolved" && (
                            <span className="text-xs text-green-500 font-medium">✓ Marked as Resolved</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  {[].map((item, i) => (
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
                  {[].map((sub, i) => (
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
                  {[].map((listing, i) => (
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
                  <DollarSign className="w-5 h-5" /> Subscription Waivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Grant providers exemption from the $49/month subscription fee for partnerships, promotions, or community benefits.</p>
                <div className="space-y-2">
                  {[
                    { provider: "Recovery First LLC", status: "Active Waiver", reason: "Partnership Agreement", until: "Permanent" },
                    { provider: "Hope House", status: "No Waiver", reason: "-", until: "-" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.provider}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={item.status === "Active Waiver" ? "bg-green-500/80" : "bg-gray-600"}>{item.status}</Badge>
                        <Button onClick={() => handleWaiveSubscription(item.provider)} size="sm" variant="ghost" className="text-xs mt-2">
                          {item.status === "Active Waiver" ? "Manage" : "Grant Waiver"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Safety & Moderation Settings
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
                    {safetySettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => toggleSafetySettings(setting.id)}>
                        <span className="text-white text-sm">{setting.label}</span>
                        <div className={`w-10 h-6 rounded-full ${setting.enabled ? "bg-primary" : "bg-gray-600"} transition-colors`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6 flex gap-2">
                  <Button onClick={handleSaveSettings} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                  <Button onClick={handleResetSettings} variant="outline">Reset to Default</Button>
                  <Button onClick={handleExportData} variant="ghost" className="text-red-500 hover:bg-red-500/10 ml-auto">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MARKETING */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <h3 className="text-3xl font-bold text-white">3</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email Open Rate</p>
                      <h3 className="text-3xl font-bold text-white">34%</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lead Conversion</p>
                      <h3 className="text-3xl font-bold text-white">12.5%</h3>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Provider Onboarding Series", status: "Active", recipients: 145, sent: "Dec 1, 2024", opens: "52", clicks: "18" },
                  { name: "Tenant Recovery Resources", status: "Scheduled", recipients: 320, sent: "Dec 8, 2024", opens: "-", clicks: "-" },
                  { name: "Featured Listing Promotion", status: "Draft", recipients: 0, sent: "-", opens: "-", clicks: "-" },
                ].map((campaign, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.recipients} recipients</p>
                      </div>
                      <Badge className={campaign.status === "Active" ? "bg-green-500/80" : campaign.status === "Scheduled" ? "bg-blue-500/80" : "bg-gray-600"}>{campaign.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div><p className="text-muted-foreground">Sent</p><p className="text-white">{campaign.sent}</p></div>
                      <div><p className="text-muted-foreground">Opens</p><p className="text-white">{campaign.opens}</p></div>
                      <div><p className="text-muted-foreground">Clicks</p><p className="text-white">{campaign.clicks}</p></div>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEditCampaign(i)} size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-red-500" onClick={() => handleDeleteCampaign(i)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={handleCreateCampaign} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4">
                  <Plus className="w-4 h-4" /> Create Campaign
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" /> Featured Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">Promote provider listings to increase visibility and tenant applications.</p>
                {[
                  { provider: "Recovery First LLC", listing: "Downtown Recovery Center", boost: "2x Visibility", spent: "$98" },
                  { provider: "Hope House", listing: "Supportive Living Home", boost: "3x Visibility", spent: "$147" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.provider}</p>
                      <p className="text-xs text-muted-foreground">{item.listing}</p>
                      <p className="text-xs text-primary mt-1">{item.boost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{item.spent}</p>
                      <Button onClick={handleManageListing} size="sm" variant="outline" className="mt-2">Manage</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Marketing Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Welcome New Providers", type: "Email", uses: 24 },
                  { name: "Recovery Success Stories", type: "Social Post", uses: 12 },
                  { name: "Available Listings Alert", type: "SMS", uses: 156 },
                  { name: "Testimonial Campaign", type: "Email", uses: 8 },
                ].map((template, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.type} • Used {template.uses} times</p>
                    </div>
                    <Button onClick={() => { setNewCampaignName(template.name); setShowNewCampaignModal(true); }} size="sm" variant="ghost" className="text-xs">Use</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Email & SMS Marketing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email & SMS Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Mass Email Campaign</p>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Recipient Group</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm mt-1">
                          <option>All Tenants</option>
                          <option>All Providers</option>
                          <option>Active Subscribers</option>
                          <option>Inactive Users</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Subject</label>
                        <input type="text" placeholder="Email subject" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm mt-1" />
                      </div>
                      <Button onClick={handleSendCampaign} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">Send Campaign</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Automated Sequences</p>
                    <div className="space-y-2">
                      {["New Provider Onboarding (7 emails)", "Tenant Recovery Tips (Weekly)", "Renewal Reminders (30 days before)"].map((seq, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-xs text-gray-300">{seq}</span>
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-white font-semibold mb-2">SMS Marketing</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Select Audience</label>
                      <select value={smsAudience} onChange={(e) => setSmsAudience(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm mt-1">
                        <option>All Users</option>
                        <option>All Tenants</option>
                        <option>All Providers</option>
                        <option>Active Users</option>
                        <option>Inactive Users</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="SMS message (160 characters max)" 
                      maxLength={160} 
                      value={smsContent}
                      onChange={(e) => setSmsContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm" 
                      rows={3} 
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{smsContent.length}/160 characters</span>
                      <Button onClick={handleSendSMS} className="bg-primary text-primary-foreground hover:bg-primary/90">Send SMS</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Tools */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> SEO & Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Recovery Tips for New Residents", views: 2400, posts: 12, status: "Published" },
                    { title: "Understanding Sober Living", views: 1890, posts: 8, status: "Published" },
                    { title: "Finding the Right Recovery Home", views: 0, posts: 0, status: "Draft" },
                  ].map((blog, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{blog.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{blog.posts} articles</p>
                        </div>
                        <Badge className={blog.status === "Published" ? "bg-green-500/80" : "bg-gray-600"}>{blog.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-300 mb-3">{blog.views.toLocaleString()} views</div>
                      <div className="space-y-1">
                        <input type="text" placeholder="Meta description" className="w-full px-2 py-1 rounded text-xs bg-background/50 border border-white/10 text-white" />
                        <input type="text" placeholder="SEO keywords" className="w-full px-2 py-1 rounded text-xs bg-background/50 border border-white/10 text-white" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={handleCreateBlog} size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                        <Button onClick={handlePublishBlog} size="sm" variant="ghost" className="text-xs h-7">Publish</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleCreateBlog} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Plus className="w-4 h-4" /> Create Blog Post
                </Button>
              </CardContent>
            </Card>

            {/* Promo Codes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Promo Codes & Discounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Active Promo Codes</p>
                    {[
                      { code: "WELCOME25", discount: "25% off", target: "New Providers", used: "34/100" },
                      { code: "RECOVERY20", discount: "20% off", target: "Tenants", used: "128/500" },
                    ].map((promo, i) => (
                      <div key={i} className="mb-2 p-2 bg-background/50 rounded text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-primary">{promo.code}</span>
                          <span className="text-gray-300">{promo.used}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">{promo.discount} • {promo.target}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Create Promo Code</p>
                    <div className="space-y-2">
                      <input type="text" placeholder="Code (e.g., SUMMER30)" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm" />
                      <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm">
                        <option>10% off subscription</option>
                        <option>25% off subscription</option>
                        <option>Free featured listing</option>
                        <option>Free 3x visibility boost</option>
                      </select>
                      <input type="number" placeholder="Limit (0 = unlimited)" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm" />
                      <Button onClick={handleCreatePromo} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Create Code</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Ad Management & Featured Placements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Featured Home Placements</p>
                    <div className="space-y-2">
                      {[
                        { home: "Downtown Recovery Center", duration: "30 days", cost: "$199", status: "Active" },
                        { home: "Supportive Living Homes", duration: "7 days", cost: "$49", status: "Expiring Soon" },
                      ].map((ad, i) => (
                        <div key={i} className="p-2 bg-background/50 rounded-lg text-xs border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{ad.home}</span>
                            <Badge className={ad.status === "Active" ? "bg-green-500/80" : "bg-amber-500/80"}>{ad.status}</Badge>
                          </div>
                          <div className="text-gray-400">{ad.duration} • {ad.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Sponsored Listings</p>
                    <div className="space-y-2">
                      {[
                        { boost: "2x Visibility", price: "$49/week", impressions: "~5,000" },
                        { boost: "3x Visibility", price: "$99/week", impressions: "~12,000" },
                        { boost: "Top Placement", price: "$149/week", impressions: "~20,000+" },
                      ].map((spot, i) => (
                        <div key={i} className="p-2 bg-background/50 rounded-lg text-xs border border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{spot.boost}</span>
                            <span className="text-primary">{spot.price}</span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">{spot.impressions} estimated impressions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-white font-semibold mb-2">Launch New Ad Campaign</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select className="px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm">
                      <option>Select Ad Type</option>
                      <option>Featured Listing</option>
                      <option>Sponsored Placement</option>
                      <option>Promoted Home</option>
                    </select>
                    <input type="number" placeholder="Budget ($)" className="px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm" />
                    <Button onClick={handleLaunchAd} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10">Launch</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleSaveMarketing} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Marketing Plan</Button>
              <Button onClick={handleDownloadReport} variant="outline">Download Report</Button>
            </div>
          </TabsContent>

          {/* WORKFLOWS & AUTOMATION */}
          <TabsContent value="workflows" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Email Workflow Builder
                  </CardTitle>
                  <Button onClick={() => setShowWorkflowModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="w-4 h-4" /> Create Workflow
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300 mb-6">Automate email sequences and tenant/provider communications with intelligent workflows.</p>
                
                {workflows.length === 0 ? (
                  <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10 border-dashed">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No workflows yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Create your first automated email workflow</p>
                    <Button onClick={() => setShowWorkflowModal(true)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Create Workflow</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflows.map((workflow, i) => (
                      <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{workflow.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Trigger: {workflow.trigger} • Template: {workflow.template} • Status: {workflow.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs">Edit</Button>
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "welcome", name: "Welcome Series", desc: "3-email welcome sequence for new tenants", emails: 3 },
                  { id: "provider-onboard", name: "Provider Onboarding", desc: "Complete setup guide for new providers", emails: 5 },
                  { id: "app-approved", name: "Application Approved", desc: "Notify tenant after successful application", emails: 1 },
                  { id: "renewal-reminder", name: "Renewal Reminder", desc: "Remind providers about subscription renewal", emails: 2 },
                  { id: "success-story", name: "Success Stories", desc: "Share recovery testimonials monthly", emails: 4 },
                ].map((template) => (
                  <div key={template.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:border-primary/30 transition-colors">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.desc}</p>
                      <p className="text-xs text-primary mt-1">{template.emails} emails</p>
                    </div>
                    <Button onClick={() => { setNewWorkflowTemplate(template.id); setShowWorkflowModal(true); }} size="sm" variant="outline" className="h-8 text-xs">Use Template</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Workflow Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Workflows created this month</span>
                    <span className="text-white font-bold">{workflows.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Total emails sent via workflows</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Average open rate</span>
                    <span className="text-white font-bold">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showWorkflowModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
              <h2 className="text-xl font-bold text-white mb-4">Create Email Workflow</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Workflow Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., New Tenant Onboarding" 
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Workflow Trigger</label>
                  <select 
                    value={newWorkflowTrigger}
                    onChange={(e) => setNewWorkflowTrigger(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                  >
                    <option value="onSignup">On User Signup</option>
                    <option value="onApplicationApproved">Application Approved</option>
                    <option value="onApplicationSubmitted">Application Submitted</option>
                    <option value="onSubscriptionRenewal">Subscription Renewal</option>
                    <option value="onInactivity">30 Days Inactive</option>
                    <option value="manual">Manual Send</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Template</label>
                  <select 
                    value={newWorkflowTemplate}
                    onChange={(e) => setNewWorkflowTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                  >
                    <option value="welcome">Welcome Series</option>
                    <option value="provider-onboard">Provider Onboarding</option>
                    <option value="app-approved">Application Approved</option>
                    <option value="renewal-reminder">Renewal Reminder</option>
                    <option value="success-story">Success Stories</option>
                    <option value="blank">Blank Template</option>
                  </select>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Subject Line</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Welcome to Sober Stay!" 
                    value={newWorkflowSubject}
                    onChange={(e) => setNewWorkflowSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is what recipients see in their inbox</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Content</label>
                  <textarea 
                    placeholder="Write your email content here. You can use HTML or plain text. Variables: [name], [email], [role], [property]" 
                    value={newWorkflowBody}
                    onChange={(e) => setNewWorkflowBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm font-mono"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use [variable] syntax to personalize emails. Supports HTML formatting.</p>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary font-medium">Preview: This workflow will send emails when a user {newWorkflowTrigger === 'onSignup' ? 'signs up' : newWorkflowTrigger === 'onApplicationApproved' ? 'has an approved application' : 'triggers this event'}.</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => {
                    if (newWorkflowName.trim() && newWorkflowSubject.trim() && newWorkflowBody.trim()) {
                      setWorkflows([...workflows, { 
                        name: newWorkflowName, 
                        trigger: newWorkflowTrigger, 
                        template: newWorkflowTemplate,
                        subject: newWorkflowSubject,
                        body: newWorkflowBody,
                        status: "Active",
                        created: new Date().toLocaleDateString()
                      }]);
                      setShowWorkflowModal(false);
                      setNewWorkflowName("");
                      setNewWorkflowSubject("");
                      setNewWorkflowBody("");
                    }
                  }} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Create Workflow
                </Button>
                <Button 
                  onClick={() => {
                    setShowWorkflowModal(false);
                    setNewWorkflowName("");
                    setNewWorkflowSubject("");
                    setNewWorkflowBody("");
                  }} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {editingUser && (
          <UserEditModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={editingUser}
            onSave={handleSaveUser}
          />
        )}

        {reviewingListing && (
          <ListingReviewModal
            open={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            listing={reviewingListing}
            onApprove={handleApproveListing}
            onDeny={handleDenyListing}
          />
        )}

        {viewingApplication && (
          <ApplicationDetailsModal
            open={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setViewingApplication(null);
            }}
            application={viewingApplication}
            onApprove={handleApproveApplication}
            onDeny={handleDenyApplication}
            onRequestInfo={handleRequestApplicationInfo}
          />
        )}

        {showBlogModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">Create Blog Post</h2>
              <input 
                type="text" 
                placeholder="Blog title" 
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mb-2"
              />
              <div className="flex gap-1 mb-2 p-2 bg-background/30 rounded-lg">
                <Button size="sm" variant="ghost" onClick={() => setNewBlogContent(newBlogContent + " **bold** ")} className="text-xs">B</Button>
                <Button size="sm" variant="ghost" onClick={() => setNewBlogContent(newBlogContent + " *italic* ")} className="text-xs italic">I</Button>
                <Button size="sm" variant="ghost" onClick={() => setNewBlogContent(newBlogContent + " 😊 ")} className="text-xs">😊</Button>
                <Button size="sm" variant="ghost" onClick={() => setNewBlogContent(newBlogContent + " 🎉 ")} className="text-xs">🎉</Button>
                <Button size="sm" variant="ghost" onClick={() => setNewBlogContent(newBlogContent + " ❤️ ")} className="text-xs">❤️</Button>
              </div>
              <textarea 
                placeholder="Blog content (supports markdown, emojis, and formatting)" 
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mb-4 h-32"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveBlog} className="flex-1 bg-primary hover:bg-primary/90">Save as Draft</Button>
                <Button onClick={handlePublishBlog} className="flex-1 bg-green-600 hover:bg-green-700">Publish</Button>
                <Button onClick={() => setShowBlogModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showNewCampaignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Create New Campaign</h2>
              <input 
                type="text" 
                placeholder="Campaign name" 
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mb-3"
              />
              <label className="text-xs text-muted-foreground">Recipient Group</label>
              <select 
                value={newCampaignRecipients}
                onChange={(e) => setNewCampaignRecipients(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mb-4 text-sm"
              >
                <option>All Tenants</option>
                <option>All Providers</option>
                <option>Active Subscribers</option>
                <option>Inactive Users</option>
              </select>
              <div className="flex gap-2">
                <Button onClick={handleSaveNewCampaign} className="flex-1 bg-primary hover:bg-primary/90">Create</Button>
                <Button onClick={() => setShowNewCampaignModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">Edit Campaign</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Campaign Name</label>
                  <input 
                    type="text" 
                    defaultValue={editingCampaign.name}
                    id="campaign-name"
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select id="campaign-status" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white" defaultValue={editingCampaign.status}>
                    <option>Active</option>
                    <option>Scheduled</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Recipients: {editingCampaign.recipients}</label>
                  <select id="campaign-recipients" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mt-1">
                    <option>All Tenants</option>
                    <option>All Providers</option>
                    <option>Active Subscribers</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Subject/Preview</label>
                  <input type="text" placeholder="Email subject" className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleSaveCampaign({ name: (document.getElementById("campaign-name") as HTMLInputElement)?.value, status: (document.getElementById("campaign-status") as HTMLSelectElement)?.value })} className="flex-1 bg-primary hover:bg-primary/90">Save</Button>
                <Button onClick={() => setEditingCampaign(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {editingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Manage Featured Listing</h2>
              <p className="text-white mb-2">{editingListing.provider}</p>
              <p className="text-gray-400 mb-4 text-sm">{editingListing.listing}</p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground">Boost Level</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mt-1">
                    <option>2x Visibility - $49/week</option>
                    <option>3x Visibility - $99/week</option>
                    <option>Top Placement - $149/week</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mt-1">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCloseListing} className="flex-1 bg-primary hover:bg-primary/90">Apply</Button>
                <Button onClick={() => setEditingListing(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showSubscriptionWaiverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Waive Monthly Subscription</h2>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-200">Admin Action: This provider will be exempt from the $49/month subscription fee.</p>
              </div>
              <p className="text-white mb-4">Provider: <span className="font-semibold">{waivingProvider}</span></p>
              <div className="space-y-2 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground">Reason for Waiver</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mt-1">
                    <option>Partnership Agreement</option>
                    <option>Promotional Period</option>
                    <option>Community Benefit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white mt-1">
                    <option>Permanent</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>1 Year</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmWaiver} className="flex-1 bg-primary hover:bg-primary/90">Confirm Waiver</Button>
                <Button onClick={() => setShowSubscriptionWaiverModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
