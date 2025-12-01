import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { createSubscription } from "@/lib/subscriptions";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
  listingCount?: number;
}

export function PaymentModal({ open, onClose, onSuccess, providerId, listingCount = 1 }: PaymentModalProps) {
  const [step, setStep] = useState<"pricing" | "payment" | "success">("pricing");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingName, setBillingName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyFee = 49 * listingCount;

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvc || !billingName) {
      alert("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create subscription in localStorage
    createSubscription(providerId);
    
    setIsProcessing(false);
    setStep("success");

    // Auto-close after success
    setTimeout(() => {
      setStep("pricing");
      onClose();
      onSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white">List Your Property</DialogTitle>
          <DialogDescription>Secure payment with Stripe</DialogDescription>
        </DialogHeader>

        {step === "pricing" && (
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
                      <li>✓ Featured listing placement</li>
                      <li>✓ Verified badge on property</li>
                      <li>✓ Direct tenant messaging</li>
                      <li>✓ Priority support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={() => setStep("payment")} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Continue to Payment
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="w-full border-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border border-primary/20 text-sm">
              <p className="text-muted-foreground mb-1">Amount to charge today:</p>
              <p className="text-2xl font-bold text-primary">${monthlyFee}</p>
              <p className="text-xs text-muted-foreground mt-1">Then ${monthlyFee}/month</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm mb-2">Cardholder Name</Label>
                <Input 
                  placeholder="John Doe"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div>
                <Label className="text-white text-sm mb-2">Card Number</Label>
                <Input 
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="bg-background/50 border-white/10 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white text-sm mb-2">MM/YY</Label>
                  <Input 
                    placeholder="12/26"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="bg-background/50 border-white/10 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm mb-2">CVC</Label>
                  <Input 
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.slice(0, 4))}
                    maxLength={4}
                    className="bg-background/50 border-white/10 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Secure payment powered by Stripe
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </Button>
              <Button 
                onClick={() => setStep("pricing")}
                variant="outline"
                className="w-full border-border"
                disabled={isProcessing}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-4 py-6">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription is now active. Start listing your properties!
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              Redirecting...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
