import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, XCircle, Calendar, Mail, Phone, MapPin, 
  Activity, AlertTriangle, ShieldCheck, Clock, Briefcase, Home
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
  
  dob: string;
  gender: string;
  currentAddress: string;
  
  primarySubstance: string;
  soberDate: string;
  soberLength: string;
  matStatus: boolean;
  matMeds?: string;
  
  probation: boolean;
  pendingCases: boolean;
  medicalConditions: string;
  medications: string;
  
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
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col gap-4 p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={application.avatar} />
              <AvatarFallback>{application.applicantName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {application.applicantName}
                <Badge>{application.status}</Badge>
              </DialogTitle>
              <DialogDescription className="text-white text-sm mt-2">
                <div className="flex items-center gap-2"><Home className="w-3 h-3" /> Applied for: {application.property}</div>
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Submitted: {application.submittedDate}</div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 overflow-y-auto flex-1">
          {/* Risk Assessment */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className={`p-4 rounded border ${application.matStatus ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-border"}`}>
              <div className="flex items-center gap-2 mb-1 font-semibold text-white text-sm">
                <Activity className="w-4 h-4 text-blue-500" /> MAT Status
              </div>
              <p className="text-sm text-gray-300">{application.matStatus ? "Active" : "None"}</p>
              {application.matMeds && <p className="text-xs text-muted-foreground mt-1">{application.matMeds}</p>}
            </div>
            
            <div className={`p-4 rounded border ${application.probation || application.pendingCases ? "bg-amber-500/10 border-amber-500/20" : "bg-green-500/10 border-green-500/20"}`}>
              <div className="flex items-center gap-2 mb-1 font-semibold text-white text-sm">
                <ShieldCheck className="w-4 h-4" /> Legal Status
              </div>
              <p className="text-sm text-gray-300">{application.probation ? "Probation/Parole" : "No Supervision"}</p>
              {application.pendingCases && <p className="text-xs text-amber-500 mt-1">Pending Cases</p>}
            </div>

            <div className="p-4 rounded border bg-white/5 border-border">
              <div className="flex items-center gap-2 mb-1 font-semibold text-white text-sm">
                <Clock className="w-4 h-4 text-primary" /> Sobriety
              </div>
              <p className="text-sm text-gray-300">{application.soberLength}</p>
              <p className="text-xs text-muted-foreground mt-1">Since {application.soberDate}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4" /> {application.email}</div>
              <div className="flex items-center gap-2 text-gray-300"><Phone className="w-4 h-4" /> {application.phone}</div>
              <div className="col-span-2 flex items-start gap-2 text-gray-300"><MapPin className="w-4 h-4 mt-0.5" /> {application.currentAddress}</div>
            </div>
          </div>

          {/* Recovery & Health */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">Recovery & Health</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Primary Substance</span>
                <p className="text-gray-300">{application.primarySubstance}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block mb-1">Medical Conditions</span>
                  <p className="text-gray-300">{application.medicalConditions || "None"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Medications</span>
                  <p className="text-gray-300">{application.medications || "None"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment & Housing */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">Employment & Housing</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Briefcase className="w-4 h-4" /> Employment
                </div>
                <p className="text-gray-300 font-medium">{application.employmentStatus}</p>
                <p className="text-gray-400 text-xs mt-1">Source: {application.incomeSource}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Home className="w-4 h-4" /> Housing History
                </div>
                <p className="text-gray-300">{application.evictionHistory ? "Has prior evictions" : "No eviction history"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Reason for Current Housing Need</span>
                <p className="text-gray-300 italic">"{application.reasonForLeaving}"</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-card flex-col gap-3">
          {showDenyInput ? (
            <div className="space-y-3">
              <Textarea placeholder="Reason for denial..." value={denyReason} onChange={(e) => setDenyReason(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setShowDenyInput(false); setDenyReason(""); }}>Cancel</Button>
                <Button variant="destructive" onClick={handleDenyClick}>Confirm Denial</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
              <Button variant="outline" onClick={handleDenyClick} className="flex-1 border-red-500/30 text-red-500">
                <XCircle className="w-4 h-4 mr-2" /> Deny
              </Button>
              <Button onClick={() => { onApprove(application.id); onClose(); }} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
