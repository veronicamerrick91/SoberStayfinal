import { Layout } from "@/components/layout";
import { SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, ShieldCheck, Filter, LayoutGrid, List,
  HelpCircle, Map, Home, Loader2, Zap
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import type { Listing, FeaturedListing } from "@shared/schema";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { isAuthenticated } from "@/lib/auth";
import { trackListingClick, trackApplication } from "@/lib/analytics";

import placeholderHome from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";

async function fetchListings(): Promise<Listing[]> {
  const response = await fetch("/api/listings");
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  return response.json();
}

async function fetchFeaturedListings(): Promise<FeaturedListing[]> {
  const response = await fetch("/api/featured-listings");
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export default function Browse() {
  const [priceRange, setPriceRange] = useState([2000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchLocation, setSearchLocation] = useState("");
  const [location, setLocation] = useLocation();
  
  // Filter state
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSupervision, setSelectedSupervision] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [showMatFriendly, setShowMatFriendly] = useState(false);
  const [showAcceptsCouples, setShowAcceptsCouples] = useState(false);
  
  const handleApply = (e: React.MouseEvent, listingId: number) => {
    e.preventDefault();
    e.stopPropagation();
    trackApplication(listingId);
    if (isAuthenticated()) {
      setLocation(`/apply/${listingId}`);
    } else {
      setLocation(`/login?returnPath=/apply/${listingId}`);
    }
  };

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });

  const { data: featuredListings = [] } = useQuery({
    queryKey: ["featuredListings"],
    queryFn: fetchFeaturedListings,
  });

  // Pre-compute featured listings map once for O(1) lookups
  const featuredMap = useMemo(() => {
    const now = Date.now();
    const map: Record<number, { isFeatured: boolean; boostLevel: number }> = {};
    for (const f of featuredListings) {
      if (f.isActive && new Date(f.endDate).getTime() > now) {
        map[f.listingId] = { isFeatured: true, boostLevel: f.boostLevel || 0 };
      }
    }
    return map;
  }, [featuredListings]);

  const isListingFeatured = (listingId: number) => {
    return featuredMap[listingId]?.isFeatured || false;
  };

  const getListingBoostLevel = (listingId: number) => {
    return featuredMap[listingId]?.boostLevel || 0;
  };

  useDocumentMeta({
    title: "Browse Sober Living Homes | Sober Stay",
    description: "Search sober living homes across the US. Filter by location, price, amenities, and more. Find your recovery housing today."
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setSearchLocation(decodeURIComponent(search));
    }
  }, [location]);

  const filteredListings = useMemo(() => {
    const searchLower = searchLocation.toLowerCase();
    
    return listings.filter((listing) => {
      // Location search filter
      if (searchLocation) {
        const matchesSearch = (
          listing.city.toLowerCase().includes(searchLower) ||
          listing.state.toLowerCase().includes(searchLower) ||
          listing.propertyName.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      
      // Price filter
      if (listing.monthlyPrice > priceRange[0]) return false;
      
      // Gender filter
      if (selectedGenders.length > 0 && !selectedGenders.includes(listing.gender || "")) return false;
      
      // Supervision filter
      if (selectedSupervision.length > 0 && !selectedSupervision.includes(listing.supervisionType || "")) return false;
      
      // Room type filter
      if (selectedRoomTypes.length > 0 && !selectedRoomTypes.includes(listing.roomType || "")) return false;
      
      // MAT friendly filter
      if (showMatFriendly && !listing.isMatFriendly) return false;
      
      // Accepts couples filter
      if (showAcceptsCouples && !listing.acceptsCouples) return false;
      
      return true;
    }).sort((a, b) => {
      const aBoost = featuredMap[a.id]?.boostLevel || 0;
      const bBoost = featuredMap[b.id]?.boostLevel || 0;
      return bBoost - aBoost;
    });
  }, [listings, searchLocation, priceRange, selectedGenders, selectedSupervision, selectedRoomTypes, showMatFriendly, showAcceptsCouples, featuredMap]);
  
  const toggleFilter = (value: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };
  
  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Browse Sober Homes</h1>
          <p className="text-muted-foreground">Find safe, supportive recovery housing that fits your needs.</p>
        </div>
      </div>

      {/* Featured Homes Section */}
      {(() => {
        const activeFeaturedIds = new Set(
          featuredListings
            .filter(f => f.isActive && new Date(f.endDate).getTime() > Date.now())
            .map(f => f.listingId)
        );
        const featuredHomesList = listings.filter(l => activeFeaturedIds.has(l.id));
        
        if (featuredHomesList.length === 0) return null;
        
        return (
          <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-purple-900/20 border-y border-purple-500/20 py-6">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Featured Homes</h2>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none text-xs">
                  {featuredHomesList.length} Available
                </Badge>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                {featuredHomesList.map((listing) => (
                  <Link key={listing.id} href={`/property/${listing.id}`} onClick={() => trackListingClick(listing.id)}>
                    <Card className="w-64 shrink-0 overflow-hidden bg-card border-purple-500/30 hover:border-purple-400 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer" data-testid={`card-featured-browse-${listing.id}`}>
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={listing.photos?.[0] || placeholderHome} 
                          alt={listing.propertyName}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg flex gap-1 items-center text-xs">
                            <Zap className="w-3 h-3" /> Featured
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 text-sm font-bold text-white drop-shadow-md">
                          ${listing.monthlyPrice}<span className="text-xs font-normal text-gray-200">/mo</span>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-bold text-sm text-white line-clamp-1">{listing.propertyName}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1 text-purple-400" />
                          {listing.city}, {listing.state}
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="secondary" className="bg-secondary/60 text-xs py-0 px-2">{listing.gender}</Badge>
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs py-0 px-2">{listing.roomType}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-8 shrink-0">
          {/* Mobile Search (visible on all) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="City, zip, or name" 
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-9 bg-card border-border"
              data-testid="input-search-location"
            />
          </div>

          {/* Filter Groups */}
          <div className="space-y-6 bg-card/50 p-4 rounded-xl border border-border">
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              
              <div className="space-y-6">
                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold">Gender</Label>
                  <div className="space-y-2">
                    {["Men Only", "Women Only", "Co-ed"].map((g) => (
                      <div key={g} className="flex items-center space-x-2">
                        <Checkbox 
                          id={g} 
                          className="h-4 w-4"
                          checked={selectedGenders.includes(g)}
                          onCheckedChange={() => toggleFilter(g, selectedGenders, setSelectedGenders)}
                        />
                        <Label htmlFor={g} className="font-normal text-muted-foreground cursor-pointer">{g}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supervision Type */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Label className="text-white font-semibold">Supervision</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-1 hover:bg-primary/10 rounded transition-colors">
                          <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-border max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Supervision Types Explained</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {Object.entries(SUPERVISION_DEFINITIONS).map(([type, def]) => (
                            <div key={type} className="border-b border-border pb-3 last:border-0">
                              <div className="font-bold text-primary text-sm">{type}</div>
                              <div className="text-xs text-muted-foreground leading-relaxed mt-1">{def}</div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {Object.keys(SUPERVISION_DEFINITIONS).map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type} 
                          className="h-4 w-4"
                          checked={selectedSupervision.includes(type)}
                          onCheckedChange={() => toggleFilter(type, selectedSupervision, setSelectedSupervision)}
                        />
                        <Label htmlFor={type} className="font-normal text-muted-foreground cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label className="text-white font-semibold">Room Type</Label>
                  <div className="space-y-2">
                    {["Private Room", "Shared Room"].map((roomType) => (
                      <div key={roomType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={roomType} 
                          className="h-4 w-4"
                          checked={selectedRoomTypes.includes(roomType)}
                          onCheckedChange={() => toggleFilter(roomType, selectedRoomTypes, setSelectedRoomTypes)}
                        />
                        <Label htmlFor={roomType} className="font-normal text-muted-foreground cursor-pointer">{roomType}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label className="text-white font-semibold">Features & Support</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" className="h-4 w-4" />
                      <Label htmlFor="verified" className="font-normal text-muted-foreground">Verified Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mat" 
                        className="h-4 w-4"
                        checked={showMatFriendly}
                        onCheckedChange={(checked) => setShowMatFriendly(!!checked)}
                      />
                      <Label htmlFor="mat" className="font-normal text-muted-foreground cursor-pointer">MAT Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="couples" 
                        className="h-4 w-4"
                        checked={showAcceptsCouples}
                        onCheckedChange={(checked) => setShowAcceptsCouples(!!checked)}
                      />
                      <Label htmlFor="couples" className="font-normal text-muted-foreground cursor-pointer">Accepts Couples</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lgbtq" className="h-4 w-4" />
                      <Label htmlFor="lgbtq" className="font-normal text-muted-foreground cursor-pointer">LGBTQ Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="faith" className="h-4 w-4" />
                      <Label htmlFor="faith" className="font-normal text-muted-foreground">Faith Based</Label>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <Label className="text-white font-semibold">Max Price (Monthly)</Label>
                    <span className="text-sm text-primary font-bold">${priceRange[0]}</span>
                  </div>
                  <Slider 
                    defaultValue={[2000]} 
                    max={5000} 
                    step={100} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                "Loading..."
              ) : (
                <>Showing <span className="text-foreground font-bold">{filteredListings.length}</span> homes</>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
                data-testid="button-view-grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 ${viewMode === "list" ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">Failed to load listings. Please try again.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredListings.length === 0 && (
            <div className="text-center py-20 bg-card/30 rounded-xl border border-border">
              <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Listings Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchLocation 
                  ? `No sober homes found matching "${searchLocation}". Try adjusting your search.`
                  : "There are currently no approved sober homes listed. Check back soon as providers add their properties."
                }
              </p>
              {searchLocation && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchLocation("")}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {viewMode === "grid" && !isLoading && !error && filteredListings.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link key={listing.id} href={`/property/${listing.id}`} onClick={() => trackListingClick(listing.id)}>
                  <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer h-full flex flex-col" data-testid={`card-listing-${listing.id}`}>
                    <div className="relative h-40 overflow-hidden shrink-0">
                      <img 
                        src={listing.photos?.[0] || placeholderHome} 
                        alt={listing.propertyName}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-2 left-2 flex gap-1">
                        {isListingFeatured(listing.id) && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg flex gap-1 items-center text-xs">
                            <Zap className="w-3 h-3" /> Featured
                          </Badge>
                        )}
                        {listing.status === "approved" && (
                          <Badge className="bg-primary text-white border-none shadow-lg flex gap-1 items-center text-xs">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <div className="text-sm font-bold text-white drop-shadow-md">
                          ${listing.monthlyPrice}<span className="text-xs font-normal text-gray-200">/month</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3 space-y-2 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">{listing.propertyName}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1 text-primary" />
                          {listing.city}, {listing.state}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-secondary/60 text-xs py-0 px-2">{listing.gender}</Badge>
                          <Badge variant="outline" className="border-primary/30 text-primary text-xs py-0 px-2">{listing.roomType}</Badge>
                          {listing.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary text-xs py-0 px-2">MAT</Badge>}
                          {listing.acceptsCouples && <Badge variant="outline" className="border-rose-500/30 text-rose-300 text-xs py-0 px-2">Couples</Badge>}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border/50 flex gap-1 mt-auto">
                        <Button size="sm" className="flex-1 h-7 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 h-7 border-primary/20 text-primary hover:bg-primary/10 text-xs"
                          onClick={(e) => handleApply(e, listing.id)}
                        >
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {viewMode === "list" && !isLoading && !error && filteredListings.length > 0 && (
            <div className="space-y-3">
              {filteredListings.map((listing) => (
                <Link key={listing.id} href={`/property/${listing.id}`} onClick={() => trackListingClick(listing.id)}>
                  <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer" data-testid={`card-listing-list-${listing.id}`}>
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={listing.photos?.[0] || placeholderHome} 
                          alt={listing.propertyName}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {isListingFeatured(listing.id) && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg flex gap-1 items-center text-xs">
                              <Zap className="w-3 h-3" /> Featured
                            </Badge>
                          )}
                          {listing.status === "approved" && (
                            <Badge className="bg-primary text-white border-none shadow-lg flex gap-1 items-center text-xs">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="font-bold text-sm text-white group-hover:text-primary transition-colors line-clamp-1">{listing.propertyName}</h3>
                            <div className="text-sm font-bold text-primary shrink-0">
                              ${listing.monthlyPrice}<span className="text-xs font-normal text-gray-300">/month</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            {listing.address}, {listing.city}, {listing.state}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {listing.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-secondary/60">{listing.gender}</Badge>
                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">{listing.roomType}</Badge>
                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">{listing.supervisionType}</Badge>
                            {listing.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary">MAT Friendly</Badge>}
                            {listing.acceptsCouples && <Badge variant="outline" className="border-rose-500/30 text-rose-300">Accepts Couples</Badge>}
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {listing.totalBeds} Beds
                            </Badge>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/50 flex gap-2 mt-auto">
                          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-primary/20 text-primary hover:bg-primary/10"
                            onClick={(e) => handleApply(e, listing.id)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
