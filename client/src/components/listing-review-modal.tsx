import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { MapPin, Users, Home, DollarSign, Check, X, AlertCircle, CheckCircle2, XCircle, Shield, AlertTriangle } from "lucide-react";

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
  };
  onApprove: (id: string) => void;
  onDeny: (id: string, reason: string) => void;
}

interface ApprovalCheckpoint {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail";
  description: string;
  icon: React.ReactNode;
}

export function ListingReviewModal({ open, onClose, listing, onApprove, onDeny }: ListingReviewModalProps) {
  const [denyReason, setDenyReason] = useState("");
  const [showDenyForm, setShowDenyForm] = useState(false);

  // Calculate completeness score
  const calculateCompleteness = () => {
    let score = 0;
    const total = 8;
    
    if (listing.image) score++;
    if (listing.description && listing.description.length > 100) score++;
    if (listing.price > 0) score++;
    if (listing.amenities && listing.amenities.length > 0) score++;
    if (listing.inclusions && listing.inclusions.length > 0) score++;
    if (listing.supervisionType) score++;
    if (listing.totalBeds > 0) score++;
    if (listing.address && listing.city && listing.state) score++;
    
    return Math.round((score / total) * 100);
  };

  // Generate approval checkpoints
  const getApprovalCheckpoints = (): ApprovalCheckpoint[] => {
    const checkpoints: ApprovalCheckpoint[] = [];
    
    // Photo Quality
    checkpoints.push({
      id: "photo",
      label: "Property Photo",
      status: listing.image ? "pass" : "fail",
      description: listing.image ? "High-quality image uploaded" : "Photo is required for listings",
      icon: listing.image ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    // Description Quality
    const descLength = listing.description?.length || 0;
    checkpoints.push({
      id: "description",
      label: "Description Quality",
      status: descLength > 150 ? "pass" : descLength > 50 ? "warning" : "fail",
      description: descLength > 150 ? `${descLength} characters - detailed` : `Only ${descLength} characters - too brief`,
      icon: descLength > 150 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />
    });

    // Pricing Reasonableness
    const priceReasonable = listing.price >= 400 && listing.price <= 3500;
    checkpoints.push({
      id: "price",
      label: "Pricing Reasonableness",
      status: priceReasonable ? "pass" : "warning",
      description: priceReasonable ? `$${listing.price}/${listing.pricePeriod} - within market range` : `$${listing.price}/${listing.pricePeriod} - outside typical range`,
      icon: priceReasonable ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />
    });

    // Amenities Listed
    const amenitiesCount = listing.amenities?.length || 0;
    checkpoints.push({
      id: "amenities",
      label: "Amenities & Features",
      status: amenitiesCount >= 3 ? "pass" : amenitiesCount >= 1 ? "warning" : "fail",
      description: amenitiesCount > 0 ? `${amenitiesCount} amenities listed` : "No amenities listed",
      icon: amenitiesCount >= 3 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />
    });

    // Inclusions Specified
    const inclusionsCount = listing.inclusions?.length || 0;
    checkpoints.push({
      id: "inclusions",
      label: "Rent Inclusions",
      status: inclusionsCount >= 2 ? "pass" : "warning",
      description: inclusionsCount > 0 ? `${inclusionsCount} items included (utilities, meals, etc.)` : "No inclusions specified",
      icon: inclusionsCount >= 2 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />
    });

    // Supervision Type
    checkpoints.push({
      id: "supervision",
      label: "Supervision Model",
      status: listing.supervisionType ? "pass" : "fail",
      description: listing.supervisionType ? `${listing.supervisionType}` : "Supervision type not specified",
      icon: listing.supervisionType ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    // Bed Count Realistic
    const bedsRealistic = listing.bedsAvailable > 0 && listing.bedsAvailable <= listing.totalBeds;
    checkpoints.push({
      id: "beds",
      label: "Bed Count Realistic",
      status: bedsRealistic ? "pass" : "fail",
      description: `${listing.bedsAvailable}/${listing.totalBeds} beds available`,
      icon: bedsRealistic ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    });

    // Verified Provider
    checkpoints.push({
      id: "verified",
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
  const canApprove = failCount === 0; // Allow approval if no failures

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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border bg-card shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">{listing.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 inline mr-1" /> {listing.address}, {listing.city}, {listing.state}
              </DialogDescription>
            </div>
            <Badge className={
              listing.status === "Pending" ? "bg-amber-500/80" :
              listing.status === "Approved" ? "bg-green-500/80" :
              "bg-red-500/80"
            }>{listing.status}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 overflow-hidden">
          <div className="space-y-6">
            {/* Property Image */}
            <div className="rounded-lg overflow-hidden">
              <img src={listing.image} alt={listing.name} className="w-full h-64 object-cover" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-lg font-bold text-white">${listing.price}</p>
                  <p className="text-xs text-muted-foreground">per {listing.pricePeriod}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Beds Available</p>
                  <p className="text-lg font-bold text-white">{listing.bedsAvailable}/{listing.totalBeds}</p>
                  <p className="text-xs text-muted-foreground">Total beds</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Gender</p>
                  <p className="text-lg font-bold text-white">{listing.gender}</p>
                  <p className="text-xs text-muted-foreground">Occupancy</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-border">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Completeness</p>
                  <p className="text-lg font-bold text-primary">{completeness}%</p>
                  <div className="h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${completeness}%` }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Approval Checklist */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Approval Checklist</h3>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">{passCount} Pass</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-300">{warningCount} Warning</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-300">{failCount} Issues</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {checkpoints.map((checkpoint) => (
                  <div 
                    key={checkpoint.id}
                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                      checkpoint.status === "pass" ? "bg-green-500/10 border-green-500/20" :
                      checkpoint.status === "warning" ? "bg-yellow-500/10 border-yellow-500/20" :
                      "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <div className="pt-1">{checkpoint.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{checkpoint.label}</p>
                      <p className="text-xs text-gray-300 mt-1">{checkpoint.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Property Description</h3>
              <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg">{listing.description}</p>
            </div>

            {/* Features */}
            {(listing.amenities || listing.inclusions) && (
              <div className="grid md:grid-cols-2 gap-4">
                {listing.amenities && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Amenities</h3>
                    <ul className="space-y-2">
                      {listing.amenities.map((amenity, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {listing.inclusions && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Rent Inclusions</h3>
                    <ul className="space-y-2">
                      {listing.inclusions.map((inclusion, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {inclusion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommendation */}
            {failCount > 0 && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300 mb-1">Approval Issues Detected</p>
                    <p className="text-xs text-red-200">This listing has {failCount} critical issue(s) that should be resolved before approval. Contact the provider for corrections.</p>
                  </div>
                </div>
              </div>
            )}

            {canApprove && passCount >= 6 && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-300 mb-1">Ready to Approve</p>
                    <p className="text-xs text-green-200">This listing meets approval standards and can be published to the platform.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-border bg-card flex-col sm:flex-row gap-3 shrink-0">
          {!showDenyForm ? (
            <>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => setShowDenyForm(true)} 
                variant="outline" 
                className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" /> Deny Listing
              </Button>
              <Button 
                onClick={() => onApprove(listing.id)} 
                disabled={!canApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" /> Approve Listing
              </Button>
            </>
          ) : (
            <div className="w-full space-y-3">
              <div>
                <Label className="text-white text-sm mb-2 block">Reason for Denial</Label>
                <Textarea
                  placeholder="Explain why this listing is being denied (e.g., inappropriate content, suspicious pricing, etc.)..."
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className="bg-background/50 border-white/10 min-h-20"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setShowDenyForm(false)} variant="outline">Cancel</Button>
                <Button onClick={handleDeny} className="bg-red-600 hover:bg-red-700 text-white">Confirm Denial</Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
