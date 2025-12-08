import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "@/components/content-editor";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, MessageSquare, AlertCircle, 
  Plus, Check, X, MoreHorizontal, Search, ChevronRight,
  Bed, FileText, Settings, Lock, Mail, Phone, Upload, Shield, ToggleRight,
  Zap, BarChart3, FileArchive, Folder, Share2, TrendingUp, Calendar, Clock, MapPin, Video, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import type { Listing } from "@shared/schema";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PaymentModal } from "@/components/payment-modal";
import { isSubscriptionActive, getProviderSubscription } from "@/lib/subscriptions";
import { getAuth } from "@/lib/auth";
import { TourRequest } from "@/components/tour-schedule-modal";
import { ApplicationDetailsModal, ApplicationData } from "@/components/application-details-modal";

interface ChatMessage {
  sender: "tenant" | "provider";
  text: string;
  timestamp: Date;
}

interface Conversation {
  propertyId: string;
  propertyName: string;
  tenantName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Add authentication check component
function ProviderDashboardWrapper(props: any) {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const user = getAuth();
    if (!user || user.role !== "provider") {
      setLocation("/for-providers");
    }
  }, [setLocation]);
  
  const user = getAuth();
  if (!user || user.role !== "provider") {
    return null;
  }
  
  return <ProviderDashboardContent {...props} />;
}

// Applications will be fetched from the database - no test data

function ProviderDashboardContent() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  
  // Application Review State
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  
  // Beds Management State - initialized from real listings
  const [bedsAvailable, setBedsAvailable] = useState<Record<string, number>>({});

  // Marketing subsection and tab state
  const [activeTab, setActiveTab] = useState("overview");
  const [marketingSection, setMarketingSection] = useState<"overview" | "seo" | "campaign">("overview");
  
  // Provider listings from API
  const [listings, setListings] = useState<Listing[]>([]);

  const user = getAuth();

  const handleViewApplication = (app: ApplicationData) => {
    setSelectedApplication(app);
    setIsAppDetailsOpen(true);
  };

  const handleApproveApplication = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: "Approved" } : app
    ));
    // In a real app, this would trigger a backend update and maybe an email
  };

  const handleDenyApplication = (id: string, reason: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: "Denied" } : app
    ));
    // In a real app, this would log the reason
    console.log(`Application ${id} denied because: ${reason}`);
  };

  useEffect(() => {
    // Fetch provider's listings from API
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const data = await res.json();
          // Filter to only show listings owned by the current provider
          const providerListings = user?.id 
            ? data.filter((l: Listing) => l.providerId === user.id)
            : [];
          setListings(providerListings);
          
          // Load conversations based on real listings
          const allConversations: Conversation[] = [];
          providerListings.forEach((property: Listing) => {
            const key = `chat_${property.id}`;
            const stored = localStorage.getItem(key);
            if (stored) {
              try {
                const messages = JSON.parse(stored) as ChatMessage[];
                if (messages.length > 0) {
                  const lastMsg = messages[messages.length - 1];
                  const unreadFromTenant = messages.filter(m => m.sender === "tenant" && m.text).length;
                  allConversations.push({
                    propertyId: String(property.id),
                    propertyName: property.propertyName,
                    tenantName: "Interested Tenant",
                    lastMessage: lastMsg.text.substring(0, 60),
                    lastMessageTime: new Date(lastMsg.timestamp),
                    unreadCount: unreadFromTenant,
                  });
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          });
          setConversations(allConversations.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()));
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    
    fetchListings();

    // Load tour requests from localStorage
    const storedTours = localStorage.getItem("tour_requests");
    if (storedTours) {
      try {
        const tours = JSON.parse(storedTours) as TourRequest[];
        setTourRequests(tours);
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Check subscription status
    if (user?.id) {
      const isActive = isSubscriptionActive(user.id);
      setHasActiveSubscription(isActive);
      const sub = getProviderSubscription(user.id);
      setSubscriptionStatus(sub);
    }
  }, [user?.id]);

  const handleTourResponse = (tourId: string, status: "approved" | "denied" | "rescheduled", notes?: string) => {
    const updatedTours = tourRequests.map(tour =>
      tour.id === tourId ? { ...tour, status, providerNotes: notes } : tour
    );
    setTourRequests(updatedTours);
    localStorage.setItem("tour_requests", JSON.stringify(updatedTours));
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Provider Portal</h1>
            <p className="text-muted-foreground">Manage your properties and connect with tenants.</p>
            {subscriptionStatus && (
              <div className="mt-2 text-sm">
                <Badge className={subscriptionStatus.subscriptionStatus === "active" ? "bg-green-500/80" : "bg-amber-500/80"}>
                  {subscriptionStatus.subscriptionStatus === "active" ? `✓ Subscription Active · $${subscriptionStatus.monthlyFee}/month` : "No Active Subscription"}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setLocation("/analytics")}
              variant="outline"
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              data-testid="button-analytics"
            >
              <TrendingUp className="w-4 h-4" /> Analytics
            </Button>
            <Button 
              onClick={() => setLocation("/create-listing")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              data-testid="button-list-property"
            >
              <Plus className="w-4 h-4" /> List New Property
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex flex-wrap gap-2 h-auto justify-start rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Overview</TabsTrigger>
            <TabsTrigger value="properties" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Properties</TabsTrigger>
            <TabsTrigger value="messages" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Messages</TabsTrigger>
            <TabsTrigger value="inbox" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Applications</TabsTrigger>
            <TabsTrigger value="beds" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Bed className="w-4 h-4" /> Beds</TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Zap className="w-4 h-4" /> Marketing</TabsTrigger>
            <TabsTrigger value="files" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><FileArchive className="w-4 h-4" /> Files</TabsTrigger>
            <TabsTrigger value="verification" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Shield className="w-4 h-4" /> Verify</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
            <TabsTrigger value="tours" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Calendar className="w-4 h-4" /> Tour Requests</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <h3 className="text-3xl font-bold text-white">{applications.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-primary flex items-center gap-1">
                    <span className="font-bold">+12%</span> from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Beds Filled</p>
                      <h3 className="text-3xl font-bold text-white">18/24</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    75% occupancy rate
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                      <h3 className="text-3xl font-bold text-white">{conversations.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-primary font-bold">
                    {conversations.length > 0 ? `${conversations.filter(c => c.unreadCount > 0).length} active` : "Start connecting"}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                      <h3 className="text-3xl font-bold text-white">{applications.filter(a => a.status === "New" || a.status === "Screening").length}</h3>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="text-xs text-amber-500 font-bold">
                    Requires attention
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Recent Messages</h3>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.slice(0, 5).map((conv) => (
                      <div key={conv.propertyId} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-white text-sm">{conv.propertyName}</h4>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-white text-xs">{conv.unreadCount}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">No active conversations yet. Wait for tenants to chat!</p>
                )}
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Recent Applications</h3>
            <Card className="bg-card border-border overflow-hidden">
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4 font-medium">Applicant</th>
                      <th className="p-4 font-medium">Property</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">{app.applicantName}</td>
                        <td className="p-4 text-gray-300">{app.property}</td>
                        <td className="p-4 text-muted-foreground">{app.submittedDate}</td>
                        <td className="p-4">
                          <Badge variant={app.status === "New" ? "default" : app.status === "Approved" ? "secondary" : "outline"}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => handleViewApplication(app)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties">
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_PROPERTIES.map((home) => (
                <Card key={home.id} className="bg-card border-border group overflow-hidden">
                   <div className="relative h-40 overflow-hidden">
                      <img src={home.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2">
                        <Badge className={home.bedsAvailable > 0 ? "bg-green-500" : "bg-red-500"}>
                          {home.bedsAvailable} Beds Open
                        </Badge>
                      </div>
                   </div>
                   <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-1">{home.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{home.address}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setLocation(`/edit-listing/${home.id}`)} data-testid={`button-edit-${home.id}`}>Edit</Button>
                        <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={() => setLocation(`/edit-listing/${home.id}`)} data-testid={`button-manage-${home.id}`}>Manage</Button>
                      </div>
                   </CardContent>
                </Card>
              ))}
              
              <Card className="bg-card border-border border-dashed flex flex-col items-center justify-center h-full min-h-[250px] cursor-pointer hover:bg-white/5 transition-colors p-6">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-1">Add Property</h3>
                <p className="text-sm text-muted-foreground mb-6">List a new home</p>
                
                {/* Mock Form Preview (Visual only for prototype) */}
                <div className="w-full text-left space-y-4 border-t border-white/10 pt-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">New Listing Options</div>
                  
                  {/* Supervision Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-white flex items-center gap-1">
                      Supervision Type 
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </Label>
                    <RadioGroup defaultValue="Supported">
                      <div className="grid grid-cols-1 gap-2">
                         {Object.keys(SUPERVISION_DEFINITIONS).map(type => (
                           <div key={type} className="flex items-center space-x-2">
                             <RadioGroupItem value={type} id={`new-${type}`} className="h-3 w-3" />
                             <Label htmlFor={`new-${type}`} className="text-xs font-normal text-muted-foreground">{type}</Label>
                           </div>
                         ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Filters Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-white">Features</Label>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-mat" className="h-3 w-3" />
                         <Label htmlFor="new-mat" className="text-xs font-normal text-muted-foreground">MAT Friendly</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-pet" className="h-3 w-3" />
                         <Label htmlFor="new-pet" className="text-xs font-normal text-muted-foreground">Pet Friendly</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-insurance" className="h-3 w-3" />
                         <Label htmlFor="new-insurance" className="text-xs font-normal text-muted-foreground">Accepts Insurance</Label>
                       </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Tenant Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((conv) => (
                      <div key={conv.propertyId} className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                          <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white text-lg">{conv.propertyName}</h4>
                              <p className="text-sm text-muted-foreground">{conv.tenantName}</p>
                              <p className="text-xs text-muted-foreground mt-1">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-white">{conv.unreadCount} new</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last message {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No active conversations yet. Tenants will start chatting when they're interested!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPLICATIONS & INBOX TAB */}
          <TabsContent value="inbox">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Applications & Inbox</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
                  onClick={() => window.open('/apply/preview', '_blank')}
                >
                  <Eye className="w-4 h-4" /> Preview Application
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                   <div className="p-0 overflow-hidden rounded-md border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-muted-foreground border-b border-border">
                        <tr>
                          <th className="p-4 font-medium">Applicant</th>
                          <th className="p-4 font-medium">Property</th>
                          <th className="p-4 font-medium">Date</th>
                          <th className="p-4 font-medium">Risk Factors</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{app.applicantName}</td>
                            <td className="p-4 text-gray-300">{app.property}</td>
                            <td className="p-4 text-muted-foreground">{app.submittedDate}</td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                {app.probation && <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">Legal</Badge>}
                                {app.evictionHistory && <Badge variant="outline" className="text-red-500 border-red-500/30 text-[10px]">Eviction</Badge>}
                                {app.matStatus && <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-[10px]">MAT</Badge>}
                                {!app.probation && !app.evictionHistory && !app.matStatus && <span className="text-muted-foreground text-xs">-</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={app.status === "New" ? "default" : app.status === "Approved" ? "secondary" : app.status === "Denied" ? "destructive" : "outline"}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => handleViewApplication(app)}>Review</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BED MANAGER TAB */}
          <TabsContent value="beds" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {MOCK_PROPERTIES.map((property) => {
                const currentAvailable = bedsAvailable[property.id] ?? property.bedsAvailable;
                const occupancy = ((property.totalBeds - currentAvailable) / property.totalBeds) * 100;
                return (
                  <Card key={property.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{property.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Occupancy</span>
                          <span>{Math.round(occupancy)}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Available Beds</p>
                          <p className="text-3xl font-bold text-primary">{currentAvailable}</p>
                          <p className="text-xs text-muted-foreground">of {property.totalBeds}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (currentAvailable > 0) {
                                setBedsAvailable(prev => ({
                                  ...prev,
                                  [property.id]: currentAvailable - 1
                                }));
                              }
                            }}
                            data-testid={`button-decrease-beds-${property.id}`}
                          >
                            -
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (currentAvailable < property.totalBeds) {
                                setBedsAvailable(prev => ({
                                  ...prev,
                                  [property.id]: currentAvailable + 1
                                }));
                              }
                            }}
                            data-testid={`button-increase-beds-${property.id}`}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* MARKETING & SEO TAB */}
          <TabsContent value="marketing" className="space-y-6">
            {marketingSection === "seo" && (
              <Card className="bg-primary/10 border border-primary/50 mb-4">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2"><TrendingUp className="w-5 h-5" /> SEO Optimization Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Optimize your listings for maximum visibility in search results.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 border border-primary/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Automatic Keyword Targeting</h4>
                          <p className="text-xs text-muted-foreground mt-1">We optimize your listings for "sober living homes", "recovery housing", "sober living near me", "halfway houses", and more relevant keywords to your market.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-primary/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Social Media Integration</h4>
                          <p className="text-xs text-muted-foreground mt-1">Share listings to social media with one click - reaches more potential residents on Facebook, Instagram, LinkedIn, and Twitter. One-click sharing to expand your reach.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> SEO Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Boost your listing visibility with our built-in SEO tools.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Automatic Keyword Targeting</h4>
                          <p className="text-xs text-muted-foreground mt-1">We optimize your listings for "sober living homes", "recovery housing", and more.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Social Media Integration</h4>
                          <p className="text-xs text-muted-foreground mt-1">Share listings to social media with one click - reaches more potential residents.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                    onClick={() => setLocation("/seo-tools")}
                    data-testid="button-view-seo"
                  >
                    View SEO Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Marketing Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Reach more qualified applicants with our marketing suite.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-500/20 p-2 rounded text-amber-500">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Email Campaigns</h4>
                          <p className="text-xs text-muted-foreground mt-1">Send targeted emails to interested tenants - included with your subscription.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-500/20 p-2 rounded text-amber-500">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Analytics & Insights</h4>
                          <p className="text-xs text-muted-foreground mt-1">Track views, clicks, and applications - see what's working for your listings.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-amber-500 text-white hover:bg-amber-600"
                    onClick={() => {
                      setActiveTab("marketing");
                      setMarketingSection("campaign");
                    }}
                    data-testid="button-launch-campaign"
                  >
                    Launch Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Marketing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">2,847</div>
                    <p className="text-xs text-muted-foreground">Total Views This Month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">342</div>
                    <p className="text-xs text-muted-foreground">New Clicks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">24</div>
                    <p className="text-xs text-muted-foreground">Applications Generated</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-1">8.4%</div>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {marketingSection === "campaign" && (
              <Card className="bg-amber-500/10 border border-amber-500/50 mb-4">
                <CardHeader>
                  <CardTitle className="text-amber-300 flex items-center gap-2"><Mail className="w-5 h-5" /> Email Campaign Editor</CardTitle>
                </CardHeader>
              </Card>
            )}
            <ContentEditor />
          </TabsContent>

          {/* DIGITAL RESIDENT FILES TAB */}
          <TabsContent value="files" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><FileArchive className="w-5 h-5 text-primary" /> Digital Resident Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">Securely store and manage all resident documents in one place. All files are encrypted and compliant with privacy regulations.</p>
                
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Upload New Files</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload applications, background checks, references, and more.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Recent Resident Files</h3>
                  {[
                    { name: "John Doe - Application + Background Check", size: "2.4 MB", date: "Today" },
                    { name: "Sarah Jones - Reference Letters", size: "1.1 MB", date: "Yesterday" },
                    { name: "Michael Smith - Employment Verification", size: "0.8 MB", date: "2 days ago" },
                    { name: "Emma Wilson - Financial Records", size: "3.2 MB", date: "1 week ago" },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary hover:bg-primary/10"
                          onClick={() => window.open(`data:text/plain;base64,${btoa(file.name)}`, '_blank')}
                          data-testid={`button-view-file-${i}`}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:bg-white/10"
                          onClick={() => {
                            const element = document.createElement("a");
                            element.setAttribute("href", `data:text/plain;base64,${btoa(file.name)}`);
                            element.setAttribute("download", file.name);
                            element.style.display = "none";
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          data-testid={`button-download-file-${i}`}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy & Security</h4>
                  <ul className="text-sm text-emerald-100/80 space-y-1">
                    <li>✓ All files encrypted at rest and in transit</li>
                    <li>✓ HIPAA-compliant storage</li>
                    <li>✓ Audit logs for all file access</li>
                    <li>✓ Automatic backup and recovery</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VERIFICATION TAB */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Verification Status</CardTitle>
                  <Badge className="bg-amber-500/80">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground">Submit the following documents to get verified on Sober Stay and unlock featured listing benefits.</p>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Business License", status: "uploaded", icon: "📄" },
                      { name: "Insurance Certificate", status: "pending", icon: "📋" },
                      { name: "Property Photos", status: "uploaded", icon: "📸" },
                      { name: "Safety Certifications", status: "pending", icon: "✓" }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{doc.icon}</span>
                          <div>
                            <p className="text-white font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{doc.status}</p>
                          </div>
                        </div>
                        <Button size="sm" className="gap-2" variant={doc.status === "uploaded" ? "outline" : "default"}>
                          <Upload className="w-4 h-4" /> {doc.status === "uploaded" ? "Update" : "Upload"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold text-white mb-3">Verification Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Featured listing placement</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Verified badge on all properties</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Priority support</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Higher tenant trust</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Email Address</Label>
                    <Input placeholder="provider@example.com" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Phone Number</Label>
                    <Input placeholder="+1 (555) 000-0000" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                  </div>
                  <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">Update Information</Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <ToggleRight className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-white font-medium text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary/50">Enable</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Change Password</Label>
                    <Input type="password" placeholder="Current password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Input type="password" placeholder="New password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Input type="password" placeholder="Confirm password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "New tenant inquiries", desc: "Get notified about new messages" },
                      { label: "Application updates", desc: "Alerts when tenants update applications" },
                      { label: "Marketing emails", desc: "New features and platform updates" },
                      { label: "Security alerts", desc: "Important account security notices" }
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                        <div>
                          <p className="text-white text-sm font-medium">{notif.label}</p>
                          <p className="text-xs text-muted-foreground">{notif.desc}</p>
                        </div>
                        <Checkbox className="h-5 w-5 border-primary/50" defaultChecked={i < 2} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TOUR REQUESTS */}
          <TabsContent value="tours" className="space-y-6">
            <h3 className="text-xl font-bold text-white">Tour Scheduling Requests</h3>
            {tourRequests.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tour requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tourRequests.map((tour) => (
                  <Card key={tour.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-white text-lg mb-2">{tour.propertyName}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 text-primary" />
                              {tour.tenantName} ({tour.tenantEmail})
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {tour.tourType === "virtual" ? (
                                <><Video className="w-4 h-4 text-primary" /> Virtual Tour</>
                              ) : (
                                <><MapPin className="w-4 h-4 text-primary" /> In-Person Tour</>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              {new Date(tour.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              {tour.time}
                            </div>
                          </div>
                        </div>
                        <div className="md:text-right">
                          <Badge 
                            className={`mb-2 ${
                              tour.status === "approved" ? "bg-green-500/80" :
                              tour.status === "denied" ? "bg-red-500/80" :
                              tour.status === "rescheduled" ? "bg-amber-500/80" :
                              "bg-blue-500/80"
                            }`}
                          >
                            {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {tour.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                          <Button
                            onClick={() => handleTourResponse(tour.id, "approved")}
                            className="flex-1 bg-green-600/80 hover:bg-green-600 text-white gap-2"
                            data-testid={`button-approve-tour-${tour.id}`}
                          >
                            <Check className="w-4 h-4" /> Approve
                          </Button>
                          <Button
                            onClick={() => handleTourResponse(tour.id, "rescheduled", "Please suggest alternative times")}
                            className="flex-1 bg-amber-600/80 hover:bg-amber-600 text-white gap-2"
                            data-testid={`button-reschedule-tour-${tour.id}`}
                          >
                            <Clock className="w-4 h-4" /> Reschedule
                          </Button>
                          <Button
                            onClick={() => handleTourResponse(tour.id, "denied")}
                            variant="outline"
                            className="flex-1 border-red-500/50 hover:bg-red-500/10 gap-2"
                            data-testid={`button-deny-tour-${tour.id}`}
                          >
                            <X className="w-4 h-4" /> Deny
                          </Button>
                        </div>
                      )}
                      
                      {tour.providerNotes && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Your Response:</p>
                          <p className="text-sm text-gray-300">{tour.providerNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ApplicationDetailsModal 
          open={isAppDetailsOpen}
          onClose={() => setIsAppDetailsOpen(false)}
          application={selectedApplication}
          onApprove={handleApproveApplication}
          onDeny={handleDenyApplication}
        />

        <PaymentModal 
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setHasActiveSubscription(true);
            if (user?.id) {
              const sub = getProviderSubscription(user.id);
              setSubscriptionStatus(sub);
            }
          }}
          providerId={user?.id || ""}
        />
      </div>
    </Layout>
  );
}

export function ProviderDashboard() {
  return <ProviderDashboardWrapper />;
}
