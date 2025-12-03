import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Send, Plus } from "lucide-react";
import { useState } from "react";

export function ProviderSupport() {
  const [tickets, setTickets] = useState<any[]>([
    { id: "#1001", subject: "Listing approval status", status: "Resolved", created: "Dec 1, 2024", response: "Your listing was approved on Dec 1st. It's now live on the platform!" },
  ]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const handleCreateTicket = () => {
    if (newTicketSubject.trim() && newTicketMessage.trim()) {
      const newTicket = {
        id: `#${1000 + tickets.length + 1}`,
        subject: newTicketSubject,
        status: "Open",
        created: new Date().toLocaleDateString(),
        message: newTicketMessage,
        response: null
      };
      setTickets([...tickets, newTicket]);
      setNewTicketSubject("");
      setNewTicketMessage("");
      setShowNewTicket(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Support Portal</h1>
            <p className="text-muted-foreground">Open tickets and get help from our support team</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Open Ticket
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-primary mb-2">Open Tickets</p>
              <p className="text-3xl font-bold text-white">{tickets.filter(t => t.status === "Open").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-primary mb-2">In Progress</p>
              <p className="text-3xl font-bold text-white">{tickets.filter(t => t.status === "In Progress").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-xs font-bold text-primary mb-2">Resolved</p>
              <p className="text-3xl font-bold text-white">{tickets.filter(t => t.status === "Resolved").length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    ticket.status === "Open" ? "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40" :
                    ticket.status === "In Progress" ? "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" :
                    "bg-green-500/10 border-green-500/20 hover:border-green-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{ticket.id} • {ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ticket.created}</p>
                    </div>
                    <Badge className={
                      ticket.status === "Open" ? "bg-blue-500/80" :
                      ticket.status === "In Progress" ? "bg-amber-500/80" :
                      "bg-green-500/80"
                    }>{ticket.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">{selectedTicket.id} • {selectedTicket.subject}</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  <Badge className={
                    selectedTicket.status === "Open" ? "bg-blue-500/80" :
                    selectedTicket.status === "In Progress" ? "bg-amber-500/80" :
                    "bg-green-500/80"
                  }>{selectedTicket.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Your Message</p>
                  <p className="text-sm text-white">{selectedTicket.message}</p>
                </div>
                {selectedTicket.response && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Admin Response</p>
                    <div className="bg-primary/10 border border-primary/20 p-3 rounded">
                      <p className="text-sm text-white">{selectedTicket.response}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedTicket(null)} className="flex-1 bg-primary hover:bg-primary/90">Close</Button>
              </div>
            </div>
          </div>
        )}

        {showNewTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Open Support Ticket</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Subject</label>
                  <Input
                    placeholder="Brief description of issue"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Message</label>
                  <textarea
                    placeholder="Describe your issue in detail"
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTicket} className="flex-1 bg-primary hover:bg-primary/90 gap-2">
                  <Send className="w-4 h-4" /> Send Ticket
                </Button>
                <Button onClick={() => setShowNewTicket(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
