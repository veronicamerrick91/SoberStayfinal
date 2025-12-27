import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { MapPin, Search, Shield, Users, Heart, CheckCircle, ChevronDown, ChevronUp, Home, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";
import { useDocumentMeta } from "@/lib/use-document-meta";

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
  "california": {
    slug: "california",
    name: "California",
    type: "state",
    stateCode: "CA",
    description: "California leads the nation in recovery housing options, from beachside communities in Southern California to urban centers in the Bay Area. The Golden State offers year-round sunshine, diverse recovery communities, and world-class treatment resources.",
    highlights: [
      "Largest number of sober living homes in the United States",
      "Year-round mild climate supports outdoor recovery activities",
      "Diverse recovery communities serving all backgrounds and preferences",
      "Strong employment markets in tech, entertainment, and healthcare",
      "Beach, mountain, and desert environments all within reach"
    ],
    faqs: [
      { question: "Which cities in California have the most sober living homes?", answer: "Los Angeles and San Diego have the highest concentrations of sober living homes in California. Orange County, the Bay Area (San Francisco, Oakland), and Sacramento also have substantial options." },
      { question: "How much does sober living cost in California?", answer: "California sober living ranges from $700 to $3,500+ per month depending on location. Beach communities tend to be more expensive, while inland areas like the Inland Empire or Central Valley offer more affordable options." },
      { question: "Is California a good place for sober living?", answer: "California is one of the best states for recovery, with extensive meeting networks, diverse treatment options, strong alumni communities, and a culture that embraces wellness and healthy living." }
    ]
  },
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
      { question: "How do I find a sober living home in San Diego?", answer: "Use Sober Stay to search for sober living homes in San Diego. Filter by neighborhood, price, gender, and amenities to find the perfect fit. Popular areas include Pacific Beach, Ocean Beach, and North County." },
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
  },
  "denver": {
    slug: "denver",
    name: "Denver",
    type: "city",
    state: "Colorado",
    stateCode: "CO",
    description: "Denver has emerged as a major hub for recovery, offering a unique combination of outdoor lifestyle, growing job market, and supportive recovery community. The Mile High City provides an ideal setting for those seeking a fresh start in sobriety.",
    highlights: [
      "Access to world-class outdoor recreation including hiking, skiing, and biking",
      "Growing tech and healthcare job markets with recovery-friendly employers",
      "Strong AA and NA meeting presence throughout the metro area",
      "Active young adult recovery community with sober social events",
      "Clean air and healthy lifestyle culture supports wellness in recovery"
    ],
    faqs: [
      { question: "What makes Denver good for sober living?", answer: "Denver offers a unique blend of outdoor adventure, career opportunities, and a thriving recovery community. The city's active lifestyle culture naturally supports sobriety, with numerous sober hiking groups, fitness communities, and social events." },
      { question: "What neighborhoods in Denver have sober living homes?", answer: "Popular areas for sober living in Denver include Capitol Hill, Baker, Highland, and Aurora. Each neighborhood offers different price points and community vibes, from urban to suburban settings." },
      { question: "How much does sober living cost in Denver?", answer: "Denver sober living typically ranges from $700 to $2,200 per month. Prices have increased with the city's growth, but options remain more affordable than coastal cities while offering excellent quality." }
    ]
  },
  "chicago": {
    slug: "chicago",
    name: "Chicago",
    type: "city",
    state: "Illinois",
    stateCode: "IL",
    description: "Chicago offers one of the strongest recovery communities in the Midwest, with deep roots in 12-step traditions and a diverse range of sober living options across its many neighborhoods.",
    highlights: [
      "Rich 12-step history with meetings available around the clock",
      "Affordable cost of living compared to coastal cities",
      "Excellent public transportation makes getting to meetings easy",
      "Diverse neighborhoods each with unique recovery communities",
      "Strong alumni networks from major treatment centers"
    ],
    faqs: [
      { question: "Where can I find sober living in Chicago?", answer: "Chicago has sober living options throughout the city, with concentrations in neighborhoods like Lincoln Park, Lakeview, Wicker Park, and the western suburbs. Each area offers different price points and community atmospheres." },
      { question: "Is Chicago affordable for sober living?", answer: "Yes, Chicago offers more affordable sober living than coastal cities. Monthly costs typically range from $600 to $1,800, with excellent public transportation reducing the need for a car." },
      { question: "What support is available in Chicago for recovery?", answer: "Chicago has thousands of AA and NA meetings weekly, multiple recovery community organizations, sober social clubs, and strong alumni networks. The city also hosts major recovery events and conventions throughout the year." }
    ]
  },
  "miami": {
    slug: "miami",
    name: "Miami",
    type: "city",
    state: "Florida",
    stateCode: "FL",
    description: "Miami and South Florida are home to one of the largest recovery communities in the world. The tropical climate, diverse population, and extensive treatment infrastructure make it a premier destination for recovery.",
    highlights: [
      "Year-round tropical weather perfect for outdoor recovery activities",
      "Massive recovery community with meetings in multiple languages",
      "Close proximity to world-renowned treatment centers",
      "Beautiful beaches and nature for wellness activities",
      "Vibrant Latin American recovery community"
    ],
    faqs: [
      { question: "Why is Miami popular for sober living?", answer: "Miami offers warm weather year-round, a massive recovery community, and proximity to some of the best treatment centers in the country. The diverse population means recovery support is available in Spanish, Portuguese, and other languages." },
      { question: "What areas in Miami have sober living?", answer: "Popular areas for sober living in South Florida include Miami Beach, Coconut Grove, Coral Gables, and the broader Broward County area including Fort Lauderdale. Prices and vibes vary significantly by neighborhood." },
      { question: "How much does sober living cost in Miami?", answer: "Miami sober living ranges from $800 to $3,000+ per month. Beach areas tend to be more expensive, while inland and Broward County options offer more affordable alternatives with similar recovery support." }
    ]
  },
  "seattle": {
    slug: "seattle",
    name: "Seattle",
    type: "city",
    state: "Washington",
    stateCode: "WA",
    description: "Seattle offers a progressive recovery community with diverse approaches to sobriety. The Pacific Northwest lifestyle emphasizes wellness, nature, and alternative recovery methods alongside traditional 12-step programs.",
    highlights: [
      "Strong emphasis on holistic and alternative recovery approaches",
      "Beautiful natural surroundings with easy access to mountains and water",
      "Progressive healthcare system with good recovery support",
      "Tech industry offers excellent employment opportunities",
      "Active outdoor recovery community with hiking and sailing groups"
    ],
    faqs: [
      { question: "What makes Seattle unique for sober living?", answer: "Seattle offers a progressive approach to recovery with options beyond traditional 12-step programs, including SMART Recovery, Refuge Recovery, and secular alternatives. The outdoor lifestyle and access to nature support holistic wellness." },
      { question: "Where can I find sober living in Seattle?", answer: "Sober living options in Seattle are found in neighborhoods like Capitol Hill, Ballard, Fremont, and the Eastside (Bellevue, Kirkland). Each area offers different community vibes and access to recovery resources." },
      { question: "Is sober living expensive in Seattle?", answer: "Seattle sober living ranges from $800 to $2,500 per month. While costs are higher than national averages due to the tech economy, options exist across various price points throughout the metro area." }
    ]
  },
  "portland": {
    slug: "portland",
    name: "Portland",
    type: "city",
    state: "Oregon",
    stateCode: "OR",
    description: "Portland's recovery community reflects the city's unique culture - progressive, welcoming, and diverse. The city offers both traditional and alternative recovery pathways in an affordable Pacific Northwest setting.",
    highlights: [
      "Welcoming and non-judgmental recovery community",
      "More affordable than Seattle while offering similar lifestyle",
      "Strong emphasis on wellness, fitness, and outdoor activities",
      "Active young adult recovery scene with sober social events",
      "Easy access to nature including mountains, beaches, and forests"
    ],
    faqs: [
      { question: "What is the recovery community like in Portland?", answer: "Portland's recovery community is known for being welcoming and diverse, with both traditional 12-step programs and alternative approaches like SMART Recovery and dharma-based recovery. The community is particularly strong for young adults in recovery." },
      { question: "Where are sober living homes located in Portland?", answer: "Sober living options are found throughout Portland, with concentrations in Southeast Portland, Northeast Portland, and the suburbs like Beaverton and Gresham. Each area offers different price points and neighborhood vibes." },
      { question: "How affordable is sober living in Portland?", answer: "Portland offers relatively affordable sober living for the West Coast, ranging from $600 to $1,800 per month. The city provides good value with lower costs than Seattle or California while maintaining quality recovery support." }
    ]
  },
  "austin": {
    slug: "austin",
    name: "Austin",
    type: "city",
    state: "Texas",
    stateCode: "TX",
    description: "Austin combines Texas hospitality with a progressive, health-conscious culture that supports recovery. The city's live music scene has spawned a unique sober entertainment community, and the outdoor lifestyle promotes wellness.",
    highlights: [
      "Thriving sober music and entertainment scene",
      "Year-round outdoor activities including hiking, swimming, and biking",
      "Growing tech industry offers excellent employment opportunities",
      "Strong young adult recovery community",
      "Lower cost of living than coastal cities"
    ],
    faqs: [
      { question: "What makes Austin good for sober living?", answer: "Austin offers a unique combination of Texas affordability, a health-conscious culture, and a vibrant sober social scene. The city has sober concert events, fitness communities, and outdoor activities that make early recovery enjoyable." },
      { question: "Where can I find sober living in Austin?", answer: "Popular areas for sober living in Austin include South Austin, East Austin, and the northern suburbs like Round Rock and Cedar Park. Options range from urban settings near downtown to quieter suburban environments." },
      { question: "How much does sober living cost in Austin?", answer: "Austin sober living typically ranges from $600 to $1,600 per month. While prices have increased with the city's growth, it remains more affordable than California or Florida while offering an excellent quality of life." }
    ]
  },
  "nashville": {
    slug: "nashville",
    name: "Nashville",
    type: "city",
    state: "Tennessee",
    stateCode: "TN",
    description: "Nashville's recovery community has grown alongside the city's entertainment industry. With a strong faith-based recovery tradition and an increasingly diverse set of options, Music City offers solid support for those seeking sobriety.",
    highlights: [
      "Strong faith-based and traditional recovery programs",
      "Growing sober music and entertainment scene",
      "Affordable cost of living with good employment opportunities",
      "Welcoming Southern hospitality in recovery community",
      "Healthcare industry provides stable employment"
    ],
    faqs: [
      { question: "What is sober living like in Nashville?", answer: "Nashville offers a warm, welcoming recovery community with strong roots in faith-based programs alongside secular options. The music industry has spawned a unique sober entertainment scene, and the Southern hospitality extends to recovery support." },
      { question: "Where are sober living homes in Nashville?", answer: "Sober living options in Nashville are found throughout the metro area, including East Nashville, Bellevue, and Franklin. The suburbs often offer more affordable options while downtown areas provide walkable urban living." },
      { question: "How affordable is sober living in Nashville?", answer: "Nashville remains one of the more affordable major cities for sober living, with costs ranging from $500 to $1,500 per month. This makes it an attractive option for those seeking quality recovery support without coastal prices." }
    ]
  },
  "atlanta": {
    slug: "atlanta",
    name: "Atlanta",
    type: "city",
    state: "Georgia",
    stateCode: "GA",
    description: "Atlanta serves as the recovery hub of the Southeast, with a diverse and growing sober living community. The city offers strong employment opportunities, affordable living, and a welcoming atmosphere for those in recovery.",
    highlights: [
      "Major Southeast hub with extensive recovery resources",
      "Diverse recovery community serving many cultures and backgrounds",
      "Strong job market in multiple industries",
      "Affordable cost of living for a major metropolitan area",
      "Year-round mild weather supports outdoor activities"
    ],
    faqs: [
      { question: "What makes Atlanta good for sober living?", answer: "Atlanta offers a diverse, welcoming recovery community with options for all backgrounds. The city serves as a regional hub with numerous treatment centers, strong AA/NA presence, and growing alternative recovery options." },
      { question: "Where can I find sober living in Atlanta?", answer: "Popular areas for sober living in Atlanta include Midtown, Buckhead, East Atlanta, and the northern suburbs like Marietta and Alpharetta. MARTA public transit makes it easy to get to meetings throughout the metro area." },
      { question: "How much does sober living cost in Atlanta?", answer: "Atlanta sober living ranges from $500 to $1,800 per month, making it one of the more affordable major cities. The combination of reasonable costs and excellent recovery resources makes it attractive for long-term recovery." }
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

  useDocumentMeta({
    title: location 
      ? `Sober Living in ${location.name} | Recovery Housing | Sober Stay`
      : "Find Sober Living by Location | Sober Stay",
    description: location 
      ? `Find sober living homes in ${location.name}. ${location.description.slice(0, 100)}...`
      : "Browse sober living homes by state and city. Find recovery housing in California, Florida, Texas, Arizona, and more."
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
                  <Link key={state.slug} href={`/${state.slug}-sober-living`}>
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
                  <Link key={city.slug} href={`/${city.slug}-sober-living`}>
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
                Find sober living homes in {location.name}{location.type === "city" ? `, ${location.state}` : ""}. 
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
                Sober Stay makes it easy to compare options and find the perfect fit. Our listings 
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
              Browse sober living homes and take the next step toward lasting recovery.
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
              "description": `Find sober living homes in ${location.name}. Browse recovery housing with Sober Stay.`,
              "url": `https://soberstay.com/${location.slug}-sober-living`,
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
