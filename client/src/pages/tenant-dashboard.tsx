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
  Home, FileText, MessageSquare, Heart, Bell, 
  Clock, CheckCircle, XCircle, ChevronRight, MapPin, Send, 
  Zap, Settings, LogOut, User, Phone, Mail, Calendar, Shield
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getFavorites } from "@/lib/favorites";
import { clearAuth, getAuth, saveAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

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

export function TenantDashboard() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedHomes, setSavedHomes] = useState<typeof MOCK_PROPERTIES>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { toast } = useToast();
  const user = getAuth();
  
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
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    setShowProfileModal(false);
  };

  const calculateProfileCompletion = () => {
    const fields = [profile.name, profile.email, profile.phone, profile.sobrietyDate, profile.emergencyContactName, profile.emergencyContactPhone, profile.bio];
    const filled = fields.filter(f => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    // Load all conversations from localStorage
    const allConversations: Conversation[] = [];
    
    MOCK_PROPERTIES.forEach(property => {
      const key = `chat_${property.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const messages = JSON.parse(stored) as ChatMessage[];
          if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            allConversations.push({
              propertyId: property.id,
              propertyName: property.name,
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

    // Load saved homes (favorites)
    const favorites = getFavorites();
    const favorited = MOCK_PROPERTIES.filter(p => favorites.includes(p.id));
    setSavedHomes(favorited);
  }, []);

  const handleSignOut = () => {
    clearAuth();
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
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
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
                <p className="text-xs text-primary font-bold">{conversations.filter(c => c.unreadCount > 0).length} with new messages</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
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

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applications</p>
                    <h3 className="text-3xl font-bold text-white">3</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-primary font-bold">1 pending review</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setShowProfileModal(true)} data-testid="profile-status-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Status</p>
                    <h3 className="text-3xl font-bold text-white">{calculateProfileCompletion()}%</h3>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <Progress value={calculateProfileCompletion()} className="h-1.5" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex flex-wrap gap-2 h-auto justify-start rounded-lg shadow-sm">
              <TabsTrigger value="messages" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <MessageSquare className="w-4 h-4" />
                Messages {conversations.length > 0 && <Badge className="bg-primary text-white ml-1">{conversations.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">
                <Heart className="w-4 h-4" />
                Saved Homes {savedHomes.length > 0 && <Badge className="bg-primary text-white ml-1">{savedHomes.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2">
                <FileText className="w-4 h-4" />
                Applications
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
                        <img src={home.image} alt={home.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <Badge className="absolute top-3 left-3 bg-primary text-white">Saved</Badge>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <p className="text-white font-bold text-lg">${home.price}/{home.pricePeriod}</p>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors">{home.name}</h3>
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
                  <div className="space-y-4">
                    {[
                      { id: 1, name: "Serenity House", status: "Under Review", date: "Submitted today", progress: 60, icon: "📋", propertyId: "property1" },
                      { id: 2, name: "New Beginnings", status: "Action Required", date: "Submitted yesterday", progress: 40, icon: "⚠️", propertyId: "property2" },
                      { id: 3, name: "The Harbor", status: "Submitted", date: "Submitted Nov 28", progress: 20, icon: "✓", propertyId: "property3" },
                    ].map((app) => (
                      <div 
                        key={app.id} 
                        className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer hover:bg-white/10"
                        onClick={() => setLocation(`/property/${app.propertyId}`)}
                        data-testid={`application-card-${app.id}`}
                      >
                        <div className="text-3xl">{app.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white">{app.name}</h4>
                              <p className="text-xs text-muted-foreground">{app.date}</p>
                            </div>
                            <Badge variant={app.status === "Under Review" ? "default" : app.status === "Submitted" ? "secondary" : "destructive"}>
                              {app.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={app.progress} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground font-medium">{app.progress}%</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                    ))}
                  </div>
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
              <Button onClick={() => setLocation("/chat/property1")} variant="outline" className="h-12 gap-2 border-primary/50">
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
    </Layout>
  );
}
