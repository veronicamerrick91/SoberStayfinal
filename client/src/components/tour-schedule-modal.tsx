import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, Video, MapPin, CheckCircle } from "lucide-react";
import { trackTourRequest } from "@/lib/analytics";

interface TourScheduleModalProps {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  propertyId: string;
  tenantName: string;
  tenantEmail: string;
}

export interface TourRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantName: string;
  tenantEmail: string;
  tourType: "virtual" | "in-person";
  date: string;
  time: string;
  status: "pending" | "approved" | "denied" | "rescheduled";
  createdAt: Date;
  providerNotes?: string;
}

export function TourScheduleModal({ open, onClose, propertyName, propertyId, tenantName, tenantEmail }: TourScheduleModalProps) {
  const [step, setStep] = useState<"type" | "datetime" | "confirm" | "success">("type");
  const [tourType, setTourType] = useState<"virtual" | "in-person">("virtual");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) {
      alert("Please select a date and time");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save tour request to localStorage
    const tourRequest: TourRequest = {
      id: `tour_${Date.now()}`,
      propertyId,
      propertyName,
      tenantName,
      tenantEmail,
      tourType,
      date,
      time,
      status: "pending",
      createdAt: new Date(),
    };

    const existingRequests = JSON.parse(localStorage.getItem("tour_requests") || "[]") as TourRequest[];
    localStorage.setItem("tour_requests", JSON.stringify([...existingRequests, tourRequest]));
    
    // Track tour request on successful confirmation
    trackTourRequest(parseInt(propertyId));

    setIsSubmitting(false);
    setStep("success");

    // Auto-close after success
    setTimeout(() => {
      setStep("type");
      onClose();
    }, 2500);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Schedule a Tour
          </DialogTitle>
          <DialogDescription>
            {propertyName}
          </DialogDescription>
        </DialogHeader>

        {step === "type" && (
          <div className="space-y-6">
            <div>
              <Label className="text-white font-semibold mb-4 block">Select Tour Type</Label>
              <RadioGroup value={tourType} onValueChange={(val) => setTourType(val as "virtual" | "in-person")}>
                <div className="space-y-3">
                  <div 
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      tourType === "virtual" 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setTourType("virtual")}
                  >
                    <RadioGroupItem value="virtual" id="virtual" />
                    <div className="flex-1">
                      <Video className="w-4 h-4 text-primary inline mr-2" />
                      <label htmlFor="virtual" className="text-white font-medium cursor-pointer">Virtual Tour</label>
                      <p className="text-xs text-muted-foreground mt-1">Video call tour via Zoom/Teams</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      tourType === "in-person" 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setTourType("in-person")}
                  >
                    <RadioGroupItem value="in-person" id="in-person" />
                    <div className="flex-1">
                      <MapPin className="w-4 h-4 text-primary inline mr-2" />
                      <label htmlFor="in-person" className="text-white font-medium cursor-pointer">In-Person Tour</label>
                      <p className="text-xs text-muted-foreground mt-1">Visit the property in person</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                variant="outline" 
                className="w-full border-border"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setStep("datetime")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-continue-tour"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Preferred Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  type="date"
                  min={getMinDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background/50 border-border pl-10"
                  data-testid="input-tour-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-background/50 border-border pl-10"
                  data-testid="input-tour-time"
                />
              </div>
            </div>

            <Card className="bg-white/5 border-border p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> The provider will review your request and confirm availability. You'll receive a notification of their response.
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => setStep("type")}
                variant="outline" 
                className="w-full border-border"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep("confirm")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!date || !time || isSubmitting}
                data-testid="button-confirm-datetime"
              >
                Confirm
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tour Type:</span>
                <span className="text-white font-medium capitalize">{tourType === "virtual" ? "Virtual Tour" : "In-Person Tour"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-white font-medium">{new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-white font-medium">{time}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setStep("datetime")}
                variant="outline" 
                className="w-full border-border"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-submit-tour-request"
              >
                {isSubmitting ? "Submitting..." : "Request Tour"}
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
              <h3 className="text-xl font-bold text-white">Tour Request Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                The provider will review your request and respond within 24 hours.
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              Closing...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
