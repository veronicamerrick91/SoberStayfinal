import { Layout } from "@/components/layout";
import { MOCK_PROPERTIES, SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, ShieldCheck, Check, ArrowLeft, Share2, Heart, Flag,
  Wifi, Car, Utensils, Tv, Dumbbell, Calendar,
  Info, Mail, Phone, MessageSquare, Bus, ShoppingCart, Stethoscope, Users
} from "lucide-react";
import { useRoute, Link, useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { ReportModal } from "@/components/report-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mapPlaceholder from "@assets/generated_images/map_view_of_a_neighborhood_with_location_pin.png";

export default function PropertyDetails() {
  const [match, params] = useRoute("/property/:id");
  const [location, setLocation] = useLocation();
  const [isFav, setIsFav] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const property = MOCK_PROPERTIES.find(p => p.id === params?.id);

  useEffect(() => {
    if (property?.id) {
      setIsFav(isFavorite(property.id));
    }
  }, [property?.id]);

  const handleApply = () => {
    if (!isAuthenticated()) {
      setLocation(`/login?returnPath=/apply/${property?.id}`);
    } else {
      setLocation(`/apply/${property?.id}`);
    }
  };

  const handleFavorite = () => {
    if (property?.id) {
      const newState = toggleFavorite(property.id);
      setIsFav(newState);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/property/${property?.id}`;
    const shareText = `Check out ${property?.name} on Sober Stay - A safe, supportive sober living home in ${property?.city}, ${property?.state}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      // Show feedback
      alert("Link copied to clipboard!");
    }
  };

  if (!property) return <Layout><div>Property not found</div></Layout>;

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
              <img src={property.image} className="w-full h-full object-cover" alt={property.name} />
              <div className="absolute top-4 left-4">
                {property.isVerified && (
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
                <h1 className="text-4xl font-bold text-white">{property.name}</h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${property.price}</div>
                  <div className="text-sm text-muted-foreground">per {property.pricePeriod}</div>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {property.address}, {property.city}, {property.state}
              </div>

              <div className="flex flex-wrap gap-3">
                 <Badge variant="secondary" className="text-sm px-3 py-1">{property.gender} Only</Badge>
                 <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30 text-primary">{property.roomType}</Badge>
                 <Badge variant={property.bedsAvailable > 0 ? "default" : "destructive"} className="text-sm px-3 py-1">
                   {property.bedsAvailable > 0 ? `${property.bedsAvailable} Beds Available` : "Waitlist Only"}
                 </Badge>
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30 text-primary cursor-help flex items-center gap-1 hover:bg-primary/10 transition-colors">
                          {property.supervisionType} <Info className="w-3 h-3" />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{SUPERVISION_DEFINITIONS[property.supervisionType]}</p>
                      </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card/50 border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">About this Home</h3>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
                <br/><br/>
                At {property.name}, we believe in creating a safe, structured environment that fosters long-term recovery. Our residents support one another through shared experience and accountability.
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Amenities & Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300 p-3 rounded-lg bg-card/30 border border-border/50">
                    <Check className="w-5 h-5 text-primary" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Amenities */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Nearby Services & Support</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {property.nearbyAmenities.map((amenity, idx) => {
                  const getCategoryIcon = (category: string) => {
                    switch(category) {
                      case "Transportation": return <Bus className="w-5 h-5" />;
                      case "Food": return <Utensils className="w-5 h-5" />;
                      case "Groceries": return <ShoppingCart className="w-5 h-5" />;
                      case "Therapy/IOP": return <Stethoscope className="w-5 h-5" />;
                      case "Recovery Meetings": return <Users className="w-5 h-5" />;
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
            
            {/* Map Location */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Location</h3>
              <div className="rounded-xl overflow-hidden border border-border/50 relative h-[300px]">
                <img src={mapPlaceholder} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="Map location" />
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur p-3 rounded-lg border border-white/10 shadow-xl max-w-xs">
                  <div className="font-bold text-white text-sm">{property.address}</div>
                  <div className="text-xs text-muted-foreground">{property.city}, {property.state}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Application Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-card border-border shadow-2xl overflow-hidden">
                <div className="h-2 w-full bg-primary" />
                <CardContent className="p-6 space-y-6">
                   <div>
                     <h3 className="font-bold text-xl text-white mb-2">Interested in this home?</h3>
                     <p className="text-sm text-muted-foreground">Submit a secure application directly to the provider. It takes less than 5 minutes.</p>
                   </div>

                   <div className="space-y-3 pt-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Security Deposit</span>
                       <span className="text-white font-medium">$200</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Min. Stay</span>
                       <span className="text-white font-medium">30 Days</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Insurance</span>
                       <span className="text-white font-medium">{property.acceptsInsurance ? "Accepted" : "Not Accepted"}</span>
                     </div>
                   </div>

                   <div className="space-y-3 pt-4">
                     <Button onClick={handleApply} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg shadow-lg shadow-primary/20">
                       Apply Now
                     </Button>
                     
                     {/* Contact Options */}
                     <div className="pt-2 space-y-2 border-t border-border">
                       <p className="text-xs text-muted-foreground font-semibold">Connect with Provider</p>
                       <div className="grid grid-cols-3 gap-2">
                         <Button 
                           onClick={() => window.location.href = "tel:+1234567890"}
                           variant="outline" 
                           className="border-border hover:bg-white/5 gap-2 h-10"
                         >
                           <Phone className="w-4 h-4" />
                           <span className="hidden sm:inline text-xs">Call</span>
                         </Button>
                         <Button 
                           onClick={() => window.location.href = `mailto:provider@sobestay.com?subject=Inquiry about ${property.name}`}
                           variant="outline" 
                           className="border-border hover:bg-white/5 gap-2 h-10"
                         >
                           <Mail className="w-4 h-4" />
                           <span className="hidden sm:inline text-xs">Email</span>
                         </Button>
                         <Button 
                           onClick={() => setLocation(`/chat/${property.id}`)}
                           className="bg-primary/20 text-primary hover:bg-primary/30 gap-2 h-10 border border-primary/50"
                         >
                           <MessageSquare className="w-4 h-4" />
                           <span className="hidden sm:inline text-xs">Chat</span>
                         </Button>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-xs text-center text-muted-foreground pt-2">
                     <ShieldCheck className="w-3 h-3 inline mr-1" />
                     Your data is encrypted and secure.
                   </div>
                </CardContent>
              </Card>

              {/* Filters / Tags Summary */}
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 space-y-4">
                   <h4 className="font-bold text-white text-sm">Property Highlights</h4>
                   <div className="space-y-3">
                     {property.isMatFriendly && (
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                         <Check className="w-4 h-4 text-primary" /> MAT Friendly
                       </div>
                     )}
                     {property.isPetFriendly && (
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                         <Check className="w-4 h-4 text-primary" /> Pet Friendly
                       </div>
                     )}
                     {property.isLgbtqFriendly && (
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                         <Check className="w-4 h-4 text-primary" /> LGBTQ+ Friendly
                       </div>
                     )}
                     {property.isFaithBased && (
                       <div className="flex items-center gap-2 text-sm text-gray-300">
                         <Check className="w-4 h-4 text-primary" /> Faith Based
                       </div>
                     )}
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <ReportModal 
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
          propertyId={property?.id || ""}
          propertyName={property?.name || ""}
          userName={isAuthenticated() ? "Current User" : "Anonymous"}
        />
      </div>
    </Layout>
  );
}
