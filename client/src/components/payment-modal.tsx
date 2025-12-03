import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
  listingCount?: number;
}

const STRIPE_PRICE_ID = "price_1Sa7CIPBUlX7cw67f5eJMTf6"; // From seed script

export function PaymentModal({ open, onClose, onSuccess, providerId, listingCount = 1 }: PaymentModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const monthlyFee = 49 * listingCount;

  const handleStripeCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/stripe/create-checkout-session", {
        priceId: STRIPE_PRICE_ID,
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Checkout Failed",
        description: error.message || "Unable to start checkout. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white">List Your Property</DialogTitle>
          <DialogDescription>Secure payment with Stripe</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-white/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">Monthly Listing Fee</p>
                    <p className="text-xs text-muted-foreground">Per property</p>
                  </div>
                  <Badge className="bg-primary text-white">$49/month</Badge>
                </div>
                
                {listingCount > 1 && (
                  <div className="flex justify-between items-start pt-3 border-t border-border">
                    <div>
                      <p className="text-white font-semibold">{listingCount} Listings</p>
                      <p className="text-xs text-muted-foreground">Total monthly</p>
                    </div>
                    <span className="text-white font-bold text-lg">${monthlyFee}</span>
                  </div>
                )}
                
                <div className="pt-4 space-y-2 bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm font-medium text-primary">What's Included:</p>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      Unlimited property photos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      Featured placement in search results
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      Application management system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      Direct tenant messaging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      Cancel anytime
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleStripeCheckout}
              disabled={isProcessing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Checkout...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Continue to Stripe Checkout
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Secured by Stripe</span>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You'll be redirected to Stripe's secure checkout page to complete your subscription.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
