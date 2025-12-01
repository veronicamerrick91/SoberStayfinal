import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { submitReport } from "@/lib/reports";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  userName?: string;
}

type ReportCategory = "Safety" | "Scam" | "Inappropriate Content" | "Contact Issues" | "Other";

export function ReportModal({ open, onClose, propertyId, propertyName, userName = "Anonymous User" }: ReportModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("Safety");
  const [description, setDescription] = useState("");

  const categories: { label: string; value: ReportCategory; color: string }[] = [
    { label: "🚨 Safety Concern", value: "Safety", color: "red" },
    { label: "💰 Possible Scam", value: "Scam", color: "orange" },
    { label: "🚫 Inappropriate Content", value: "Inappropriate Content", color: "purple" },
    { label: "📞 Contact Issues", value: "Contact Issues", color: "blue" },
    { label: "❓ Other", value: "Other", color: "gray" },
  ];

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("Please describe the issue");
      return;
    }

    submitReport(propertyId, propertyName, userName, selectedCategory, description);
    setStep("success");

    setTimeout(() => {
      setStep("form");
      setDescription("");
      setSelectedCategory("Safety");
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white">Report {propertyName}</DialogTitle>
          <DialogDescription>Help us keep Sober Stay safe</DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-6">
            <div>
              <Label className="text-white text-sm mb-3 block">What's the issue?</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat.value
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-border"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">Describe the issue</Label>
              <Textarea
                placeholder="Please provide details about what you're reporting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-white/10 min-h-24"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your report will be reviewed by our safety team within 24 hours.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Report
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-border"
              >
                Cancel
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
              <h3 className="text-lg font-bold text-white">Report Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Thank you. Our safety team will review this and take action if needed.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
