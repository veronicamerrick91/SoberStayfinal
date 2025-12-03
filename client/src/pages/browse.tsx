import { Layout } from "@/components/layout";
import { MOCK_PROPERTIES, SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, ShieldCheck, Filter, LayoutGrid, List,
  Info, HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Browse() {
  const [priceRange, setPriceRange] = useState([500]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchLocation, setSearchLocation] = useState("");
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setSearchLocation(decodeURIComponent(search));
    }
  }, [location]);
  
  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Browse Sober Homes</h1>
          <p className="text-muted-foreground">Find safe, verified recovery housing that fits your needs.</p>
        </div>
      </div>

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
                        <Checkbox id={g} />
                        <Label htmlFor={g} className="font-normal text-muted-foreground">{g}</Label>
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
                        <Checkbox id={type} />
                        <Label htmlFor={type} className="font-normal text-muted-foreground">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label className="text-white font-semibold">Features & Support</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified" className="font-normal text-muted-foreground">Verified Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mat" />
                      <Label htmlFor="mat" className="font-normal text-muted-foreground">MAT Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pet" />
                      <Label htmlFor="pet" className="font-normal text-muted-foreground">Pet Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lgbtq" />
                      <Label htmlFor="lgbtq" className="font-normal text-muted-foreground">LGBTQ Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="faith" />
                      <Label htmlFor="faith" className="font-normal text-muted-foreground">Faith Based</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="insurance" />
                      <Label htmlFor="insurance" className="font-normal text-muted-foreground">Accepts Insurance</Label>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <Label className="text-white font-semibold">Max Price (Weekly)</Label>
                    <span className="text-sm text-primary font-bold">${priceRange[0]}</span>
                  </div>
                  <Slider 
                    defaultValue={[500]} 
                    max={1000} 
                    step={50} 
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
              Showing <span className="text-foreground font-bold">{MOCK_PROPERTIES.length}</span> homes
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 ${viewMode === "list" ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" && <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {MOCK_PROPERTIES.map((home) => (
                <Link key={home.id} href={`/property/${home.id}`}>
                  <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer h-full flex flex-col">
                    <div className="relative h-40 overflow-hidden shrink-0">
                      <img 
                        src={home.image} 
                        alt={home.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-2 left-2">
                        {home.isVerified && (
                          <Badge className="bg-primary text-white border-none shadow-lg flex gap-1 items-center backdrop-blur-md bg-opacity-90 text-xs">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <div className="text-sm font-bold text-white drop-shadow-md">
                          ${home.price}<span className="text-xs font-normal text-gray-200">/{home.pricePeriod}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3 space-y-2 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">{home.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1 text-primary" />
                          {home.city}, {home.state}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-secondary/60 text-xs py-0 px-2">{home.gender}</Badge>
                          <Badge variant="outline" className="border-primary/30 text-primary text-xs py-0 px-2">{home.roomType}</Badge>
                          {home.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary text-xs py-0 px-2">MAT</Badge>}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-border/50 flex gap-1 mt-auto">
                        <Button size="sm" className="flex-1 h-7 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                          Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-7 border-primary/20 text-primary hover:bg-primary/10 text-xs">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>}

          {viewMode === "list" && (
            <div className="space-y-3">
              {MOCK_PROPERTIES.map((home) => (
                <Link key={home.id} href={`/property/${home.id}`}>
                  <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={home.image} 
                          alt={home.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {home.isVerified && (
                          <Badge className="absolute top-2 left-2 bg-primary text-white border-none shadow-lg flex gap-1 items-center backdrop-blur-md bg-opacity-90 text-xs">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="font-bold text-sm text-white group-hover:text-primary transition-colors line-clamp-1">{home.name}</h3>
                            <div className="text-sm font-bold text-primary shrink-0">
                              ${home.price}<span className="text-xs font-normal text-gray-300">/{home.pricePeriod}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            {home.address}, {home.city}, {home.state}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {home.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-secondary/60">{home.gender}</Badge>
                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">{home.roomType}</Badge>
                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">{home.supervisionType}</Badge>
                            {home.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary">MAT Friendly</Badge>}
                            <Badge variant="outline" className={home.bedsAvailable > 0 ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"}>
                              {home.bedsAvailable > 0 ? `${home.bedsAvailable} Beds Open` : "Waitlist"}
                            </Badge>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/50 flex gap-2 mt-auto">
                          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                            View Details
                          </Button>
                          <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
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
