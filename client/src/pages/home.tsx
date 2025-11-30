import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, CheckCircle2, ShieldCheck, FileCheck, HeartHandshake } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/dark_navy_and_teal_abstract_background_for_hero_section.png";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-0" />
        
        <div className="container relative z-10 px-4 py-20 text-center md:text-left md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Safe & Supportive Housing</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
              Where Healing <br />
              <span className="text-primary">Finds Home</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-lg">
              Connect with verified sober living homes that provide the safety, structure, and community you need for your recovery journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-12 px-8 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105">
                  Search Homes
                </Button>
              </Link>
              <Link href="/for-providers">
                <Button size="lg" variant="outline" className="text-lg h-12 px-8 rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40">
                  List Your Home
                </Button>
              </Link>
            </div>

            {/* Search Bar Widget */}
            <div className="mt-8 p-4 bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl max-w-md">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="City, State, or Zip" 
                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>
                <Link href="/browse">
                  <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0">
                    <Search className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hero Visual/Stats (Hidden on mobile, visible on desktop) */}
          <div className="hidden md:block md:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/40 backdrop-blur border-white/10 p-6 transform translate-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Verified Providers</div>
              </Card>
              <Card className="bg-card/40 backdrop-blur border-white/10 p-6 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Available Beds</div>
              </Card>
              <Card className="bg-card/40 backdrop-blur border-white/10 p-6 col-span-2 transform -translate-y-4 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <HeartHandshake className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Community First</div>
                    <div className="text-xs text-muted-foreground">Built by people in recovery, for people in recovery.</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How Sober Stay Works</h2>
            <p className="text-muted-foreground">Finding a safe environment shouldn't be harder than the recovery itself. We've simplified the process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />

            {[
              { icon: Search, title: "1. Search Verified Homes", desc: "Filter by location, budget, gender, and amenities to find the right fit." },
              { icon: FileCheck, title: "2. Apply Securely", desc: "Fill out one detailed application and submit it to multiple homes instantly." },
              { icon: CheckCircle2, title: "3. Connect & Move In", desc: "Chat directly with providers, schedule visits, and secure your spot." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-card border border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors group">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Tenants & Providers Split */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Tenants */}
            <div className="space-y-6 p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border">
              <h3 className="text-2xl font-bold text-white">For Tenants</h3>
              <ul className="space-y-4">
                {["Verified safe environments", "Direct chat with providers", "Secure document storage", "Track application status"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-background hover:bg-gray-200 font-semibold">
                Create Tenant Account
              </Button>
            </div>

            {/* Providers */}
            <div className="space-y-6 p-8 rounded-2xl bg-gradient-to-tl from-card to-background border border-border">
              <h3 className="text-2xl font-bold text-white">For Providers</h3>
              <ul className="space-y-4">
                {["Fill vacancies faster", "Streamlined application management", "Marketing & SEO included", "Digital resident files"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Create Provider Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Featured Homes</h2>
              <p className="text-muted-foreground">Top-rated sober living environments near you.</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" className="text-primary hover:text-primary/80">View All &rarr;</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PROPERTIES.map((home) => (
              <Link key={home.id} href={`/browse`}>
                <Card className="h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={home.image} 
                      alt={home.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {home.isVerified && (
                        <Badge className="bg-primary/90 text-white border-none flex gap-1 items-center">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                      <div className="text-white font-bold">${home.price}/{home.pricePeriod}</div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-white mb-1 truncate">{home.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      {home.city}, {home.state}
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap">
                      <Badge variant="secondary" className="bg-secondary/50">{home.gender}</Badge>
                      {home.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary">MAT Friendly</Badge>}
                      <Badge variant="outline" className="border-white/10">{home.bedsAvailable} Beds Open</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Stay Connected</h2>
          <p className="text-muted-foreground mb-8">Get updates on new openings, recovery resources, and community events.</p>
          <div className="flex gap-2">
            <Input placeholder="Enter your email" className="bg-background border-border" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
