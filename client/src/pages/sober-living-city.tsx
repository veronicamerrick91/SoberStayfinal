import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { MapPin, Search, Home, Users, Shield, Building, Heart, ChevronDown, ChevronUp, ArrowRight, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";
import { getCityData, getRelatedCities, type CityData, type CityHighlight, type CityFAQ } from "@shared/cityData";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { useState } from "react";
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

function CityNotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">City Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find sober living information for this city.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse">
            <Button data-testid="button-browse-all">
              <Search className="w-4 h-4 mr-2" />
              Browse All Listings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" data-testid="button-return-home">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export function SoberLivingCity() {
  const params = useParams<{ city: string }>();
  const citySlug = params.city || "";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const cityData = getCityData(citySlug);
  const relatedCities = cityData ? getRelatedCities(citySlug, cityData.stateCode) : [];
  
  useDocumentMeta({
    title: cityData?.metaTitle || `Sober Living in ${citySlug} | Sober Stay`,
    description: cityData?.metaDescription || `Find verified sober living homes in ${citySlug}. Browse recovery housing options and take the next step in your recovery journey.`
  });
  
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 1000 * 60 * 5,
  });
  
  if (!cityData) {
    return <CityNotFound />;
  }
  
  const cityListings = listings.filter(l => 
    l.city.toLowerCase() === cityData.name.toLowerCase() || 
    l.state.toLowerCase() === cityData.stateName.toLowerCase()
  ).slice(0, 6);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">{cityData.stateName}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sober Living Homes in {cityData.name}, {cityData.stateCode}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find recovery housing in {cityData.name} and take the next step in your sobriety journey
              </p>
              <Link href={`/browse?city=${encodeURIComponent(cityData.name)}&state=${encodeURIComponent(cityData.stateName)}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full" data-testid="button-find-homes">
                  <Search className="w-5 h-5 mr-2" /> Find Homes in {cityData.name}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Opening Paragraph - SEO Block */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {cityData.openingParagraph}
              </p>
            </div>
          </div>
        </section>

        {/* Why Sober Living in This City */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Sober Living in {cityData.name}?</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {cityData.whyThisCity}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {cityData.highlights.map((highlight: CityHighlight, i: number) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          {highlight.icon === "users" && <Users className="w-6 h-6 text-primary" />}
                          {highlight.icon === "building" && <Building className="w-6 h-6 text-primary" />}
                          {highlight.icon === "heart" && <Heart className="w-6 h-6 text-primary" />}
                          {highlight.icon === "shield" && <Shield className="w-6 h-6 text-primary" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{highlight.title}</h3>
                          <p className="text-muted-foreground">{highlight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How Sober Stay Helps */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">How Sober Stay Helps You Find Sober Living in {cityData.name}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sober Stay connects you with sober living homes in {cityData.name} through a simple, supportive process.
              </p>
              <ul className="space-y-4">
                {[
                  `Connect with sober living homes in ${cityData.name} and surrounding areas`,
                  "Browse a centralized recovery housing directory with verified listings",
                  "Filter by price, amenities, gender, and recovery support level",
                  "Support for individuals, families, and treatment center referrals",
                  "Clear next steps during your recovery transition",
                  "Direct contact with providers - no middlemen or hidden fees"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        {cityListings.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Available Sober Living Homes in {cityData.name}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cityListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href={`/browse?city=${encodeURIComponent(cityData.name)}&state=${encodeURIComponent(cityData.stateName)}`}>
                    <Button variant="outline" size="lg" data-testid="button-view-all">
                      View All Homes in {cityData.name} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Support for Individuals & Families */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Support for Individuals and Families</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Finding the right sober living home in {cityData.name} is a significant step in the recovery journey. 
                Whether you're transitioning from treatment, supporting a loved one, or seeking a fresh start, 
                we understand the importance of this decision. Our directory provides clear, honest information 
                to help you make an informed choice without pressure. Recovery is personal, and finding the right 
                supportive environment can make all the difference.
              </p>
            </div>
          </div>
        </section>

        {/* Provider Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">For Sober Living Providers in {cityData.name}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                If you operate a sober living home in {cityData.name}, listing on Sober Stay can help you reach 
                individuals and families actively searching for recovery housing in your area. Our platform 
                connects you with motivated residents who are committed to their recovery journey.
              </p>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Benefits of Listing Your Home</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Increased visibility to individuals searching for sober living in {cityData.name}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Direct inquiries from potential residents and referral sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Professional listing with photos, amenities, and detailed information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Analytics dashboard to track views and inquiries</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/for-providers">
                    <Button data-testid="button-list-home">
                      <Home className="w-4 h-4 mr-2" />
                      List Your Sober Living Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions About Sober Living in {cityData.name}</h2>
              <div className="space-y-4">
                {cityData.faqs.map((faq: CityFAQ, i: number) => (
                  <Card key={i} className="bg-card border-border">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-6 flex items-start justify-between text-left hover:bg-white/5 transition-colors"
                      data-testid={`faq-toggle-${i}`}
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                      {openFaq === i ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Soft CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Take the Next Step</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Explore sober living homes in {cityData.name}, {cityData.stateName} with Sober Stay and 
                take the next step toward a supportive recovery environment. Your journey matters, and 
                finding the right home can make all the difference.
              </p>
              <Link href={`/browse?city=${encodeURIComponent(cityData.name)}&state=${encodeURIComponent(cityData.stateName)}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-explore-homes">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Homes in {cityData.name}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-6">Explore More Locations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* State Link */}
                <Link href={`/sober-living/${cityData.stateSlug}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-white font-medium">Sober Living in {cityData.stateName}</p>
                        <p className="text-sm text-muted-foreground">View all homes statewide</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </CardContent>
                  </Card>
                </Link>
                
                {/* Related Cities */}
                {relatedCities.slice(0, 3).map((city: CityData) => (
                  <Link key={city.slug} href={`/sober-living-homes/${city.slug}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-white font-medium">Sober Living in {city.name}</p>
                          <p className="text-sm text-muted-foreground">{city.stateCode}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/browse">
                  <Button variant="link" className="text-primary" data-testid="link-view-all-locations">
                    View All Locations <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
