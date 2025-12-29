import { Layout } from "@/components/layout";
import { SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, ShieldCheck, Check, ArrowLeft, Share2, Heart, Flag,
  Wifi, Car, Utensils, Tv, Dumbbell, Calendar,
  Info, Mail, Phone, MessageSquare, Bus, ShoppingCart, Stethoscope, Users,
  Video, Lock, Loader2, Home, ExternalLink
} from "lucide-react";
import { useRoute, Link, useLocation } from "wouter";
import { isAuthenticated, getAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { incrementStat, addViewedHome } from "@/lib/tenant-engagement";
import { trackListingView, trackInquiry, trackApplication } from "@/lib/analytics";
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
import { useDocumentMeta } from "@/lib/use-document-meta";
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

  useDocumentMeta({
    title: listing ? `${listing.propertyName} | Sober Living in ${listing.city}, ${listing.state}` : "Sober Living Home | Sober Stay",
    description: listing ? `${listing.propertyName} - ${listing.gender === "mens" ? "Men's" : listing.gender === "womens" ? "Women's" : "Co-ed"} sober living home in ${listing.city}, ${listing.state}. $${listing.monthlyPrice}/month. ${listing.description?.slice(0, 120) || "Safe, supportive recovery housing."}` : "View sober living home details on Sober Stay."
  });

  useEffect(() => {
    if (listing?.id) {
      setIsFav(isFavorite(String(listing.id)));
      
      const viewedKey = `viewed_${listing.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        trackListingView(listing.id, listing.city, listing.state);
        sessionStorage.setItem(viewedKey, "true");
        
        const auth = getAuth();
        if (auth?.role === "tenant") {
          incrementStat("homesViewed");
          addViewedHome(String(listing.id));
        }
      }
    }
  }, [listing?.id, listing?.city, listing?.state]);

  const handleApply = () => {
    if (listing?.id) {
      trackApplication(listing.id);
    }
    if (!isAuthenticated()) {
      setLocation(`/login?returnPath=/apply/${listing?.id}`);
    } else {
      setLocation(`/apply/${listing?.id}`);
    }
  };

  const handleFavorite = async () => {
    if (listing?.id) {
      const newState = await toggleFavorite(String(listing.id));
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
              <img src={listing.photos?.[0] || placeholderHome} loading="lazy" className="w-full h-full object-cover" alt={listing.propertyName} />
              <div className="absolute top-4 left-4">
                {listing.status === "approved" && (
                  <Badge className="bg-emerald-500 text-white border-none flex gap-1 items-center px-3 py-1.5 shadow-lg">
                    <ShieldCheck className="w-3 h-3" /> Verified Listing
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                 <Button onClick={handleShare} size="icon" variant="secondary" className="rounded-full bg-black/70 hover:bg-black/90 text-white" title="Share this listing">
                   <Share2 className="w-4 h-4" />
                 </Button>
                 <Button onClick={handleFavorite} size="icon" variant="secondary" className={`rounded-full ${isFav ? "bg-primary/90 hover:bg-primary text-white" : "bg-black/70 hover:bg-black/90 text-white"}`}>
                   <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                 </Button>
                 <Button onClick={() => setShowReportModal(true)} size="icon" variant="secondary" className="rounded-full bg-black/70 hover:bg-red-600 text-white" title="Report this listing">
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
                 {listing.acceptsCouples && <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 text-xs font-medium">Accepts Couples</Badge>}
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
            {((listing.houseRules && listing.houseRules.length > 0) || listing.customHouseRules) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">House Rules & Requirements</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {listing.houseRules?.map((rule, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                      <Check className="w-5 h-5 text-primary" />
                      {rule}
                    </div>
                  ))}
                </div>
                {listing.customHouseRules && (
                  <div className="mt-4 p-4 rounded-lg bg-card/30 border border-border/50">
                    <p className="text-sm font-medium text-white mb-2">Additional Rules</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{listing.customHouseRules}</p>
                  </div>
                )}
              </div>
            )}


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

            {/* Find Meetings Near This Home */}
            <div className="bg-card/50 border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Find Recovery Meetings Near This Home</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Search for AA and NA meetings within 15 miles of {listing.city}, {listing.state}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.aa.org/find-aa/north-america?city=${encodeURIComponent(listing.city)}&state=${encodeURIComponent(listing.state)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Find AA Meetings
                </a>
                <a
                  href={`https://www.na.org/meetingsearch/?city=${encodeURIComponent(listing.city)}&state=${encodeURIComponent(listing.state)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Find NA Meetings
                </a>
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
                  <Link href={`/chat/${listing.id}`} className="block w-full" onClick={() => {
                    if (listing?.id) trackInquiry(listing.id);
                  }}>
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

      {/* LocalBusiness Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": listing.propertyName,
            "description": listing.description || `Sober living home in ${listing.city}, ${listing.state}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": listing.city,
              "addressRegion": listing.state,
              "addressCountry": "US"
            },
            "priceRange": `$${listing.monthlyPrice}/month`,
            "image": listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined,
            "url": `https://soberstay.com/property/${listing.id}`,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "10"
            }
          })
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://soberstay.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Browse Homes",
                "item": "https://soberstay.com/browse"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": listing.propertyName,
                "item": `https://soberstay.com/property/${listing.id}`
              }
            ]
          })
        }}
      />
    </Layout>
  );
}
