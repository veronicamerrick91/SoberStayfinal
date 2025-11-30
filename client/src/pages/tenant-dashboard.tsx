import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, FileText, MessageSquare, Heart, Bell, 
  Clock, CheckCircle, XCircle, ChevronRight, MapPin, Send
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getFavorites } from "@/lib/favorites";

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
            <TabsTrigger value="messages">Messages ({conversations.length})</TabsTrigger>
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
                  <div className="text-2xl font-bold text-white">{savedHomes.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">In your favorites</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{conversations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">With providers</p>
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
                  <CardTitle className="text-white">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversations.length > 0 ? (
                    <div className="space-y-3">
                      {conversations.slice(0, 3).map((conv) => (
                        <div key={conv.propertyId} className="flex gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-white text-sm truncate">{conv.propertyName}</h4>
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
                    <p className="text-muted-foreground text-sm text-center py-4">No active conversations yet. Start chatting with providers!</p>
                  )}
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

          {/* SAVED HOMES TAB */}
          <TabsContent value="saved">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Your Saved Homes</CardTitle>
              </CardHeader>
              <CardContent>
                {savedHomes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedHomes.map((home) => (
                      <div key={home.id} className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group" onClick={() => setLocation(`/property/${home.id}`)}>
                        <div className="relative h-40 overflow-hidden">
                          <img src={home.image} alt={home.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <Badge className="absolute top-3 left-3 bg-primary text-white">Saved</Badge>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-white group-hover:text-primary transition-colors">{home.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {home.city}, {home.state}
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold text-primary">${home.price}/{home.pricePeriod}</span>
                            <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); setLocation(`/chat/${home.id}`); }}>
                              <Send className="w-3 h-3 mr-1" /> Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven't saved any homes yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setLocation("/browse")}>Browse Homes</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Your Conversations</CardTitle>
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
                              <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
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
                    <p>No active conversations yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setLocation("/browse")}>Browse and Chat with Providers</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
