import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, XCircle, Calendar, User, Mail, Phone, MapPin, 
  Activity, AlertTriangle, FileText, ShieldCheck, Clock, Briefcase, Home
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export interface ApplicationData {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  property: string;
  submittedDate: string;
  status: "New" | "Screening" | "Approved" | "Denied";
  avatar?: string;
  
  // Personal Info
  dob: string;
  gender: string;
  currentAddress: string;
  
  // Substance Use
  primarySubstance: string;
  soberDate: string;
  soberLength: string;
  matStatus: boolean;
  matMeds?: string;
  
  // Legal & Medical
  probation: boolean;
  pendingCases: boolean;
  medicalConditions: string;
  medications: string;
  
  // Housing & Employment
  employmentStatus: string;
  incomeSource: string;
  evictionHistory: boolean;
  reasonForLeaving: string;
}

interface ApplicationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  application: ApplicationData | null;
  onApprove: (id: string) => void;
  onDeny: (id: string, reason: string) => void;
}

export function ApplicationDetailsModal({ open, onClose, application, onApprove, onDeny }: ApplicationDetailsModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [showDenyInput, setShowDenyInput] = useState(false);

  if (!application) return null;

  const handleDenyClick = () => {
    if (showDenyInput) {
      onDeny(application.id, denyReason);
      setShowDenyInput(false);
      setDenyReason("");
      onClose();
    } else {
      setShowDenyInput(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogDescription className="sr-only">Tenant application review details</DialogDescription>
        <DialogHeader className="p-6 border-b border-border bg-card">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage src={application.avatar} />
                <AvatarFallback className="text-lg">{application.applicantName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {application.applicantName}
                  <Badge variant={application.status === "New" ? "default" : application.status === "Approved" ? "secondary" : "outline"}>
                    {application.status}
                  </Badge>
                </DialogTitle>
                <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Home className="w-3 h-3" /> Applied for: <span className="text-white">{application.property}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Applied: {application.submittedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {/* Quick Actions / Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${application.matStatus ? "bg-blue-500/10 border-blue-500/20" : "bg-card border-border"}`}>
                <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                  <Activity className="w-4 h-4 text-blue-500" /> MAT Status
                </div>
                <p className="text-sm text-gray-300">{application.matStatus ? "Active" : "None"}</p>
                {application.matMeds && <p className="text-xs text-muted-foreground mt-1">{application.matMeds}</p>}
              </div>
              
              <div className={`p-4 rounded-lg border ${application.probation || application.pendingCases ? "bg-amber-500/10 border-amber-500/20" : "bg-green-500/10 border-green-500/20"}`}>
                <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> Legal Status
                </div>
                <p className="text-sm text-gray-300">
                  {application.probation ? "Probation/Parole" : "No Supervision"}
                </p>
                {application.pendingCases && <p className="text-xs text-amber-500 mt-1">Pending Cases</p>}
              </div>

              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                  <Clock className="w-4 h-4 text-primary" /> Sobriety
                </div>
                <p className="text-sm text-gray-300">{application.soberLength}</p>
                <p className="text-xs text-muted-foreground mt-1">Since {application.soberDate}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-muted-foreground" /> {application.email}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-muted-foreground" /> {application.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-300 md:col-span-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> {application.currentAddress}
                </div>
              </div>
            </div>

            {/* Recovery & Health */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Recovery & Health</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Primary Substance History</span>
                  <p className="text-gray-300">{application.primarySubstance}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block mb-1">Medical Conditions</span>
                    <p className="text-gray-300">{application.medicalConditions || "None listed"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Current Medications</span>
                    <p className="text-gray-300">{application.medications || "None listed"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment & Housing */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Employment & Housing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" /> Employment
                  </div>
                  <p className="text-gray-300 font-medium">{application.employmentStatus}</p>
                  <p className="text-gray-400 text-xs mt-1">Source: {application.incomeSource}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                    <AlertTriangle className="w-4 h-4" /> Housing History
                  </div>
                  <p className="text-gray-300">
                    {application.evictionHistory ? "Has prior evictions" : "No eviction history"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground block mb-1">Reason for Leaving Current Housing</span>
                  <p className="text-gray-300 italic">"{application.reasonForLeaving}"</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-border bg-card flex-col sm:flex-row gap-3">
          {showDenyInput ? (
            <div className="w-full space-y-3">
              <Textarea 
                placeholder="Reason for denial (optional)..." 
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                className="bg-background/50"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowDenyInput(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDenyClick}>Confirm Denial</Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={handleDenyClick} className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                <XCircle className="w-4 h-4 mr-2" /> Deny Application
              </Button>
              <Button onClick={() => { onApprove(application.id); onClose(); }} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Approve Application
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
