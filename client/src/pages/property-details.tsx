import { Layout } from "@/components/layout";
import { SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, ShieldCheck, Check, ArrowLeft, Share2, Heart, Flag,
  Wifi, Car, Utensils, Tv, Dumbbell, Calendar,
  Info, Mail, Phone, MessageSquare, Bus, ShoppingCart, Stethoscope, Users,
  Video, Lock, Loader2, Home
} from "lucide-react";
import { useRoute, Link, useLocation } from "wouter";
import { isAuthenticated, getAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { incrementStat, addViewedHome } from "@/lib/tenant-engagement";
import { ReportModal } from "@/components/report-modal";
import { TourScheduleModal } from "@/components/tour-schedule-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";
import placeholderHome from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";

async function fetchListing(id: string): Promise<Listing> {
  const response = await fetch(`/api/listings/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }
  return response.json();
}

export default function PropertyDetails() {
  const [match, params] = useRoute("/property/:id");
  const [location, setLocation] = useLocation();
  const [isFav, setIsFav] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const user = { name: "Tenant User", email: "tenant@example.com" };

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ["listing", params?.id],
    queryFn: () => fetchListing(params?.id || ""),
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (listing?.id) {
      setIsFav(isFavorite(String(listing.id)));
      
      const auth = getAuth();
      if (auth?.role === "tenant") {
        const viewedKey = `viewed_${listing.id}`;
        if (!sessionStorage.getItem(viewedKey)) {
          incrementStat("homesViewed");
          addViewedHome(String(listing.id));
          sessionStorage.setItem(viewedKey, "true");
        }
      }
    }
  }, [listing?.id]);

  const handleApply = () => {
    if (!isAuthenticated()) {
      setLocation(`/login?returnPath=/apply/${listing?.id}`);
    } else {
      setLocation(`/apply/${listing?.id}`);
    }
  };

  const handleFavorite = () => {
    if (listing?.id) {
      const newState = toggleFavorite(String(listing.id));
      setIsFav(newState);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/property/${listing?.id}`;
    const shareText = `Check out ${listing?.propertyName} on Sober Stay - A safe, supportive sober living home in ${listing?.city}, ${listing?.state}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.propertyName,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">This listing may have been removed or is no longer available.</p>
            <Link href="/browse">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" /> Browse All Homes
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Breadcrumb / Back */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/browse">
            <Button variant="ghost" className="gap-2 pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4" /> Back to Browse
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery (Main Image) */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <img src={listing.photos?.[0] || placeholderHome} className="w-full h-full object-cover" alt={listing.propertyName} />
              <div className="absolute top-4 left-4">
                {listing.status === "approved" && (
                  <Badge className="bg-emerald-500/90 backdrop-blur text-white border-none flex gap-1 items-center px-3 py-1.5 shadow-lg">
                    <ShieldCheck className="w-3 h-3" /> Verified Listing
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                 <Button onClick={handleShare} size="icon" variant="secondary" className="rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur" title="Share this listing">
                   <Share2 className="w-4 h-4" />
                 </Button>
                 <Button onClick={handleFavorite} size="icon" variant="secondary" className={`rounded-full backdrop-blur ${isFav ? "bg-primary/90 hover:bg-primary text-white" : "bg-black/50 hover:bg-black/70 text-white"}`}>
                   <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                 </Button>
                 <Button onClick={() => setShowReportModal(true)} size="icon" variant="secondary" className="rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur" title="Report this listing">
                   <Flag className="w-4 h-4" />
                 </Button>
              </div>
            </div>

            {/* Title & Key Info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-white">{listing.propertyName}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${listing.monthlyPrice}</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground mb-3">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {listing.address}, {listing.city}, {listing.state}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                 <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-medium">{listing.gender}</Badge>
                 <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 text-xs font-medium">{listing.totalBeds} Beds</Badge>
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs font-medium cursor-help hover:bg-purple-500/30">
                          {listing.supervisionType}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{SUPERVISION_DEFINITIONS[listing.supervisionType as keyof typeof SUPERVISION_DEFINITIONS]}</p>
                      </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
                 {listing.isMatFriendly && <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-medium">MAT Friendly</Badge>}
                 {listing.isPetFriendly && <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 text-xs font-medium">Pet Friendly</Badge>}
                 {listing.isLgbtqFriendly && <Badge className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 text-xs font-medium">LGBTQ+ Friendly</Badge>}
                 {listing.isFaithBased && <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 text-xs font-medium">Faith Based</Badge>}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card/50 border border-border rounded-xl p-8">
              <h3 className="text-lg font-bold text-white mb-4">About this Home</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Amenities & Features */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Amenities & Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                      <Check className="w-5 h-5 text-primary" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">House Rules</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["No drugs or alcohol", "Curfew 11pm", "Weekly house meetings", "Chore rotation", "Guests must be approved"].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                    <Check className="w-5 h-5 text-primary" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            {/* Residency Requirements */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Residency Requirements</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["Minimum 30 days sober", "Valid ID required", "Employment or education", "6+ month commitment", "3 meetings per week"].map((req, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                    <Check className="w-5 h-5 text-primary" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* Included in Monthly Price */}
            {listing.inclusions && listing.inclusions.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Included in Monthly Price</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {listing.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                      <Check className="w-5 h-5 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Amenities */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Nearby Services & Support</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { category: "Recovery Meetings", items: [{ name: "AA Meeting", distance: "0.5 mi" }, { name: "NA Meeting", distance: "0.7 mi" }] },
                  { category: "Treatment Centers", items: [{ name: "Recovery Center", distance: "1.2 mi" }] },
                  { category: "Therapy/IOP", items: [{ name: "Outpatient Program", distance: "0.8 mi" }] }
                ].map((amenity, idx) => {
                  const getCategoryIcon = (category: string) => {
                    switch(category) {
                      case "Transportation": return <Bus className="w-5 h-5" />;
                      case "Food": return <Utensils className="w-5 h-5" />;
                      case "Groceries": return <ShoppingCart className="w-5 h-5" />;
                      case "Therapy/IOP": return <Stethoscope className="w-5 h-5" />;
                      case "Recovery Meetings": return <Users className="w-5 h-5" />;
                      case "Treatment Centers": return <Users className="w-5 h-5" />;
                      default: return <Check className="w-5 h-5" />;
                    }
                  };

                  return (
                    <div key={idx} className="rounded-lg bg-card/30 border border-border/50 p-4 space-y-3 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 text-primary font-semibold">
                        {getCategoryIcon(amenity.category)}
                        <span>{amenity.category}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {amenity.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-start text-gray-300">
                            <span className="flex-1">{item.name}</span>
                            <span className="text-muted-foreground text-xs ml-2 whitespace-nowrap">{item.distance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact / Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border sticky top-6 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="text-center border-b border-border pb-6">
                  <div className="text-3xl font-bold text-primary mb-1">${listing.monthlyPrice}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleApply} 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg shadow-lg shadow-primary/20"
                    data-testid="button-apply"
                  >
                    Apply Now
                  </Button>
                  <Button 
                    onClick={() => setShowTourModal(true)} 
                    variant="outline" 
                    className="w-full border-primary/30 text-primary hover:bg-primary/10 h-12"
                    data-testid="button-schedule-tour"
                  >
                    <Calendar className="w-4 h-4 mr-2" /> Schedule a Tour
                  </Button>
                  <Link href={`/chat/${listing.providerId}`} className="block w-full">
                    <Button variant="outline" className="w-full border-white/10 hover:bg-card h-10">
                      <MessageSquare className="w-4 h-4 mr-2" /> Message Provider
                    </Button>
                  </Link>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <h4 className="font-bold text-white text-sm">Contact Information</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-primary" />
                    Contact via message
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-primary" />
                    Contact via message
                  </div>
                </div>

                <div className="pt-6 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3" />
                    <span>Listed by verified provider</span>
                  </div>
                  <p>This listing has been verified by our team. Always visit in person before committing.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ReportModal 
        open={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        propertyId={String(listing.id)}
        propertyName={listing.propertyName}
      />
      <TourScheduleModal
        open={showTourModal}
        onClose={() => setShowTourModal(false)}
        propertyId={String(listing.id)}
        propertyName={listing.propertyName}
        tenantName={user.name}
        tenantEmail={user.email}
      />
    </Layout>
  );
}
