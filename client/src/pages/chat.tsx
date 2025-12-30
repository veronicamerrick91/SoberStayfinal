import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Send, MessageCircle, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "@/lib/auth";
import type { Listing } from "@shared/schema";

interface Message {
  id: string;
  sender: "tenant" | "provider";
  senderId?: string;
  senderName: string;
  text: string;
  timestamp: Date;
  avatarUrl?: string;
}

async function fetchListing(id: string): Promise<Listing> {
  const response = await fetch(`/api/listings/${id}`);
  if (!response.ok) throw new Error("Listing not found");
  return response.json();
}

async function fetchTenantProfile() {
  try {
    const response = await fetch(`/api/tenant/profile`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch tenant profile:", error);
  }
  return null;
}

async function fetchProviderProfileByListing(listingId: string) {
  try {
    const response = await fetch(`/api/listings/${listingId}/provider-profile`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch provider profile:", error);
  }
  return null;
}

export default function Chat() {
  const [match, params] = useRoute("/chat/:propertyId");
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [tenantAvatar, setTenantAvatar] = useState<string | null>(null);
  const [providerAvatar, setProviderAvatar] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string>("Listing Manager");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const user = getAuth();
  
  const { data: property, isLoading } = useQuery({
    queryKey: ["listing", params?.propertyId],
    queryFn: () => fetchListing(params?.propertyId || ""),
    enabled: !!params?.propertyId,
  });

  // Load tenant profile photo
  useEffect(() => {
    if (user?.role === "tenant" && user?.id) {
      fetchTenantProfile().then((profile) => {
        if (profile?.profilePhotoUrl) {
          setTenantAvatar(profile.profilePhotoUrl);
        }
      });
    }
  }, [user?.id, user?.role]);

  // Load provider profile (for logo)
  useEffect(() => {
    if (params?.propertyId) {
      fetchProviderProfileByListing(params.propertyId).then((profile) => {
        if (profile?.logoUrl) {
          setProviderAvatar(profile.logoUrl);
        }
        if (profile?.companyName) {
          setProviderName(profile.companyName);
        }
      });
    }
  }, [params?.propertyId]);

  // Load messages from localStorage
  useEffect(() => {
    if (!property?.id) return;
    const key = `chat_${property.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Initialize with welcome message from provider (with company logo)
      const welcome: Message = {
        id: "welcome",
        sender: "provider",
        senderName: providerName,
        text: `Hi! Thanks for your interest in ${property?.propertyName}. We'd be happy to answer any questions about our home. What would you like to know?`,
        timestamp: new Date(),
        avatarUrl: providerAvatar || undefined,
      };
      setMessages([welcome]);
    }
  }, [property?.id, property?.propertyName, providerAvatar, providerName]);

  // Save messages to localStorage and scroll to bottom only for new messages
  useEffect(() => {
    if (!property?.id || messages.length === 0) return;
    const key = `chat_${property.id}`;
    localStorage.setItem(key, JSON.stringify(messages));
    
    // Only scroll to bottom after sending a new message, not on initial load
    if (!isInitialLoad) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // After initial load, scroll to top of messages container
      messagesContainerRef.current?.scrollTo({ top: 0 });
      setIsInitialLoad(false);
    }
  }, [messages, property?.id, isInitialLoad]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Determine sender role based on current user
    const senderRole = user?.role === "provider" ? "provider" : "tenant";
    const senderName = user?.role === "provider" ? providerName : (user?.name || "You");
    const senderAvatar = user?.role === "provider" ? providerAvatar : tenantAvatar;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: senderRole,
      senderId: user?.id,
      senderName: senderName,
      text: input.trim(),
      timestamp: new Date(),
      avatarUrl: senderAvatar || undefined,
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  // Helper to determine if a message was sent by the current user
  const isCurrentUserMessage = (msg: Message) => {
    // If senderId is set, compare with current user
    if (msg.senderId && user?.id) {
      return msg.senderId === user.id;
    }
    // Fallback: compare roles (for legacy messages)
    return msg.sender === user?.role;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const groupedMessages = messages.reduce((groups: any[], msg) => {
    const dateKey = msg.timestamp.toDateString();
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date: dateKey, messages: [msg] });
    }
    return groups;
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!property) return <Layout><div className="text-center py-12">Conversation not found</div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-card to-card/80 border-b border-primary/20 sticky top-16 z-40 shadow-lg">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="gap-2 pl-0 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setLocation(`/property/${property.id}`)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-white">{property.propertyName}</h2>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {property.city}, {property.state}
                  </div>
                  <div className="text-sm text-primary font-semibold">
                    ${property.monthlyPrice}/<span className="text-xs">month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto py-8 px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            {groupedMessages.map((group: any, groupIdx: number) => (
              <div key={groupIdx} className="space-y-4">
                {/* Date Separator */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-border/50"></div>
                  <span className="text-xs font-semibold text-muted-foreground px-3 py-1 bg-card/50 rounded-full">
                    {formatDate(new Date(group.date))}
                  </span>
                  <div className="flex-1 h-px bg-border/50"></div>
                </div>

                {/* Messages */}
                {group.messages.map((msg: Message) => {
                  // Tenant messages on the right, provider messages on the left
                  const isTenantMessage = msg.sender === "tenant";
                  return (
                  <div key={msg.id} className={`flex ${isTenantMessage ? "justify-end" : "justify-start"} gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                    {/* Provider Avatar (Left) */}
                    {!isTenantMessage && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        {msg.avatarUrl ? (
                          <img
                            src={msg.avatarUrl}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-full object-cover border border-primary/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <MessageCircle className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground max-w-[60px] truncate">
                          {msg.senderName}
                        </span>
                      </div>
                    )}

                    <div className={`flex flex-col ${isTenantMessage ? "items-end" : "items-start"} gap-1 max-w-sm`}>
                      <div
                        className={`px-5 py-3 rounded-2xl transition-all ${
                          isTenantMessage
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-none shadow-lg shadow-primary/20"
                            : "bg-card border border-border/50 text-foreground rounded-bl-none hover:border-primary/30 shadow-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.text}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-1 ${isTenantMessage ? "text-muted-foreground mr-2" : "text-muted-foreground ml-2"}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {/* Tenant Avatar (Right) */}
                    {isTenantMessage && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        {msg.avatarUrl ? (
                          <img
                            src={msg.avatarUrl}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-full object-cover border border-primary/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <MessageCircle className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground max-w-[60px] truncate">
                          {msg.senderName}
                        </span>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Premium Input Footer */}
        <div className="bg-background border-t border-primary/10 sticky bottom-0">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <form onSubmit={handleSend} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the property, rules, or schedule a tour..."
                  className="bg-card/60 border-primary/10 focus:border-primary/30 text-white placeholder:text-muted-foreground/60 pr-4 py-3 rounded-2xl transition-all focus:bg-card/80"
                  data-testid="input-message"
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground/60 mt-3 text-center">
              Direct communication with property managers • Usually responds within 2 hours
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
