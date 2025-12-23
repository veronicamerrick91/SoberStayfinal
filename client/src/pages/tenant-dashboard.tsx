import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, FileText, MessageSquare, Heart, Bell, Eye, CalendarCheck,
  Clock, CheckCircle, XCircle, ChevronRight, MapPin, Send, 
  Zap, Settings, LogOut, User, Phone, Mail, Calendar, Shield, Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Listing } from "@shared/schema";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getFavorites } from "@/lib/favorites";
import { logout, getAuth, saveAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getEngagementStats, getRecoveryBadges, getNextStep, getDaysClean, getViewedHomes, fetchServerViewedHomes, getTourRequests, TourRequest } from "@/lib/tenant-engagement";
import { getSubmittedApplications, initializeSampleApplications, SubmittedApplication } from "@/lib/application-profile";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  sender: "tenant" | "provider";
  text: string;
  timestamp: Date;
}

interface Conversation {
  propertyId: string;
  propertyName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface TenantProfile {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  sobrietyDate: string;
  supportNeeds: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bio: string;
}


// Wrapper component for authentication check
export function TenantDashboard() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const user = getAuth();
    if (!user || user.role !== "tenant") {
      setLocation("/login");
    }
  }, [setLocation]);
  
  const user = getAuth();
  if (!user || user.role !== "tenant") {
    return null;
  }
  
  return <TenantDashboardContent />;
}

function TenantDashboardContent() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedHomes, setSavedHomes] = useState<Listing[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<SubmittedApplication | null>(null);
  const [submittedApplications, setSubmittedApplications] = useState<SubmittedApplication[]>([]);
  const [activeTab, setActiveTab] = useState("messages");
  const { toast } = useToast();
  const user = getAuth();
  
  const [engagementStats, setEngagementStats] = useState(getEngagementStats());
  const [recoveryBadges, setRecoveryBadges] = useState(getRecoveryBadges(""));
  const [daysClean, setDaysClean] = useState(0);
  const [viewedHomes, setViewedHomes] = useState<Listing[]>([]);
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState<TenantProfile>(() => {
    const saved = localStorage.getItem("tenant_profile");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      preferredContact: "email",
      sobrietyDate: "",
      supportNeeds: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      bio: ""
    };
  });

  const handleProfileSave = () => {
    localStorage.setItem("tenant_profile", JSON.stringify(profile));
    if (user) {
      saveAuth({ ...user, name: profile.name, email: profile.email });
    }
    
    const oldBadges = recoveryBadges;
    const newBadges = getRecoveryBadges(profile.sobrietyDate);
    const newDays = getDaysClean(profile.sobrietyDate);
    
    setRecoveryBadges(newBadges);
    setDaysClean(newDays);
    
    const newlyUnlocked = newBadges.filter(
      (badge) => badge.unlocked && !oldBadges.find((old) => old.id === badge.id && old.unlocked)
    );
    
    if (newlyUnlocked.length > 0) {
      const badgeNames = newlyUnlocked.map(b => `${b.icon} ${b.name}`).join(", ");
      toast({
        title: "🎉 Badge Unlocked!",
        description: `Congratulations! You've earned: ${badgeNames}`,
      });
    } else if (newDays > 0) {
      toast({
        title: "Profile Updated",
        description: `${newDays} days clean - keep going! You're doing amazing.`,
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    }
    setShowProfileModal(false);
  };

  const calculateProfileCompletion = () => {
    const fields = [profile.name, profile.email, profile.phone, profile.sobrietyDate, profile.emergencyContactName, profile.emergencyContactPhone, profile.bio];
    const filled = fields.filter(f => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    // Fetch listings from API and load user data
    const loadData = async () => {
      try {
        const response = await fetch('/api/listings');
        const listings: Listing[] = response.ok ? await response.json() : [];
        
        // Load all conversations from localStorage based on real listings
        const allConversations: Conversation[] = [];
        listings.forEach(listing => {
          const key = `chat_${listing.id}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const messages = JSON.parse(stored) as ChatMessage[];
              if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                allConversations.push({
                  propertyId: String(listing.id),
                  propertyName: listing.propertyName,
                  lastMessage: lastMsg.text.substring(0, 60),
                  lastMessageTime: new Date(lastMsg.timestamp),
                  unreadCount: messages.filter(m => m.sender === "provider").length,
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        });

        setConversations(allConversations.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()));

        // Load saved homes (favorites) - match against real listings
        const favorites = getFavorites();
        const favorited = listings.filter(p => favorites.includes(String(p.id)));
        setSavedHomes(favorited);
        
        // Load viewed homes - fetch from server first, then match against real listings
        await fetchServerViewedHomes();
        const viewedData = getViewedHomes();
        const viewedProperties = viewedData
          .map(v => listings.find(p => String(p.id) === v.propertyId))
          .filter((p): p is Listing => p !== undefined);
        setViewedHomes(viewedProperties);
        
        // Update engagement stats with saved homes count and viewed homes count
        setEngagementStats(prev => ({ ...prev, savedHomes: favorited.length, homesViewed: viewedProperties.length }));
      } catch (error) {
        console.error('Failed to load listings:', error);
      }
    };

    // Fetch applications from API
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications', { credentials: 'include' });
        if (res.ok) {
          const apps = await res.json();
          // Fetch listing details for each application
          const appsWithDetails: SubmittedApplication[] = await Promise.all(
            apps.map(async (app: any) => {
              let propertyName = 'Unknown Property';
              try {
                const listingRes = await fetch(`/api/listings/${app.listingId}`);
                if (listingRes.ok) {
                  const listing = await listingRes.json();
                  propertyName = listing.propertyName;
                }
              } catch {}
              return {
                id: String(app.id),
                propertyId: String(app.listingId),
                propertyName,
                submittedAt: app.createdAt,
                status: app.status === 'approved' ? 'approved' : 
                        app.status === 'rejected' ? 'denied' : 
                        app.status === 'pending' ? 'pending' : 'under_review',
                applicationData: app.applicationData || {}
              };
            })
          );
          setSubmittedApplications(appsWithDetails);
          // Update engagement stats
          setEngagementStats(prev => ({
            ...prev,
            applicationsSubmitted: appsWithDetails.length,
            approvalsReceived: appsWithDetails.filter(a => a.status === 'approved').length
          }));
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        // Fall back to localStorage
        setSubmittedApplications(getSubmittedApplications());
      }
    };
    
    // Load all data in parallel and set loading to false when done
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadData(), fetchApplications()]);
      } finally {
        // Load tour requests
        setTourRequests(getTourRequests());
        
        // Load recovery badges based on profile sobriety date
        const savedProfile = localStorage.getItem("tenant_profile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setRecoveryBadges(getRecoveryBadges(parsed.sobrietyDate));
          setDaysClean(getDaysClean(parsed.sobrietyDate));
        }
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  const handleSignOut = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-primary/20 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-heading font-bold text-white mb-2">Welcome, {user?.name || "Tenant"}</h1>
                <p className="text-muted-foreground text-lg">Find your safe home, connect with providers, build your recovery journey</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowProfileModal(true)} variant="outline" className="gap-2 border-primary/50" data-testid="settings-button">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Progress Dashboard */}
          {isLoading ? (
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("viewed")} data-testid="stat-homes-viewed">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Homes Viewed</p>
                    <h3 className="text-3xl font-bold text-white">{viewedHomes.length}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Home className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Properties explored</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("saved")} data-testid="stat-saved-homes">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Saved Homes</p>
                    <h3 className="text-3xl font-bold text-white">{savedHomes.length}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">In your favorites</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("applications")} data-testid="stat-applications">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applications</p>
                    <h3 className="text-3xl font-bold text-white">{engagementStats.applicationsSubmitted}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-primary font-bold">{engagementStats.approvalsReceived} approved</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setShowProfileModal(true)} data-testid="profile-status-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile</p>
                    <h3 className="text-3xl font-bold text-white">{calculateProfileCompletion()}%</h3>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <Progress value={calculateProfileCompletion()} className="h-1.5" />
              </CardContent>
            </Card>

            {/* Next Step Card */}
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setLocation(getNextStep(engagementStats).path)} data-testid="next-step-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-primary">Next Step</p>
                    <h3 className="text-lg font-bold text-white">{getNextStep(engagementStats).title}</h3>
                  </div>
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{getNextStep(engagementStats).action}</p>
              </CardContent>
            </Card>
          </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex flex-wrap gap-2 h-auto justify-start rounded-lg shadow-sm">
              <TabsTrigger value="messages" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <MessageSquare className="w-4 h-4" />
                Messages {conversations.length > 0 && <Badge className="bg-primary text-white ml-1">{conversations.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <Heart className="w-4 h-4" />
                Saved Homes {savedHomes.length > 0 && <Badge className="bg-primary text-white ml-1">{savedHomes.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="viewed" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <Eye className="w-4 h-4" />
                Viewed Homes {viewedHomes.length > 0 && <Badge className="bg-primary text-white ml-1">{viewedHomes.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <FileText className="w-4 h-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="tours" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <CalendarCheck className="w-4 h-4" />
                Tour Requests {tourRequests.length > 0 && <Badge className="bg-primary text-white ml-1">{tourRequests.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="recovery" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <Shield className="w-4 h-4" />
                Recovery Milestones {recoveryBadges.filter(b => b.unlocked).length > 0 && <Badge className="bg-primary text-white ml-1">{recoveryBadges.filter(b => b.unlocked).length}</Badge>}
              </TabsTrigger>
            </TabsList>

            {/* MESSAGES TAB */}
            <TabsContent value="messages" className="space-y-6">
              {conversations.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {conversations.map((conv) => (
                      <Card key={conv.propertyId} className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group overflow-hidden" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-white group-hover:text-primary transition-colors text-lg">{conv.propertyName}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-white ml-2 shrink-0">{conv.unreadCount}</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">{conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 gap-2">
                              <Send className="w-3 h-3" /> Open Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Conversations</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-sm">Start connecting with providers by chatting about listings you're interested in</p>
                    <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Browse Homes & Chat
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SAVED HOMES TAB */}
            <TabsContent value="saved" className="space-y-6">
              {savedHomes.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {savedHomes.map((home) => (
                    <Card key={home.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 group" onClick={() => setLocation(`/property/${home.id}`)}>
                      <div className="relative h-48 overflow-hidden cursor-pointer">
                        {home.photos && home.photos.length > 0 ? (
                          <img src={home.photos[0]} alt={home.propertyName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <Home className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-primary text-white">Saved</Badge>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <p className="text-white font-bold text-lg">${home.monthlyPrice}/month</p>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors">{home.propertyName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {home.city}, {home.state}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button size="sm" variant="outline" className="flex-1 border-primary/50" onClick={(e) => { e.stopPropagation(); setLocation(`/property/${home.id}`); }}>
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1 bg-primary/20 text-primary hover:bg-primary/30" onClick={(e) => { e.stopPropagation(); setLocation(`/chat/${home.id}`); }}>
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Saved Homes Yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-sm">Click the heart icon on any listing to save it for later</p>
                    <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Browse Homes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* VIEWED HOMES TAB */}
            <TabsContent value="viewed" className="space-y-6">
              {viewedHomes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {viewedHomes.map((home) => (
                    <Card key={home.id} className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden" onClick={() => setLocation(`/property/${home.id}`)} data-testid={`viewed-home-${home.id}`}>
                      <div className="relative">
                        {home.photos && home.photos.length > 0 ? (
                          <img src={home.photos[0]} alt={home.propertyName} loading="lazy" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-40 bg-primary/20 flex items-center justify-center">
                            <Home className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500/90 text-white">
                            <Eye className="w-3 h-3 mr-1" />
                            Viewed
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md">
                          <p className="text-white font-bold text-lg">${home.monthlyPrice}/month</p>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors">{home.propertyName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {home.city}, {home.state}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button size="sm" variant="outline" className="flex-1 border-primary/50" onClick={(e) => { e.stopPropagation(); setLocation(`/property/${home.id}`); }}>
                            View Again
                          </Button>
                          <Button size="sm" className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={(e) => { e.stopPropagation(); setLocation(`/apply/${home.id}`); }}>
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Eye className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Viewed Homes Yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-sm">Start exploring sober living homes to track the ones you've viewed</p>
                    <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Browse Homes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* APPLICATIONS TAB */}
            <TabsContent value="applications" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Your Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submittedApplications.length > 0 ? (
                    <div className="space-y-4">
                      {submittedApplications.map((app) => {
                        const getStatusDisplay = (status: string) => {
                          switch (status) {
                            case "under_review": return { label: "Under Review", icon: "📋", variant: "default" as const, progress: 60 };
                            case "action_required": return { label: "Action Required", icon: "⚠️", variant: "destructive" as const, progress: 40 };
                            case "approved": return { label: "Approved", icon: "✅", variant: "default" as const, progress: 100 };
                            case "denied": return { label: "Denied", icon: "❌", variant: "destructive" as const, progress: 100 };
                            default: return { label: "Pending", icon: "✓", variant: "secondary" as const, progress: 20 };
                          }
                        };
                        const statusInfo = getStatusDisplay(app.status);
                        return (
                          <div 
                            key={app.id} 
                            className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer hover:bg-white/10"
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowApplicationModal(true);
                            }}
                            data-testid={`application-card-${app.id}`}
                          >
                            <div className="text-3xl">{statusInfo.icon}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-white">{app.propertyName}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Submitted {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                                  </p>
                                </div>
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={statusInfo.progress} className="h-2 flex-1" />
                                <span className="text-xs text-muted-foreground font-medium">{statusInfo.progress}%</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground mb-6">Start browsing homes and submit applications to track them here</p>
                      <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground">
                        Browse Homes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TOUR REQUESTS TAB */}
            <TabsContent value="tours" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    Tour Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tourRequests.length > 0 ? (
                    <div className="space-y-4">
                      {tourRequests.map((tour) => {
                        return (
                          <div 
                            key={tour.id} 
                            className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer hover:bg-white/10"
                            onClick={() => setLocation(`/property/${tour.propertyId}`)}
                            data-testid={`tour-request-${tour.id}`}
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-primary/20 flex items-center justify-center">
                              <CalendarCheck className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-white">{tour.propertyName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {new Date(tour.date).toLocaleDateString()} at {tour.time}
                                  </p>
                                </div>
                                <Badge 
                                  className={
                                    tour.status === "approved" 
                                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                      : tour.status === "denied" 
                                        ? "bg-red-500/20 text-red-400 border-red-500/30" 
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  }
                                >
                                  {tour.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {tour.status === "denied" && <XCircle className="w-3 h-3 mr-1" />}
                                  {tour.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                  {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Requested {formatDistanceToNow(new Date(tour.createdAt), { addSuffix: true })}
                              </p>
                              {tour.providerMessage && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{tour.providerMessage}"
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <CalendarCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Tour Requests Yet</h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-sm">
                        Schedule a tour on any property page to see your requests here
                      </p>
                      <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Browse Homes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* RECOVERY TAB */}
            <TabsContent value="recovery" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Your Recovery Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Days Clean Counter */}
                  <div className="text-center py-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/30">
                    {daysClean > 0 ? (
                      <>
                        <div className="text-6xl font-bold text-white mb-2">{daysClean}</div>
                        <div className="text-xl text-primary font-medium">Days Clean</div>
                        <p className="text-muted-foreground mt-2">Keep going - you're doing amazing!</p>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl mb-4">🌱</div>
                        <div className="text-xl text-white font-medium mb-2">Start Your Journey</div>
                        <p className="text-muted-foreground mb-4">Set your sobriety date in your profile to track your progress</p>
                        <Button onClick={() => setShowProfileModal(true)} className="bg-primary text-white">
                          <Calendar className="w-4 h-4 mr-2" />
                          Set Sobriety Date
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Recovery Milestones */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recovery Milestones</h3>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {recoveryBadges.map((badge) => (
                        <div 
                          key={badge.id}
                          className={`relative p-4 rounded-xl border text-center transition-all ${
                            badge.unlocked 
                              ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50" 
                              : "bg-white/5 border-border/50 opacity-60"
                          }`}
                          data-testid={`badge-${badge.id}`}
                        >
                          {badge.unlocked && (
                            <div className="absolute -top-2 -right-2">
                              <CheckCircle className="w-6 h-6 text-primary bg-card rounded-full" />
                            </div>
                          )}
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <div className={`font-bold ${badge.unlocked ? "text-white" : "text-muted-foreground"}`}>
                            {badge.name}
                          </div>
                          {badge.unlocked ? (
                            <div className="text-xs text-primary mt-1">Unlocked!</div>
                          ) : (
                            <div className="text-xs text-muted-foreground mt-1">
                              {daysClean > 0 ? `${badge.days - daysClean} days to go` : `${badge.days} days`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Encouragement Section */}
                  {daysClean > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-white mb-3">Your Progress</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next milestone:</span>
                          <span className="text-white font-medium">
                            {recoveryBadges.find(b => !b.unlocked)?.name || "All milestones achieved! 🎉"}
                          </span>
                        </div>
                        {recoveryBadges.find(b => !b.unlocked) && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-primary">
                                {Math.round((daysClean / (recoveryBadges.find(b => !b.unlocked)?.days || 1)) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={(daysClean / (recoveryBadges.find(b => !b.unlocked)?.days || 1)) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button onClick={() => setLocation("/browse")} className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Home className="w-5 h-5" />
                Browse More Homes
              </Button>
              <Button onClick={() => setActiveTab("messages")} variant="outline" className="h-12 gap-2 border-primary/50">
                <MessageSquare className="w-5 h-5" />
                View Messages
              </Button>
              <Button onClick={() => setShowProfileModal(true)} variant="outline" className="h-12 gap-2 border-primary/50" data-testid="edit-profile-button">
                <Settings className="w-5 h-5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Edit Your Profile
            </DialogTitle>
            <DialogDescription>
              Complete your profile to help providers understand your needs and improve your housing matches.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Your full name"
                    className="bg-background/50"
                    data-testid="input-profile-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="your@email.com"
                    className="bg-background/50"
                    data-testid="input-profile-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="bg-background/50"
                    data-testid="input-profile-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select value={profile.preferredContact} onValueChange={(v) => setProfile({...profile, preferredContact: v})}>
                    <SelectTrigger className="bg-background/50" data-testid="select-preferred-contact">
                      <SelectValue placeholder="Select preferred contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Recovery Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recovery Journey
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sobrietyDate">Sobriety Date</Label>
                  <Input 
                    id="sobrietyDate" 
                    type="date"
                    value={profile.sobrietyDate} 
                    onChange={(e) => setProfile({...profile, sobrietyDate: e.target.value})}
                    className="bg-background/50"
                    data-testid="input-sobriety-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportNeeds">Support Needs</Label>
                  <Select value={profile.supportNeeds} onValueChange={(v) => setProfile({...profile, supportNeeds: v})}>
                    <SelectTrigger className="bg-background/50" data-testid="select-support-needs">
                      <SelectValue placeholder="Select your support level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal - Independent living</SelectItem>
                      <SelectItem value="moderate">Moderate - Some structure needed</SelectItem>
                      <SelectItem value="intensive">Intensive - Full support program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Emergency Contact
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input 
                    id="emergencyName" 
                    value={profile.emergencyContactName} 
                    onChange={(e) => setProfile({...profile, emergencyContactName: e.target.value})}
                    placeholder="Emergency contact name"
                    className="bg-background/50"
                    data-testid="input-emergency-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input 
                    id="emergencyPhone" 
                    type="tel"
                    value={profile.emergencyContactPhone} 
                    onChange={(e) => setProfile({...profile, emergencyContactPhone: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="bg-background/50"
                    data-testid="input-emergency-phone"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About You
              </h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Tell providers about yourself</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Share a bit about yourself, your goals, and what you're looking for in housing..."
                  className="bg-background/50 min-h-[100px]"
                  data-testid="textarea-bio"
                />
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Profile Completion</span>
                <span className="text-sm font-bold text-primary">{calculateProfileCompletion()}%</span>
              </div>
              <Progress value={calculateProfileCompletion()} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to increase visibility to providers
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowProfileModal(false)} className="flex-1" data-testid="button-cancel-profile">
              Cancel
            </Button>
            <Button onClick={handleProfileSave} className="flex-1 bg-primary text-primary-foreground" data-testid="button-save-profile">
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Details Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Application Preview
            </DialogTitle>
            <DialogDescription>
              View your submitted application details and status
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg border ${
                selectedApplication.status === "under_review" 
                  ? "bg-blue-500/10 border-blue-500/30" 
                  : selectedApplication.status === "action_required"
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : selectedApplication.status === "approved"
                  ? "bg-green-500/10 border-green-500/30"
                  : selectedApplication.status === "denied"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-primary/10 border-primary/30"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedApplication.propertyName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${
                    selectedApplication.status === "approved" ? "bg-green-500" :
                    selectedApplication.status === "denied" ? "bg-red-500" :
                    selectedApplication.status === "action_required" ? "bg-yellow-500" :
                    "bg-blue-500"
                  }`}>
                    {selectedApplication.status === "under_review" ? "Under Review" :
                     selectedApplication.status === "action_required" ? "Action Required" :
                     selectedApplication.status === "approved" ? "Approved" :
                     selectedApplication.status === "denied" ? "Denied" : "Pending"}
                  </Badge>
                </div>
                {selectedApplication.reviewNotes && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      <strong>Provider Note:</strong> {selectedApplication.reviewNotes}
                    </p>
                  </div>
                )}
                {selectedApplication.reviewedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reviewed: {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Application Data Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2 border-b border-border pb-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Full Name</span>
                    <span className="text-white">{selectedApplication.applicationData.firstName} {selectedApplication.applicationData.lastName}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Date of Birth</span>
                    <span className="text-white">{selectedApplication.applicationData.dateOfBirth}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Gender</span>
                    <span className="text-white capitalize">{selectedApplication.applicationData.gender}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Phone</span>
                    <span className="text-white">{selectedApplication.applicationData.phone}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 col-span-2">
                    <span className="text-muted-foreground block text-xs">Email</span>
                    <span className="text-white">{selectedApplication.applicationData.email}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 col-span-2">
                    <span className="text-muted-foreground block text-xs">Current Address</span>
                    <span className="text-white">{selectedApplication.applicationData.currentAddress}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2 border-b border-border pb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Name</span>
                    <span className="text-white">{selectedApplication.applicationData.emergencyContactName}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Phone</span>
                    <span className="text-white">{selectedApplication.applicationData.emergencyContactPhone}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Relationship</span>
                    <span className="text-white">{selectedApplication.applicationData.emergencyContactRelationship}</span>
                  </div>
                </div>
              </div>

              {/* Recovery Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2 border-b border-border pb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Recovery Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Primary Substance(s)</span>
                    <span className="text-white">{selectedApplication.applicationData.primarySubstances}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Length of Sobriety</span>
                    <span className="text-white">{selectedApplication.applicationData.lengthOfSobriety}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Last Date of Use</span>
                    <span className="text-white">{selectedApplication.applicationData.lastDateOfUse}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground block text-xs">Has Sponsor</span>
                    <span className="text-white capitalize">{selectedApplication.applicationData.hasSponsor}</span>
                  </div>
                  {selectedApplication.applicationData.currentMatMedications && (
                    <div className="p-3 rounded-lg bg-white/5 col-span-2">
                      <span className="text-muted-foreground block text-xs">MAT Medications</span>
                      <span className="text-white">{selectedApplication.applicationData.currentMatMedications}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Info */}
              {(selectedApplication.applicationData.medicalConditions || selectedApplication.applicationData.mentalHealthDiagnoses) && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2 border-b border-border pb-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Medical Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {selectedApplication.applicationData.medicalConditions && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <span className="text-muted-foreground block text-xs">Medical Conditions</span>
                        <span className="text-white">{selectedApplication.applicationData.medicalConditions}</span>
                      </div>
                    )}
                    {selectedApplication.applicationData.mentalHealthDiagnoses && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <span className="text-muted-foreground block text-xs">Mental Health</span>
                        <span className="text-white">{selectedApplication.applicationData.mentalHealthDiagnoses}</span>
                      </div>
                    )}
                    {selectedApplication.applicationData.currentMedications && (
                      <div className="p-3 rounded-lg bg-white/5">
                        <span className="text-muted-foreground block text-xs">Current Medications</span>
                        <span className="text-white">{selectedApplication.applicationData.currentMedications}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation(`/property/${selectedApplication.propertyId}`)} 
                  className="flex-1"
                  data-testid="button-view-listing"
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Listing
                </Button>
                <Button 
                  onClick={() => {
                    setShowApplicationModal(false);
                    toast({
                      title: "Message Sent",
                      description: "Your message to the provider has been sent.",
                    });
                  }} 
                  className="flex-1 bg-primary text-primary-foreground"
                  data-testid="button-message-provider"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Provider
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
