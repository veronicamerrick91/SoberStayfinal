import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { MapPin, Search, Shield, Users, Heart, CheckCircle, ChevronDown, ChevronUp, Home, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";

interface LocationData {
  slug: string;
  name: string;
  type: "city" | "state";
  state?: string;
  stateCode?: string;
  description: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

const locationData: Record<string, LocationData> = {
  "los-angeles": {
    slug: "los-angeles",
    name: "Los Angeles",
    type: "city",
    state: "California",
    stateCode: "CA",
    description: "Los Angeles is home to one of the largest recovery communities in the United States. With year-round sunshine, diverse neighborhoods, and extensive recovery resources, LA offers an ideal environment for those seeking sober living.",
    highlights: [
      "Year-round mild weather supports outdoor activities and wellness",
      "Hundreds of AA/NA meetings available daily across the city",
      "Strong employment opportunities in entertainment, tech, and service industries",
      "Beach communities offer therapeutic environments for recovery",
      "Diverse cultural communities provide inclusive recovery options"
    ],
    faqs: [
      { question: "How much does sober living cost in Los Angeles?", answer: "Sober living in Los Angeles typically ranges from $800 to $3,000+ per month depending on location and amenities. Beach communities like Malibu and Santa Monica tend to be more expensive, while areas like the Valley offer more affordable options." },
      { question: "What neighborhoods in LA have the most sober living homes?", answer: "Popular areas for sober living in Los Angeles include West Hollywood, Santa Monica, Venice, Pasadena, and the San Fernando Valley. Each neighborhood offers different vibes and price points to match various recovery needs." },
      { question: "Are there gender-specific sober living homes in Los Angeles?", answer: "Yes, Los Angeles has many gender-specific sober living options including men's-only, women's-only, and co-ed homes. Many also cater to specific communities like LGBTQ+ individuals or those in the entertainment industry." }
    ]
  },
  "san-diego": {
    slug: "san-diego",
    name: "San Diego",
    type: "city",
    state: "California",
    stateCode: "CA",
    description: "San Diego's laid-back atmosphere and beautiful beaches make it a popular destination for recovery. The city boasts a strong sober community with numerous meetings, activities, and support groups.",
    highlights: [
      "Perfect weather year-round for outdoor recovery activities",
      "Active sober surfing and beach volleyball communities",
      "Lower cost of living compared to Los Angeles",
      "Strong military veteran recovery community",
      "Easy access to nature and hiking trails"
    ],
    faqs: [
      { question: "What makes San Diego good for sober living?", answer: "San Diego offers a perfect blend of beach lifestyle, outdoor activities, and a supportive recovery community. The city has numerous 12-step meetings, sober social events, and wellness activities that support long-term recovery." },
      { question: "How do I find a sober living home in San Diego?", answer: "Use Sober Stay to search for verified sober living homes in San Diego. Filter by neighborhood, price, gender, and amenities to find the perfect fit. Popular areas include Pacific Beach, Ocean Beach, and North County." },
      { question: "Are there affordable sober living options in San Diego?", answer: "Yes, San Diego has sober living options ranging from $600 to $2,500+ per month. More affordable options are typically found in East County and North County areas, while beach communities tend to be pricier." }
    ]
  },
  "florida": {
    slug: "florida",
    name: "Florida",
    type: "state",
    stateCode: "FL",
    description: "Florida has earned the nickname 'Recovery Capital of America' due to its extensive network of treatment centers and sober living homes. From South Florida to the Tampa Bay area, the state offers diverse recovery options.",
    highlights: [
      "Largest concentration of treatment centers and sober living homes in the US",
      "Year-round warm weather supports outdoor recovery activities",
      "Strong insurance coverage for treatment in many areas",
      "Diverse recovery communities from luxury to affordable options",
      "Beautiful beaches and natural environments for healing"
    ],
    faqs: [
      { question: "Why is Florida popular for sober living?", answer: "Florida became a hub for recovery due to favorable insurance laws, warm weather, and a concentration of treatment centers. Cities like Delray Beach, Fort Lauderdale, and West Palm Beach have thriving recovery communities." },
      { question: "What cities in Florida have the most sober living homes?", answer: "The most popular areas for sober living in Florida include Delray Beach, Boca Raton, Fort Lauderdale, West Palm Beach, Tampa, and Jacksonville. South Florida has the highest concentration of recovery housing." },
      { question: "How much does sober living cost in Florida?", answer: "Florida sober living costs range from $500 to $2,500+ per month. South Florida tends to be more expensive, while Central and North Florida offer more affordable options with similar quality." }
    ]
  },
  "texas": {
    slug: "texas",
    name: "Texas",
    type: "state",
    stateCode: "TX",
    description: "Texas offers a growing network of sober living homes across its major cities. With a lower cost of living than coastal states and strong community values, Texas provides excellent recovery opportunities.",
    highlights: [
      "Lower cost of living compared to California or Florida",
      "Strong faith-based recovery communities",
      "Growing job market with diverse opportunities",
      "Large metropolitan areas with extensive recovery resources",
      "Welcoming community atmosphere"
    ],
    faqs: [
      { question: "What cities in Texas have sober living homes?", answer: "Major Texas cities with sober living options include Houston, Dallas, Austin, San Antonio, and Fort Worth. Each city has its own recovery community with meetings, support groups, and sober activities." },
      { question: "Is sober living affordable in Texas?", answer: "Yes, Texas offers some of the most affordable sober living in the country. Monthly costs typically range from $500 to $1,800, significantly less than coastal states while maintaining quality standards." },
      { question: "Are there faith-based sober living homes in Texas?", answer: "Yes, Texas has many faith-based recovery options. Many sober living homes incorporate spiritual principles, church attendance, and Bible studies as part of their programs." }
    ]
  },
  "arizona": {
    slug: "arizona",
    name: "Arizona",
    type: "state",
    stateCode: "AZ",
    description: "Arizona has become a premier destination for recovery, particularly the Phoenix and Scottsdale areas. The desert landscape and wellness-focused culture create an ideal environment for healing.",
    highlights: [
      "World-renowned treatment centers and recovery programs",
      "Desert landscape offers peaceful environment for healing",
      "Strong holistic and wellness recovery communities",
      "Year-round outdoor activities including hiking and yoga",
      "Growing network of transitional housing options"
    ],
    faqs: [
      { question: "Why choose Arizona for sober living?", answer: "Arizona offers a unique combination of world-class treatment facilities, beautiful desert scenery, and a wellness-focused culture. The Phoenix area in particular has developed a strong recovery community with diverse housing options." },
      { question: "What areas in Arizona have sober living homes?", answer: "The Phoenix metropolitan area, including Scottsdale, Tempe, and Mesa, has the highest concentration of sober living homes. Tucson also has a growing recovery community with more affordable options." },
      { question: "How much does sober living cost in Arizona?", answer: "Arizona sober living typically ranges from $600 to $2,000 per month. Scottsdale tends to be more expensive with luxury options, while Phoenix and Tucson offer more budget-friendly choices." }
    ]
  },
  "new-york": {
    slug: "new-york",
    name: "New York",
    type: "state",
    stateCode: "NY",
    description: "New York offers diverse recovery options from the bustling streets of NYC to peaceful upstate communities. The state has a long history of recovery support with extensive 12-step traditions.",
    highlights: [
      "Birthplace of many 12-step programs and traditions",
      "Diverse recovery communities across the state",
      "Strong employment opportunities in various industries",
      "Extensive public transportation in metropolitan areas",
      "Mix of urban and rural recovery environments"
    ],
    faqs: [
      { question: "Is there sober living in New York City?", answer: "Yes, New York City has sober living options in all five boroughs, though they tend to be more expensive than other areas. Brooklyn and Queens offer more affordable options while Manhattan has limited but high-end choices." },
      { question: "Where else in New York can I find sober living?", answer: "Outside NYC, popular areas for sober living include Long Island, Westchester County, and upstate regions like Albany and Buffalo. These areas often offer more space and affordability." },
      { question: "How much does sober living cost in New York?", answer: "Costs vary significantly by location. NYC sober living ranges from $1,200 to $3,000+ per month, while upstate options can be as affordable as $600 to $1,500 per month." }
    ]
  }
};

const allLocations = Object.values(locationData);
const cities = allLocations.filter(l => l.type === "city");
const states = allLocations.filter(l => l.type === "state");

async function fetchListingsByLocation(city?: string, state?: string): Promise<Listing[]> {
  const response = await fetch("/api/listings");
  if (!response.ok) return [];
  const listings: Listing[] = await response.json();
  
  return listings.filter(listing => {
    if (city) {
      return listing.city.toLowerCase().includes(city.toLowerCase());
    }
    if (state) {
      return listing.state.toLowerCase().includes(state.toLowerCase()) ||
             listing.state.toLowerCase() === state.toLowerCase();
    }
    return true;
  });
}

export function LocationLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const location = slug ? locationData[slug] : null;
  
  const { data: listings = [] } = useQuery({
    queryKey: ["listings", slug],
    queryFn: () => fetchListingsByLocation(
      location?.type === "city" ? location.name : undefined,
      location?.type === "state" ? location.name : undefined
    ),
    enabled: !!location
  });

  if (!location) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Find Sober Living by Location</h1>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Popular States</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-12">
                {states.map((state) => (
                  <Link key={state.slug} href={`/sober-living-${state.slug}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-lg font-medium text-white">Sober Living {state.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">Popular Cities</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Link key={city.slug} href={`/sober-living-${city.slug}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-lg font-medium text-white">Sober Living {city.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-primary" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span>/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/locations" className="hover:text-primary" itemProp="item">
                <span itemProp="name">Locations</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span>/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-white" itemProp="name">{location.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sober Living in {location.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find verified sober living homes in {location.name}{location.type === "city" ? `, ${location.state}` : ""}. 
                Browse recovery housing options that support your journey to lasting sobriety.
              </p>
              <Link href={`/browse?location=${encodeURIComponent(location.name)}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                  <Search className="w-5 h-5 mr-2" /> Search {location.name} Homes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                About Sober Living in {location.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {location.description}
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">
                Why Choose {location.name} for Recovery?
              </h2>
              <div className="grid gap-4 mb-12">
                {location.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{highlight}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">
                Finding the Right Sober Living Home in {location.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                When searching for sober living in {location.name}, consider factors like location, cost, 
                house rules, and the community atmosphere. Many homes in {location.name} offer specialized 
                programs for different needs, whether you're looking for a structured environment or a more 
                independent living situation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober Stay makes it easy to compare options and find the perfect fit. Our verified listings 
                include detailed information about amenities, house rules, costs, and photos so you can make 
                an informed decision about your next home.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">
                What to Expect from Sober Living in {location.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Most sober living homes in {location.name} require residents to maintain sobriety, 
                participate in regular drug testing, attend house meetings, and contribute to household 
                responsibilities. Many homes encourage or require attendance at 12-step meetings or other 
                recovery support groups.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {location.type === "city" 
                  ? `${location.name}'s recovery community is active and welcoming, with numerous meetings, events, and activities available to support your journey.`
                  : `${location.name} has diverse recovery communities across its cities, each with its own meetings, events, and support networks.`
                }
              </p>

              {/* Available Listings */}
              {listings.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-white mb-6 mt-12">
                    Available Homes in {location.name}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {listings.slice(0, 4).map((listing) => (
                      <Link key={listing.id} href={`/property/${listing.id}`}>
                        <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer h-full">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{listing.propertyName}</h3>
                            <p className="text-muted-foreground mb-3">{listing.city}, {listing.state}</p>
                            <p className="text-primary font-bold text-lg">${listing.monthlyPrice}/month</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/browse?location=${encodeURIComponent(location.name)}`}>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      View All {location.name} Listings <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Frequently Asked Questions About Sober Living in {location.name}
              </h2>
              
              <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                {location.faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-border rounded-lg overflow-hidden"
                    itemScope 
                    itemProp="mainEntity" 
                    itemType="https://schema.org/Question"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-card/80 transition-colors"
                    >
                      <span className="text-lg font-medium text-white" itemProp="name">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div 
                      className={`bg-card overflow-hidden transition-all ${openFaq === index ? 'max-h-96 p-6 pt-0' : 'max-h-0'}`}
                      itemScope 
                      itemProp="acceptedAnswer" 
                      itemType="https://schema.org/Answer"
                    >
                      <p className="text-muted-foreground" itemProp="text">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Find Your Sober Living Home in {location.name}?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse verified sober living homes and take the next step toward lasting recovery.
            </p>
            <Link href={`/browse?location=${encodeURIComponent(location.name)}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                Start Your Search
              </Button>
            </Link>
          </div>
        </section>

        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": `Sober Living in ${location.name}`,
              "description": `Find sober living homes in ${location.name}. Browse verified recovery housing with Sober Stay.`,
              "url": `https://soberstay.com/sober-living-${location.slug}`,
              "mainEntity": {
                "@type": "ItemList",
                "name": `Sober Living Homes in ${location.name}`,
                "numberOfItems": listings.length
              }
            })
          }}
        />
      </div>
    </Layout>
  );
}

export default LocationLanding;
