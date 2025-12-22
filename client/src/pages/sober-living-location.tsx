import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { MapPin, Search, Home, ArrowRight, Building, Users, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";
import { getLocationBySlug, US_STATES, US_CITIES, getCitiesByState, type LocationInfo } from "@shared/locationData";
import { useDocumentMeta } from "@/lib/use-document-meta";
import placeholderHome from "@assets/stock_images/modern_comfortable_l_a00ffa5e.jpg";

async function fetchListings(): Promise<Listing[]> {
  const response = await fetch("/api/listings");
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  return response.json();
}

function ListingCard({ listing }: { listing: Listing }) {
  const images = (listing as any).images as string[] | undefined;
  const imageUrl = images && images.length > 0 ? images[0] : placeholderHome;
  
  return (
    <Link href={`/property/${listing.id}`}>
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer" data-testid={`listing-card-${listing.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={listing.propertyName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              ${listing.monthlyPrice}/mo
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {listing.propertyName}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" />
            {listing.city}, {listing.state}
          </p>
          <div className="flex flex-wrap gap-1">
            {listing.gender && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{listing.gender}</span>
            )}
            {listing.roomType && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{listing.roomType}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ComingSoonSection({ locationName }: { locationName: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
        <Building className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Coming Soon to {locationName}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          We're actively expanding our network of verified sober living homes in {locationName}. 
          Be the first to list your property or sign up to be notified when homes become available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-listing">
            <Button className="w-full sm:w-auto" data-testid="button-list-property">
              <Home className="w-4 h-4 mr-2" />
              List Your Property
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="outline" className="w-full sm:w-auto" data-testid="button-browse-all">
              <Search className="w-4 h-4 mr-2" />
              Browse All Locations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LocationNotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Location Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find sober living information for this location.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Browse All Listings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export function SoberLivingLocation() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  
  const location = getLocationBySlug(slug);
  
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
  });
  
  useDocumentMeta({
    title: location?.metaTitle || "Sober Living Homes | Sober Stay",
    description: location?.metaDescription || "Find verified sober living homes near you."
  });
  
  if (!location) {
    return <LocationNotFound />;
  }
  
  const filteredListings = listings.filter((listing) => {
    if (location.type === "state") {
      return listing.state?.toLowerCase() === location.name.toLowerCase() ||
             listing.state?.toUpperCase() === location.stateCode;
    } else {
      const cityMatch = listing.city?.toLowerCase().replace(/\s+/g, "-") === slug ||
                        listing.city?.toLowerCase() === location.name.toLowerCase();
      const stateMatch = listing.state?.toUpperCase() === location.stateCode;
      return cityMatch && stateMatch;
    }
  });
  
  const relatedCities = location.type === "state" && location.stateCode 
    ? getCitiesByState(location.stateCode)
    : [];
  
  const parentState = location.type === "city" && location.stateCode
    ? US_STATES.find(s => s.stateCode === location.stateCode)
    : null;
  
  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-16 pb-12 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/browse" className="hover:text-primary transition-colors">Sober Living</Link>
              <span>/</span>
              {location.type === "city" && parentState && (
                <>
                  <Link href={`/sober-living/${parentState.slug}`} className="hover:text-primary transition-colors">
                    {parentState.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-primary">{location.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="location-h1">
              Sober Living Homes in {location.name}
              {location.type === "city" && location.stateCode && (
                <span className="text-primary">, {location.stateCode}</span>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {location.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/browse">
                <Button size="lg" data-testid="button-search-listings">
                  <Search className="w-4 h-4 mr-2" />
                  Search {location.name} Listings
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button size="lg" variant="outline" data-testid="button-list-home">
                  <Home className="w-4 h-4 mr-2" />
                  List Your Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {filteredListings.length > 0 
              ? `Sober Living Homes in ${location.name}` 
              : `Recovery Housing in ${location.name}`}
          </h2>
          <p className="text-muted-foreground">
            {filteredListings.length > 0 
              ? `Browse ${filteredListings.length} verified sober living ${filteredListings.length === 1 ? 'home' : 'homes'} in ${location.name}.`
              : `We're expanding our network in ${location.name}. Providers can apply to list their homes.`}
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-border animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-5 bg-muted rounded mb-2 w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <ComingSoonSection locationName={location.name} />
        )}
      </div>
      
      {relatedCities.length > 0 && (
        <div className="bg-card/50 border-t border-border py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Cities in {location.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedCities.map((city) => (
                <Link key={city.slug} href={`/sober-living/${city.slug}`}>
                  <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-white group-hover:text-primary transition-colors">
                        {city.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {location.type === "city" && parentState && (
        <div className="bg-card/50 border-t border-border py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              More Sober Living in {parentState.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getCitiesByState(parentState.stateCode || "").filter(c => c.slug !== slug).map((city) => (
                <Link key={city.slug} href={`/sober-living/${city.slug}`}>
                  <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-white group-hover:text-primary transition-colors">
                        {city.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href={`/sober-living/${parentState.slug}`}>
                <Button variant="outline">
                  View All {parentState.name} Locations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-primary/5 border-t border-primary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Why Choose Sober Stay for {location.name} Recovery Housing?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Verified Providers</h3>
                <p className="text-sm text-muted-foreground">
                  All listings are from verified sober living operators committed to quality recovery housing.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Easy Search</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by location, price, gender, and amenities to find the perfect recovery home.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Direct Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connect directly with providers and apply online for streamlined intake.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/10 border-t border-primary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Are You a Sober Living Provider in {location.name}?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            List your recovery housing on Sober Stay to connect with individuals seeking quality sober living in {location.name}. 
            Join our nationwide directory of verified providers.
          </p>
          <Link href="/create-listing">
            <Button size="lg" data-testid="button-provider-apply">
              List Your Home on Sober Stay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default SoberLivingLocation;
