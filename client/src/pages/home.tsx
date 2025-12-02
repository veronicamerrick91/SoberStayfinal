import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, CheckCircle2, ShieldCheck, FileCheck, HeartHandshake, ArrowRight, Sparkles, Building } from "lucide-react";
import { Link, useLocation } from "wouter";
import heroBg from "@assets/generated_images/luxury_warm_home_exterior_at_dusk.png";
import pathBg from "@assets/generated_images/luxury_living_room_interior_warm_ambiance.png";
import tenantBg from "@assets/generated_images/luxury_residential_street_at_sunset.png";
import providerBg from "@assets/generated_images/modern_luxury_home_office_space.png";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/browse");
    }
  };
  return (
    <Layout>
      {/* Hero Section with Home Image */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-0" />
        
        <div className="container relative z-10 px-4 py-20 text-left">
          <div className="space-y-8 max-w-2xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-4 h-4" />
              <span>Quality Sober Living Communities</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white leading-[1.1]">
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Safe Haven</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
              Connect with supportive sober living homes that understand your journey. Take the next step toward lasting recovery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                  Search Homes
                </Button>
              </Link>
              <Link href="/for-providers">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40 backdrop-blur-sm">
                  List Your Home
                </Button>
              </Link>
            </div>

            {/* Search Bar Widget */}
            <div className="mt-8 p-4 bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md hover:border-primary/30 transition-colors">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="City, State, or Zip" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 text-lg bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  />
                </div>
                <Button 
                  size="icon" 
                  onClick={handleSearch}
                  className="h-12 w-12 bg-primary hover:bg-primary/90 shrink-0 rounded-xl shadow-lg"
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">100+</div>
              <p className="text-lg text-gray-300 font-medium">Sober Living Homes</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">50</div>
              <p className="text-lg text-gray-300 font-medium">States Covered</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">5k+</div>
              <p className="text-lg text-gray-300 font-medium">People Helped</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned */}
      <section className="relative py-32 bg-background overflow-hidden">
        {/* Background Path Visual */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <img src={pathBg} className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-4 py-1 text-sm uppercase tracking-widest">Simple Process</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Your Journey to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Safe Living</span>
            </h2>
            <p className="text-xl text-muted-foreground">Finding a safe environment shouldn't be harder than the recovery itself. We've simplified the process into three seamless steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { icon: Search, title: "Search Quality Homes", desc: "Filter by location, budget, gender, and amenities to find the right fit.", step: "01" },
              { icon: FileCheck, title: "Apply Securely", desc: "Fill out one detailed application and submit it to multiple homes instantly.", step: "02" },
              { icon: CheckCircle2, title: "Connect & Move In", desc: "Chat directly with providers, schedule visits, and secure your spot.", step: "03" }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-600/50 rounded-2xl blur opacity-20 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative h-full bg-card border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-0 right-0 p-6 text-6xl font-bold text-white/5 select-none font-heading">{step.step}</div>
                  
                  <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-background border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{step.desc}</p>
                  
                  <div className="mt-8 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Tenants & Providers Split - Creative Redesign */}
      <section className="py-0 bg-background">
        <div className="grid lg:grid-cols-2 min-h-[800px]">
          
          {/* Tenants Side */}
          <div className="relative group overflow-hidden min-h-[500px] lg:min-h-full">
            <div className="absolute inset-0">
              <img src={tenantBg} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20 max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-300 text-sm font-medium mb-6 w-fit">
                <Sparkles className="w-4 h-4" /> For Tenants
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Your Safe Haven</h3>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Your recovery deserves a supportive environment. Browse quality homes, chat directly with providers, and manage your applications in one secure place.
              </p>
              
              <ul className="space-y-5 mb-12">
                {["Browse trusted recovery environments", "Direct chat with providers", "Secure document storage", "Track application status in real-time"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-white">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/for-tenants">
                <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 text-lg h-14 px-10 rounded-full w-fit shadow-xl transition-all hover:translate-x-2">
                  Start Your Search <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Providers Side */}
          <div className="relative group overflow-hidden min-h-[500px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="absolute inset-0">
              <img src={providerBg} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-emerald-950/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center p-12 lg:p-20 max-w-2xl mx-auto lg:mx-0 lg:mr-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-sm font-medium mb-6 w-fit">
                <Building className="w-4 h-4" /> For Providers
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Grow Your Community</h3>
              <p className="text-xl text-emerald-100 mb-4 leading-relaxed">
                Fill vacancies faster with qualified applicants. Manage listings, screen residents, and streamline your intake process with our powerful tools.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold mb-10 w-fit">
                <span>💰</span>
                <span>$49/month per listing</span>
              </div>
              
              <ul className="space-y-5 mb-12">
                {["Fill vacancies faster", "Streamlined application management", "Marketing & SEO included", "Digital resident files"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-white">
                    <div className="bg-emerald-500/20 p-2 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/for-providers">
                <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 text-lg h-14 px-10 rounded-full w-fit shadow-xl shadow-emerald-900/20 transition-all hover:translate-x-2">
                  List Your Property <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Homes */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">Featured Homes</h2>
              <p className="text-xl text-muted-foreground">Top-rated sober living environments near you.</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/10 text-lg px-6 h-12 rounded-full">
                View All Listings <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PROPERTIES.map((home) => (
              <Link key={home.id} href={`/browse`}>
                <Card className="h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer group rounded-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={home.image} 
                      alt={home.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      {home.isVerified && (
                        <Badge className="bg-emerald-500/90 backdrop-blur text-white border-none flex gap-1 items-center px-3 py-1 shadow-lg">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <div className="text-2xl font-bold text-white mb-1">{home.name}</div>
                       <div className="text-emerald-400 font-bold text-lg">${home.price}<span className="text-sm font-normal text-gray-300">/{home.pricePeriod}</span></div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {home.city}, {home.state}
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap">
                      <Badge variant="secondary" className="bg-secondary/50 py-1 px-2">{home.gender}</Badge>
                      {home.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary py-1 px-2">MAT Friendly</Badge>}
                      <Badge variant="outline" className="border-white/10 py-1 px-2">{home.bedsAvailable} Beds Open</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Redesigned */}
      <section className="py-32 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-background z-0" />
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
             <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-white">Stay Connected to Recovery</h2>
          <p className="text-xl text-muted-foreground mb-10">Get updates on new openings, recovery resources, and community events delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Enter your email address" className="bg-background/50 border-white/10 h-12 text-lg rounded-xl" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-lg rounded-xl shadow-lg shadow-primary/20">Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
