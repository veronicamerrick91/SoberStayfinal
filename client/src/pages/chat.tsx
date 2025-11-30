import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Send, Phone, Mail, Video, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

interface Message {
  id: string;
  sender: "tenant" | "provider";
  senderName: string;
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [match, params] = useRoute("/chat/:propertyId");
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [textFormat, setTextFormat] = useState<"normal" | "bold" | "italic">("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const property = MOCK_PROPERTIES.find(p => p.id === params?.propertyId);

  // Load messages from localStorage
  useEffect(() => {
    if (!property?.id) return;
    const key = `chat_${property.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Initialize with welcome message from provider
      const welcome: Message = {
        id: "welcome",
        sender: "provider",
        senderName: "Listing Manager",
        text: `Hi! Thanks for your interest in ${property?.name}. We'd be happy to answer any questions about our home. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [property?.id]);

  // Save messages to localStorage and scroll to bottom
  useEffect(() => {
    if (!property?.id) return;
    const key = `chat_${property.id}`;
    localStorage.setItem(key, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, property?.id]);

  const formatText = (text: string) => {
    switch (textFormat) {
      case "bold":
        return `**${text}**`;
      case "italic":
        return `_${text}_`;
      default:
        return text;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "tenant",
      senderName: "You",
      text: formatText(input),
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setTextFormat("normal");

    // Simulate provider response after 2 seconds
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me provide more details...",
        "I'm glad you asked. We can definitely help with that.",
        "Thanks for reaching out. We have availability for move-in dates you're interested in.",
        "Perfect! We'd love to have you tour our facility. Would you like to schedule a time?",
        "Your background sounds like a great fit for our community!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const providerMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "provider",
        senderName: "Listing Manager",
        text: randomResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, providerMessage]);
    }, 2000);
  };

  const formatTextDisplay = (text: string) => {
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/_(.*?)_/g, "<em>$1</em>");
    return formatted;
  };

  if (!property) return <Layout><div className="text-center py-12">Conversation not found</div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="gap-2 pl-0 text-muted-foreground hover:text-primary"
                onClick={() => setLocation(`/property/${property.id}`)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="font-bold text-white">{property.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6 space-y-4 max-w-2xl">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "tenant" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  msg.sender === "tenant"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                }`}
              >
                <p
                  className="text-sm break-words"
                  dangerouslySetInnerHTML={{ __html: formatTextDisplay(msg.text) }}
                />
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "tenant" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border sticky bottom-0">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            {/* Formatting Toolbar */}
            <div className="flex gap-2 mb-3">
              <Button
                size="sm"
                variant={textFormat === "normal" ? "default" : "outline"}
                onClick={() => setTextFormat("normal")}
                className="text-xs h-8"
              >
                Normal
              </Button>
              <Button
                size="sm"
                variant={textFormat === "bold" ? "default" : "outline"}
                onClick={() => setTextFormat("bold")}
                className="text-xs h-8 font-bold"
              >
                Bold
              </Button>
              <Button
                size="sm"
                variant={textFormat === "italic" ? "default" : "outline"}
                onClick={() => setTextFormat("italic")}
                className="text-xs h-8 italic"
              >
                Italic
              </Button>
            </div>

            {/* Input Field */}
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="bg-background/50 border-border flex-1"
              />
              <Button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Format options: **bold text** or _italic text_
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
