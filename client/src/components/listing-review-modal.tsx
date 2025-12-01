import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, Users, Home, DollarSign, Check, X } from "lucide-react";

interface ListingReviewModalProps {
  open: boolean;
  onClose: () => void;
  listing: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    price: number;
    pricePeriod: string;
    gender: string;
    bedsAvailable: number;
    totalBeds: number;
    image: string;
    description: string;
    isVerified: boolean;
    status?: "Pending" | "Approved" | "Rejected";
  };
  onApprove: (id: string) => void;
  onDeny: (id: string, reason: string) => void;
}

export function ListingReviewModal({ open, onClose, listing, onApprove, onDeny }: ListingReviewModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [showDenyForm, setShowDenyForm] = useState(false);

  const handleDeny = () => {
    if (!denyReason.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    onDeny(listing.id, denyReason);
    setDenyReason("");
    setShowDenyForm(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Review Listing: {listing.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover rounded-lg" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {listing.address}, {listing.city}, {listing.state}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-white font-medium">${listing.price}/{listing.pricePeriod}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Details</p>
                <div className="flex gap-2 text-sm">
                  <Badge variant="secondary" className="gap-1"><Users className="w-3 h-3" /> {listing.gender}</Badge>
                  <Badge variant="outline" className="gap-1 border-primary/30 text-primary"><Home className="w-3 h-3" /> {listing.bedsAvailable}/{listing.totalBeds} Beds</Badge>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Description</p>
            <p className="text-sm text-gray-300">{listing.description}</p>
          </div>

          {!showDenyForm ? (
            <div className="flex gap-3">
              <Button onClick={() => onApprove(listing.id)} className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500/30 h-10 gap-2">
                <Check className="w-4 h-4" /> Approve Listing
              </Button>
              <Button onClick={() => setShowDenyForm(true)} variant="outline" className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 h-10 gap-2">
                <X className="w-4 h-4" /> Deny Listing
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 border-border h-10">Close</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-white text-sm">Reason for Denial</Label>
              <Textarea
                placeholder="Explain why this listing is being denied..."
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                className="bg-background/50 border-white/10 min-h-20"
              />
              <div className="flex gap-2">
                <Button onClick={handleDeny} className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30">Send Denial</Button>
                <Button onClick={() => setShowDenyForm(false)} variant="outline" className="flex-1 border-border">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
