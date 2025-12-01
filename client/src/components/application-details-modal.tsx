import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FileText, User, Heart, Home, FileCheck, MessageSquare } from "lucide-react";

interface ApplicationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  application: {
    id: string;
    tenantName: string;
    email: string;
    phone: string;
    propertyName: string;
    status: "Pending Review" | "Needs Info" | "Approved" | "Denied";
    completeness: number;
    submittedDate: string;
    photoID?: string;
    sobrietyStatus?: string;
    yearsClean?: number;
    treatmentHistory?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    housing?: string;
    insurance?: string;
  };
  onApprove: (id: string) => void;
  onDeny: (id: string, reason: string) => void;
  onRequestInfo: (id: string, message: string) => void;
}

export function ApplicationDetailsModal({
  open,
  onClose,
  application,
  onApprove,
  onDeny,
  onRequestInfo,
}: ApplicationDetailsModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [infoRequest, setInfoRequest] = useState("");
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);

  const handleApprove = () => {
    onApprove(application.id);
    onClose();
  };

  const handleDeny = () => {
    if (!denyReason.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    onDeny(application.id, denyReason);
    setDenyReason("");
    setShowDenyForm(false);
    onClose();
  };

  const handleRequestInfo = () => {
    if (!infoRequest.trim()) {
      alert("Please provide the information you're requesting");
      return;
    }
    onRequestInfo(application.id, infoRequest);
    setInfoRequest("");
    setShowInfoForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>Application from {application.tenantName}</span>
            <Badge
              className={
                application.status === "Approved"
                  ? "bg-green-500/80"
                  : application.status === "Denied"
                  ? "bg-red-500/80"
                  : application.status === "Needs Info"
                  ? "bg-blue-500/80"
                  : "bg-amber-500/80"
              }
            >
              {application.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Full Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Tenant
                  </p>
                  <p className="text-white font-bold">{application.tenantName}</p>
                  <p className="text-xs text-muted-foreground">{application.email}</p>
                  <p className="text-xs text-muted-foreground">{application.phone}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Home className="w-3 h-3" /> Property Interest
                  </p>
                  <p className="text-white font-bold">{application.propertyName}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> Completeness
                  </p>
                  <p className="text-2xl font-bold text-primary">{application.completeness}%</p>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${application.completeness}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Sobriety Status
                  </p>
                  <p className="text-white font-bold">{application.sobrietyStatus || "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">
                    Years clean: {application.yearsClean || "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {application.photoID && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">Photo ID Status</p>
                  <Badge className="bg-green-500/80">✓ Uploaded</Badge>
                </div>
              )}

              {application.treatmentHistory && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">Treatment History</p>
                  <p className="text-sm text-gray-300 bg-black/20 p-2 rounded">
                    {application.treatmentHistory}
                  </p>
                </div>
              )}

              {application.emergencyContact && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">Emergency Contact</p>
                  <p className="text-sm text-white">{application.emergencyContact}</p>
                  <p className="text-xs text-muted-foreground">{application.emergencyPhone}</p>
                </div>
              )}

              {application.housing && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">Housing Needs</p>
                  <p className="text-sm text-gray-300 bg-black/20 p-2 rounded">
                    {application.housing}
                  </p>
                </div>
              )}

              {application.insurance && (
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-1">Insurance Information</p>
                  <p className="text-sm text-gray-300">{application.insurance}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {!showDenyForm && !showInfoForm && (
              <div className="space-y-2">
                <Button
                  onClick={handleApprove}
                  className="w-full bg-green-500/20 text-green-500 hover:bg-green-500/30 h-10"
                >
                  ✓ Approve Application
                </Button>
                <Button
                  onClick={() => setShowInfoForm(true)}
                  className="w-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 h-10"
                >
                  ❓ Request More Information
                </Button>
                <Button
                  onClick={() => setShowDenyForm(true)}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 h-10"
                >
                  ✕ Deny Application
                </Button>
              </div>
            )}

            {showDenyForm && (
              <div className="space-y-2">
                <Label className="text-white text-sm">Reason for Denial</Label>
                <Textarea
                  placeholder="Explain why this application is being denied..."
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className="bg-background/50 border-white/10 min-h-20"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeny}
                    className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  >
                    Send Denial
                  </Button>
                  <Button
                    onClick={() => setShowDenyForm(false)}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {showInfoForm && (
              <div className="space-y-2">
                <Label className="text-white text-sm">Information Requested</Label>
                <Textarea
                  placeholder="Specify what information you need from the tenant..."
                  value={infoRequest}
                  onChange={(e) => setInfoRequest(e.target.value)}
                  className="bg-background/50 border-white/10 min-h-20"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleRequestInfo}
                    className="flex-1 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                  >
                    Send Request
                  </Button>
                  <Button
                    onClick={() => setShowInfoForm(false)}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
