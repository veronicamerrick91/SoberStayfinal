import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Lock, CheckCircle, Smartphone } from "lucide-react";
import { Apple, } from "lucide-react";
import { createSubscription } from "@/lib/subscriptions"; // Remove this line if we are replacing it
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string; // We might not need this if we use req.user on backend, but good to keep for interface
  listingCount?: number;
}

export function PaymentModal({ open, onClose, onSuccess, providerId, listingCount = 1 }: PaymentModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"pricing" | "payment" | "success">("pricing");
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "paypal" | "applepay">("debit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingName, setBillingName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyFee = 49 * listingCount;

  const handlePayment = async () => {
    if (paymentMethod === "debit" && (!cardNumber || !expiryDate || !cvc || !billingName)) {
      alert("Please fill in all debit card details");
      return;
    }
    if (paymentMethod === "paypal" && (!paypalEmail || !billingName)) {
      alert("Please fill in all PayPal details");
      return;
    }
    if (paymentMethod === "applepay" && !billingName) {
      alert("Please fill in your name");
      return;
    }

    setIsProcessing(true);

    try {
      await apiRequest("POST", "/api/subscriptions", {
        paymentMethod,
        // In a real app, we would send tokenized payment data here
        providerId // Backend will use session user, but we can pass it if needed
      });
      
      setIsProcessing(false);
      setStep("success");

      // Auto-close after success
      setTimeout(() => {
        setStep("pricing");
        onClose();
        onSuccess();
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
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
                      <li>✓ Property listing</li>
                      <li>✓ Access to thousands of clients seeking sober living</li>
                      <li>✓ Direct tenant messaging</li>
                      <li>✓ Application management tools</li>
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
              <Label className="text-white text-sm font-semibold">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                <div className="flex items-center space-x-2 p-2 rounded border border-border hover:border-primary/50">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2 flex-1">
                    <CreditCard className="w-4 h-4" /> Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded border border-border hover:border-primary/50">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2 flex-1">
                    <Smartphone className="w-4 h-4" /> PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded border border-border hover:border-primary/50">
                  <RadioGroupItem value="applepay" id="applepay" />
                  <Label htmlFor="applepay" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2 flex-1">
                    <Apple className="w-4 h-4" /> Apple Pay
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm mb-2">Name</Label>
                <Input 
                  placeholder="John Doe"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>

              {paymentMethod === "debit" && (
                <>
                  <div>
                    <Label className="text-white text-sm mb-2">Debit Card Number</Label>
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
                      <Label className="text-white text-sm mb-2">CVV</Label>
                      <Input 
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.slice(0, 4))}
                        maxLength={4}
                        className="bg-background/50 border-white/10 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div>
                  <Label className="text-white text-sm mb-2">PayPal Email</Label>
                  <Input 
                    placeholder="you@example.com"
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
              )}

              {paymentMethod === "applepay" && (
                <div className="p-4 bg-white/5 rounded-lg border border-primary/20 text-center">
                  <p className="text-sm text-gray-300">
                    Click "Confirm Payment" to complete your transaction via Apple Pay on your device.
                  </p>
                </div>
              )}
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
