import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, MessageSquare, AlertCircle, 
  Plus, Check, X, MoreHorizontal, Search, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PROPERTIES, SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
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

export function ProviderDashboard() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);

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
            const unreadFromTenant = messages.filter(m => m.sender === "tenant" && m.text).length;
            allConversations.push({
              propertyId: property.id,
              propertyName: property.name,
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
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Provider Portal</h1>
            <p className="text-muted-foreground">Manage your properties and connect with tenants.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Plus className="w-4 h-4" /> List New Property
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="messages">Messages ({conversations.length})</TabsTrigger>
            <TabsTrigger value="inbox">Applications & Inbox</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <h3 className="text-3xl font-bold text-white">24</h3>
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
                      <h3 className="text-3xl font-bold text-white">5</h3>
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
                    {[
                      { name: "John Doe", property: "Serenity House", date: "2 hrs ago", status: "New" },
                      { name: "Michael Smith", property: "Pathway Home", date: "5 hrs ago", status: "Screening" },
                      { name: "Sarah Jones", property: "Serenity House", date: "Yesterday", status: "Approved" },
                    ].map((app, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">{app.name}</td>
                        <td className="p-4 text-gray-300">{app.property}</td>
                        <td className="p-4 text-muted-foreground">{app.date}</td>
                        <td className="p-4">
                          <Badge variant={app.status === "New" ? "default" : app.status === "Approved" ? "secondary" : "outline"}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">View</Button>
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
                        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                        <Button size="sm" className="flex-1 bg-primary text-primary-foreground">Manage</Button>
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
                    <div className="grid grid-cols-1 gap-2">
                       {Object.keys(SUPERVISION_DEFINITIONS).map(type => (
                         <div key={type} className="flex items-center space-x-2">
                           <RadioGroupItem value={type} id={`new-${type}`} className="h-3 w-3" />
                           <Label htmlFor={`new-${type}`} className="text-xs font-normal text-muted-foreground">{type}</Label>
                         </div>
                       ))}
                    </div>
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
              <CardHeader>
                <CardTitle className="text-white">Applications & Inbox</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                   {/* Mock detailed list would go here */}
                   <div className="text-center py-12 text-muted-foreground">
                     <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>Check your messages tab for tenant conversations.</p>
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
