import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Search, Building, Users, Heart, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { getAllCities, type CityData } from "../../../shared/cityData";

interface StateInfo {
  name: string;
  slug: string;
  abbreviation: string;
  cities: string[];
}

const STATES: StateInfo[] = [
  {
    name: "California",
    slug: "california",
    abbreviation: "CA",
    cities: ["los-angeles", "san-diego", "orange-county"]
  },
  {
    name: "Florida",
    slug: "florida",
    abbreviation: "FL",
    cities: ["miami", "delray-beach", "tampa"]
  },
  {
    name: "Texas",
    slug: "texas",
    abbreviation: "TX",
    cities: ["austin", "dallas", "houston"]
  },
  {
    name: "Arizona",
    slug: "arizona",
    abbreviation: "AZ",
    cities: ["phoenix", "scottsdale", "tucson"]
  },
  {
    name: "Colorado",
    slug: "colorado",
    abbreviation: "CO",
    cities: ["denver", "boulder", "colorado-springs"]
  }
];

const POPULAR_CITIES = [
  { name: "Los Angeles", state: "CA", slug: "los-angeles" },
  { name: "San Diego", state: "CA", slug: "san-diego" },
  { name: "Phoenix", state: "AZ", slug: "phoenix" },
  { name: "Miami", state: "FL", slug: "miami" },
  { name: "Delray Beach", state: "FL", slug: "delray-beach" },
  { name: "Denver", state: "CO", slug: "denver" },
  { name: "Austin", state: "TX", slug: "austin" }
];

export function FindSoberLiving() {
  useDocumentMeta({
    title: "Find Sober Living Homes | Sober Stay",
    description: "Find sober living homes across the United States. Sober Stay helps individuals and families explore safe, supportive recovery housing options."
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Find Sober Living Homes
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore safe, supportive recovery housing options across the United States
              </p>
              <Link href="/browse">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full" data-testid="button-browse-all">
                  <Search className="w-5 h-5 mr-2" /> Browse All Listings
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Finding the right sober living home is an important step in recovery. 
                Sober Stay helps individuals and families find safe, supportive sober 
                living homes across the United States. Our directory makes it easier to 
                explore recovery housing options, compare locations, and take the next 
                step toward a stable, substance-free living environment.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you are transitioning from treatment, seeking structure and 
                accountability, or helping a loved one find sober housing, Sober Stay 
                provides a centralized place to begin your search.
              </p>
            </div>
          </div>
        </section>

        {/* Browse by State */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Browse Sober Living by State</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATES.map((state) => (
                  <Link key={state.slug} href={`/sober-living/${state.slug}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full" data-testid={`state-card-${state.slug}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                              Sober Living in {state.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{state.abbreviation}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>View homes in {state.name}</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Popular Cities for Sober Living</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_CITIES.map((city) => (
                  <Link key={city.slug} href={`/sober-living-homes/${city.slug}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group" data-testid={`city-link-${city.slug}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-white font-medium group-hover:text-primary transition-colors">
                              Sober Living in {city.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{city.state}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How Sober Stay Helps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">How Sober Stay Helps</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Building className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Centralized Directory</h3>
                        <p className="text-muted-foreground">Browse sober living homes from across the country in one place.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Support for Everyone</h3>
                        <p className="text-muted-foreground">Resources for individuals, families, and treatment center referrals.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Clear Information</h3>
                        <p className="text-muted-foreground">Honest, straightforward details to support informed decisions.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Nationwide Options</h3>
                        <p className="text-muted-foreground">Recovery housing options across multiple states and cities.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Sober Stay is designed to support recovery by making sober living options 
                easier to find and understand. We focus on clarity, accessibility, and 
                trust during an important transition.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Explore sober living homes by location and take the next step toward a 
                supportive recovery environment.
              </p>
              <Link href="/browse">
                <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-explore">
                  <Search className="w-5 h-5 mr-2" />
                  Explore All Sober Living Homes
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
