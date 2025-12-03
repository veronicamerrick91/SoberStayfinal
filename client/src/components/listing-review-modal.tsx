import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, Check, X, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ListingReviewModalProps {
  open: boolean;
  onClose: () => void;
  listing: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    price: number;
    pricePeriod: string;
    gender: string;
    bedsAvailable: number;
    totalBeds: number;
    image: string;
    description: string;
    isVerified: boolean;
    status?: "Pending" | "Approved" | "Rejected";
    supervisionType?: string;
    amenities?: string[];
    inclusions?: string[];
    houseRules?: string[];
    requirements?: string[];
  };
  onApprove: (id: string) => void;
  onDeny: (id: string, reason: string) => void;
}

export function ListingReviewModal({ open, onClose, listing, onApprove, onDeny }: ListingReviewModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [showDenyForm, setShowDenyForm] = useState(false);

  const calculateCompleteness = () => {
    let completeness = 0;
    if (listing.image) completeness += 15;
    if (listing.description && listing.description.length > 50) completeness += 15;
    if (listing.price > 0) completeness += 15;
    if (listing.amenities && listing.amenities.length > 0) completeness += 15;
    if (listing.inclusions && listing.inclusions.length > 0) completeness += 15;
    if (listing.supervisionType) completeness += 15;
    if (listing.totalBeds > 0) completeness += 10;
    return completeness;
  };

  const getApprovalCheckpoints = () => {
    const checkpoints = [];
    
    checkpoints.push({
      id: "photo",
      label: "Property Photos",
      status: listing.image ? "pass" : "fail",
      description: listing.image ? "High-quality images provided" : "No photos uploaded",
      icon: listing.image ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    checkpoints.push({
      id: "description",
      label: "Property Description",
      status: listing.description && listing.description.length > 50 ? "pass" : "warning",
      description: listing.description && listing.description.length > 50 ? "Detailed description provided" : "Description needs more detail",
      icon: listing.description && listing.description.length > 50 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    checkpoints.push({
      id: "pricing",
      label: "Pricing Information",
      status: listing.price > 0 ? "pass" : "fail",
      description: listing.price > 0 ? `$${listing.price}/${listing.pricePeriod}` : "No pricing set",
      icon: listing.price > 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    checkpoints.push({
      id: "amenities",
      label: "Amenities Listed",
      status: listing.amenities && listing.amenities.length > 0 ? "pass" : "warning",
      description: listing.amenities && listing.amenities.length > 0 ? `${listing.amenities.length} amenities listed` : "No amenities specified",
      icon: listing.amenities && listing.amenities.length > 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    checkpoints.push({
      id: "inclusions",
      label: "Rent Inclusions",
      status: listing.inclusions && listing.inclusions.length > 0 ? "pass" : "warning",
      description: listing.inclusions && listing.inclusions.length > 0 ? `${listing.inclusions.length} inclusions listed` : "No inclusions specified",
      icon: listing.inclusions && listing.inclusions.length > 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    checkpoints.push({
      id: "supervision",
      label: "Supervision Type",
      status: listing.supervisionType ? "pass" : "warning",
      description: listing.supervisionType || "Not specified",
      icon: listing.supervisionType ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    checkpoints.push({
      id: "beds",
      label: "Bed Count",
      status: listing.totalBeds > 0 ? "pass" : "fail",
      description: listing.totalBeds > 0 ? `${listing.totalBeds} total beds` : "No beds specified",
      icon: listing.totalBeds > 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    checkpoints.push({
      id: "verification",
      label: "Provider Verification",
      status: listing.isVerified ? "pass" : "warning",
      description: listing.isVerified ? "Provider is verified" : "Provider not yet verified",
      icon: listing.isVerified ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    return checkpoints;
  };

  const checkpoints = getApprovalCheckpoints();
  const passCount = checkpoints.filter(c => c.status === "pass").length;
  const warningCount = checkpoints.filter(c => c.status === "warning").length;
  const failCount = checkpoints.filter(c => c.status === "fail").length;
  const completeness = calculateCompleteness();
  const canApprove = failCount === 0;

  const handleDeny = () => {
    if (!denyReason.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    onDeny(listing.id, denyReason);
    setDenyReason("");
    setShowDenyForm(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-4 p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-white">{listing.name}</DialogTitle>
          <DialogDescription>
            <MapPin className="w-3 h-3 inline mr-1" /> {listing.address}, {listing.city}, {listing.state}
          </DialogDescription>
          <div className="flex gap-2 mt-3 flex-wrap items-center">
            <Badge className="w-fit">{listing.status}</Badge>
            <Badge variant="outline">{listing.gender}</Badge>
            <Badge variant="outline">{listing.totalBeds} Beds</Badge>
            <Badge variant="outline">{listing.supervisionType}</Badge>
          </div>
        </DialogHeader>

        <div className="px-6 overflow-y-auto flex-1">
          {/* Property Image */}
          <div className="mb-6">
            <img src={listing.image} alt={listing.name} className="w-full h-64 object-cover rounded-lg" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Card className="bg-white/5">
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-lg font-bold text-white">${listing.price}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-1">Beds</p>
                <p className="text-lg font-bold text-white">{listing.bedsAvailable}/{listing.totalBeds}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-lg font-bold text-white">{listing.gender}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground mb-1">Complete</p>
                <p className="text-lg font-bold text-primary">{completeness}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Approval Checklist */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Approval Checklist</h3>
            <div className="flex gap-3 text-xs mb-4">
              <span className="flex items-center gap-1 text-gray-300"><CheckCircle2 className="w-4 h-4 text-green-500" /> {passCount} Pass</span>
              <span className="flex items-center gap-1 text-gray-300"><AlertTriangle className="w-4 h-4 text-yellow-500" /> {warningCount} Warning</span>
              <span className="flex items-center gap-1 text-gray-300"><XCircle className="w-4 h-4 text-red-500" /> {failCount} Issues</span>
            </div>
            <div className="space-y-2">
              {checkpoints.map((cp) => (
                <div key={cp.id} className={`p-3 rounded border flex items-start gap-3 ${
                  cp.status === "pass" ? "bg-green-500/10 border-green-500/20" :
                  cp.status === "warning" ? "bg-yellow-500/10 border-yellow-500/20" :
                  "bg-red-500/10 border-red-500/20"
                }`}>
                  <div>{cp.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{cp.label}</p>
                    <p className="text-xs text-gray-300">{cp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-2">Description</h3>
            <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">{listing.description}</p>
          </div>

          {/* Amenities & Inclusions */}
          {(listing.amenities || listing.inclusions) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {listing.inclusions && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Amenities & Features</h3>
                  <ul className="space-y-1">
                    {listing.inclusions.map((inc, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {listing.amenities && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Included in Monthly Price</h3>
                  <ul className="space-y-1">
                    {listing.amenities.map((a, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* House Rules */}
          {listing.houseRules && listing.houseRules.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-2">House Rules</h3>
              <ul className="space-y-1">
                {listing.houseRules.map((rule, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-500 rounded-full" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {listing.requirements && listing.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-2">Residency Requirements</h3>
              <ul className="space-y-1">
                {listing.requirements.map((req, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-card flex-col gap-3">
          {!showDenyForm ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
              <Button variant="outline" onClick={() => setShowDenyForm(true)} className="flex-1 border-red-500/30 text-red-500">
                <X className="w-4 h-4 mr-2" /> Deny
              </Button>
              <Button disabled={!canApprove} onClick={() => { onApprove(listing.id); onClose(); }} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" /> Approve
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-white">Reason for Denial</Label>
              <Textarea placeholder="Explain why..." value={denyReason} onChange={(e) => setDenyReason(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setShowDenyForm(false); setDenyReason(""); }}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeny}>Confirm Denial</Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
