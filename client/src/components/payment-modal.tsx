import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyFee = 49;
  const annualFee = 399;
  const savings = (monthlyFee * 12) - annualFee;

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/stripe/checkout", {
        billingPeriod
      });
      
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
          <DialogDescription>Choose your billing plan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup 
            value={billingPeriod} 
            onValueChange={(val: "monthly" | "annual") => setBillingPeriod(val)}
            className="space-y-3"
          >
            <div 
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                billingPeriod === "monthly" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Label htmlFor="monthly" className="text-white font-semibold cursor-pointer">
                    Monthly Plan
                  </Label>
                  <Badge variant="outline" className="border-primary text-primary">
                    ${monthlyFee}/mo
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  $49/month per listing slot
                </p>
              </div>
            </div>

            <div 
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                billingPeriod === "annual" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setBillingPeriod("annual")}
            >
              <RadioGroupItem value="annual" id="annual" className="mt-1" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Label htmlFor="annual" className="text-white font-semibold cursor-pointer">
                    Annual Plan
                  </Label>
                  <div className="flex flex-col items-end">
                    <Badge className="bg-primary text-white">
                      ${annualFee}/yr
                    </Badge>
                    <span className="text-xs text-primary mt-1">Save ${savings}/year</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Best value - $399/year for unlimited listings
                </p>
              </div>
            </div>
          </RadioGroup>

          <Card className="bg-white/5 border-primary/30">
            <CardContent className="pt-4 pb-3">
              <p className="text-sm font-medium text-primary mb-2">What's Included:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ 1 property listing slot per $49 payment</li>
                <li>✓ Access to thousands of clients seeking sober living</li>
                <li>✓ Direct tenant messaging</li>
                <li>✓ Application management tools</li>
                <li>✓ Analytics dashboard</li>
                <li>✓ SEO tools for better visibility</li>
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
