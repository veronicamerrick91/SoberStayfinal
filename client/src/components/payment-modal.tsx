import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
  listingCount?: number;
}

export function PaymentModal({ open, onClose, onSuccess, providerId, listingCount = 1 }: PaymentModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/stripe/checkout", {});
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border" data-testid="payment-modal">
        <DialogHeader>
          <DialogTitle className="text-white">Subscribe to List Properties</DialogTitle>
          <DialogDescription>$49/month per listing — all features included</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-primary bg-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">Per Listing</span>
              <Badge className="bg-primary text-white text-lg px-3 py-1">
                $49/mo
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Flat rate per listing. All features included. Cancel anytime.
            </p>
          </div>

          <Card className="bg-white/5 border-primary/30">
            <CardContent className="pt-4 pb-3">
              <p className="text-sm font-medium text-primary mb-2">What's Included:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ Full listing with photos</li>
                <li>✓ Priority visibility in search</li>
                <li>✓ Access to thousands of clients seeking sober living</li>
                <li>✓ Direct tenant messaging</li>
                <li>✓ Application management tools</li>
                <li>✓ Analytics dashboard</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            Secure payment powered by Stripe
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 gap-2"
              data-testid="button-checkout"
            >
              {isProcessing ? (
                "Redirecting to checkout..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Continue to Secure Checkout
                  <ExternalLink className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-border"
              disabled={isProcessing}
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
