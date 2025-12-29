import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, XCircle, Calendar, Mail, Phone, MapPin,
  Activity, ShieldCheck, Clock, Briefcase, Home
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export interface ApplicationData {
  id: string;
  tenantId?: string;
  applicantName: string;
  email: string;
  phone: string;
  property: string;
  submittedDate: string;
  status: "New" | "Screening" | "Approved" | "Denied" | "Draft" | "Pending";
  avatar?: string;
  idPhotoUrl?: string;
  
  // Payment fields
  paymentStatus?: "paid" | "unpaid";
  hasFeeWaiver?: boolean;
  
  // Personal Information
  dob: string;
  gender: string;
  currentAddress: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  // Substance Use History
  primarySubstance: string;
  ageOfFirstUse?: string;
  lastDateOfUse?: string;
  soberDate: string;
  soberLength: string;
  overdoseHistory?: string;
  overdoseDate?: string;
  matHistory?: string;
  currentMat?: string;
  matStatus: boolean;
  matMeds?: string;
  
  // Medical Information
  medicalConditions: string;
  mentalHealthDiagnoses?: string;
  medications: string;
  allergies?: string;
  mobilityIssues?: string;
  seizureHistory?: string;
  isPregnant?: string;
  
  // Legal Status
  probation: boolean;
  probationDetails?: string;
  pendingCases: boolean;
  restrainingOrders?: string;
  violentOffenses?: string;
  
  // Employment & Income
  employmentStatus: string;
  incomeSource: string;
  canPayRent?: string;
  lookingForEmployment?: string;
  
  // Housing Background
  reasonForLeaving: string;
  previousSoberLiving?: string;
  evictionHistory: boolean;
  housingViolations?: string;
  adaAccommodations?: string;
  
  // Preferences
  roomPreference?: string;
  genderSpecificHousing?: string;
  lgbtqAffirming?: string;
  petFriendly?: string;
  smokingStatus?: string;
  transportationNeeds?: string;
  emotionalSupportAnimal?: string;
  moveInDate?: string;
}

interface ApplicationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  application: ApplicationData | null;
  onApprove: (id: string, moveInDate?: string) => void;
  onDeny: (id: string, reason: string) => void;
  onGrantFeeWaiver?: (id: string) => void;
}

const DENIAL_REASONS = [
  "Insufficient sobriety period (less than 30 days)",
  "Criminal history concerns",
  "Unstable housing history with recent evictions",
  "Incomplete application or missing documentation",
  "Failed background check or legal hold",
  "Inadequate income/employment verification",
  "Active substance use indicators",
  "Probation/parole violations",
  "Property-specific concerns",
  "Other (specify in notes)"
];

export function ApplicationDetailsModal({ open, onClose, application, onApprove, onDeny, onGrantFeeWaiver }: ApplicationDetailsModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [showDenyInput, setShowDenyInput] = useState(false);
  const [showApproveInput, setShowApproveInput] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");

  if (!application) return null;

  // Providers with active subscriptions can always take action on applications

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
          {/* Risk Assessment Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className={`p-4 rounded border ${application.matStatus ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-border"}`}>
              <div className="flex items-center gap-2 mb-1 font-semibold text-white text-sm">
                <Activity className="w-4 h-4 text-blue-500" /> MAT Status
              </div>
              <p className="text-sm text-gray-300">{application.matStatus ? "Active" : "None"}</p>
              {application.currentMat && <p className="text-xs text-muted-foreground mt-1">{application.currentMat}</p>}
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

          {/* 1. Personal Information */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">1. Personal Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4" /> {application.email}</div>
              <div className="flex items-center gap-2 text-gray-300"><Phone className="w-4 h-4" /> {application.phone}</div>
              <div className="col-span-2 flex items-start gap-2 text-gray-300"><MapPin className="w-4 h-4 mt-0.5" /> {application.currentAddress}</div>
              <div>
                <span className="text-muted-foreground block mb-1">Date of Birth</span>
                <p className="text-gray-300">{application.dob}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Gender</span>
                <p className="text-gray-300">{application.gender}</p>
              </div>
            </div>
            {(application.emergencyContactName || application.emergencyContactPhone) && (
              <div className="mt-4 p-3 bg-white/5 rounded border border-border">
                <p className="text-xs text-muted-foreground mb-2">Emergency Contact</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <p className="text-gray-300">{application.emergencyContactName || "Not provided"}</p>
                  <p className="text-gray-300">{application.emergencyContactPhone || "Not provided"}</p>
                  <p className="text-gray-400">{application.emergencyContactRelationship || ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. ID Document */}
          {application.idPhotoUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">2. Government ID</h3>
              <div className="bg-white/5 border border-border rounded-lg p-4">
                <img 
                  src={application.idPhotoUrl} 
                  alt="Government ID" 
                  className="max-w-full max-h-48 rounded-lg border border-border mx-auto"
                  data-testid="img-tenant-id"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">Uploaded government-issued ID</p>
              </div>
            </div>
          )}

          {/* 3. Substance Use History */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">3. Substance Use History</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Primary Substance</span>
                <p className="text-gray-300">{application.primarySubstance}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Age of First Use</span>
                <p className="text-gray-300">{application.ageOfFirstUse || "Not provided"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Last Date of Use</span>
                <p className="text-gray-300">{application.lastDateOfUse || application.soberDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Length of Sobriety</span>
                <p className="text-gray-300">{application.soberLength}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Overdose History</span>
                <p className="text-gray-300">{application.overdoseHistory || "No"}</p>
              </div>
              {application.overdoseDate && (
                <div>
                  <span className="text-muted-foreground block mb-1">Last Overdose Date</span>
                  <p className="text-gray-300">{application.overdoseDate}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block mb-1">MAT History</span>
                <p className="text-gray-300">{application.matHistory || (application.matStatus ? "Yes" : "No")}</p>
              </div>
              {application.currentMat && (
                <div>
                  <span className="text-muted-foreground block mb-1">Current MAT Medication</span>
                  <p className="text-gray-300">{application.currentMat}</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Medical Information */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">4. Medical Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Medical Conditions</span>
                <p className="text-gray-300">{application.medicalConditions || "None"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Mental Health Diagnoses</span>
                <p className="text-gray-300">{application.mentalHealthDiagnoses || "None"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Current Medications</span>
                <p className="text-gray-300">{application.medications || "None"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Allergies</span>
                <p className="text-gray-300">{application.allergies || "None"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Mobility Issues</span>
                <p className="text-gray-300">{application.mobilityIssues || "None"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Seizure History</span>
                <p className="text-gray-300">{application.seizureHistory || "No"}</p>
              </div>
              {application.isPregnant && (
                <div>
                  <span className="text-muted-foreground block mb-1">Pregnancy Status</span>
                  <p className="text-gray-300">{application.isPregnant}</p>
                </div>
              )}
            </div>
          </div>

          {/* 5. Legal Status */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">5. Legal Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">On Probation/Parole</span>
                <p className="text-gray-300">{application.probation ? "Yes" : "No"}</p>
              </div>
              {application.probationDetails && (
                <div>
                  <span className="text-muted-foreground block mb-1">Probation Details</span>
                  <p className="text-gray-300">{application.probationDetails}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block mb-1">Pending Legal Cases</span>
                <p className="text-gray-300">{application.pendingCases ? "Yes" : "No"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Restraining Orders</span>
                <p className="text-gray-300">{application.restrainingOrders || "No"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">History of Violent Offenses</span>
                <p className="text-gray-300">{application.violentOffenses || "No"}</p>
              </div>
            </div>
          </div>

          {/* 6. Employment & Income */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">6. Employment & Income</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Briefcase className="w-4 h-4" /> Employment Status
                </div>
                <p className="text-gray-300 font-medium">{application.employmentStatus}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Income Sources</span>
                <p className="text-gray-300">{application.incomeSource}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Can Pay Rent at Move-In</span>
                <p className="text-gray-300">{application.canPayRent || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Looking for Employment</span>
                <p className="text-gray-300">{application.lookingForEmployment || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* 7. Housing Background */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">7. Housing Background</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Reason for Leaving Current Situation</span>
                <p className="text-gray-300 italic">"{application.reasonForLeaving}"</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Previous Sober Living Experience</span>
                <p className="text-gray-300">{application.previousSoberLiving || "No"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Home className="w-4 h-4" /> Eviction History
                </div>
                <p className="text-gray-300">{application.evictionHistory ? "Yes" : "No"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Housing Rule Violations</span>
                <p className="text-gray-300">{application.housingViolations || "None"}</p>
              </div>
              {application.adaAccommodations && (
                <div>
                  <span className="text-muted-foreground block mb-1">ADA Accommodations Needed</span>
                  <p className="text-gray-300">{application.adaAccommodations}</p>
                </div>
              )}
            </div>
          </div>

          {/* 8. Preferences */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">8. Personal Needs & Preferences</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Room Preference</span>
                <p className="text-gray-300">{application.roomPreference || "No preference"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Requested Move-In Date</span>
                <p className="text-gray-300">{application.moveInDate || "Flexible"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Gender-Specific Housing</span>
                <p className="text-gray-300">{application.genderSpecificHousing || "No preference"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">LGBTQ+ Affirming</span>
                <p className="text-gray-300">{application.lgbtqAffirming || "No preference"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Pet Friendly</span>
                <p className="text-gray-300">{application.petFriendly || "No"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Smoking Status</span>
                <p className="text-gray-300">{application.smokingStatus || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Transportation Needs</span>
                <p className="text-gray-300">{application.transportationNeeds || "None"}</p>
              </div>
              {application.emotionalSupportAnimal && (
                <div>
                  <span className="text-muted-foreground block mb-1">Emotional Support Animal</span>
                  <p className="text-gray-300">{application.emotionalSupportAnimal}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-card flex-col gap-3">
          {showDenyInput ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Select Denial Reason *</label>
                <select value={denyReason} onChange={(e) => setDenyReason(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm">
                  <option value="">Choose a reason...</option>
                  {DENIAL_REASONS.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setShowDenyInput(false); setDenyReason(""); }}>Cancel</Button>
                <Button variant="destructive" disabled={!denyReason} onClick={handleDenyClick}>Confirm Denial</Button>
              </div>
            </div>
          ) : showApproveInput ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Move-In Date (optional)</label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-white/10 text-white text-sm"
                  data-testid="input-move-in-date"
                />
                <p className="text-xs text-muted-foreground mt-1">Set move-in date to send a reminder email 3 days before</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setShowApproveInput(false); setMoveInDate(""); }}>Cancel</Button>
                <Button onClick={() => { onApprove(application.id, moveInDate || undefined); setShowApproveInput(false); setMoveInDate(""); onClose(); }} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" /> Confirm Approval
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
              <Button 
                variant="outline" 
                onClick={handleDenyClick} 
                className="flex-1 border-red-500/30 text-red-500"
                data-testid="button-deny-application"
              >
                <XCircle className="w-4 h-4 mr-2" /> Deny
              </Button>
              <Button 
                onClick={() => setShowApproveInput(true)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                data-testid="button-approve-application"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
