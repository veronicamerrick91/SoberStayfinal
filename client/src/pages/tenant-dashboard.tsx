import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, FileText, MessageSquare, Heart, Bell, 
  Clock, CheckCircle, XCircle, ChevronRight, MapPin, Send, 
  Zap, Settings, LogOut
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getFavorites } from "@/lib/favorites";
import { clearAuth, getAuth } from "@/lib/auth";

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

export function TenantDashboard() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedHomes, setSavedHomes] = useState<typeof MOCK_PROPERTIES>([]);
  const user = getAuth();

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
                <Button variant="outline" className="gap-2 border-primary/50">
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

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Status</p>
                    <h3 className="text-3xl font-bold text-white">85%</h3>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <Progress value={85} className="h-1.5" />
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
              <Button variant="outline" className="h-12 gap-2 border-primary/50">
                <Settings className="w-5 h-5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
