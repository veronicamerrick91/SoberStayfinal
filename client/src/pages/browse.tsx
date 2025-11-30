import { Layout } from "@/components/layout";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, ShieldCheck, Filter, LayoutGrid, List 
} from "lucide-react";
import { useState } from "react";

export default function Browse() {
  const [priceRange, setPriceRange] = useState([500]);
  
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
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          {/* Mobile Search (visible on all) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="City, zip, or name" className="pl-9 bg-card border-border" />
          </div>

          {/* Filter Groups */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="men" />
                      <Label htmlFor="men" className="font-normal">Men Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="women" />
                      <Label htmlFor="women" className="font-normal">Women Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="coed" />
                      <Label htmlFor="coed" className="font-normal">Co-ed</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>Support Level</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mat" />
                      <Label htmlFor="mat" className="font-normal">MAT Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" checked />
                      <Label htmlFor="verified" className="font-normal">Verified Only</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <Label>Max Price (Weekly)</Label>
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
              <Button variant="outline" size="icon" className="h-8 w-8 bg-primary/10 border-primary/20 text-primary">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_PROPERTIES.map((home) => (
              <Card key={home.id} className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={home.image} 
                    alt={home.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    {home.isVerified && (
                      <Badge className="bg-primary text-white border-none shadow-lg flex gap-1 items-center backdrop-blur-md bg-opacity-90">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute bottom-3 left-3">
                    <div className="text-2xl font-bold text-white drop-shadow-md">
                      ${home.price}<span className="text-sm font-normal text-gray-200">/{home.pricePeriod}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-xl text-white line-clamp-1 group-hover:text-primary transition-colors">{home.name}</h3>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1 text-primary" />
                      {home.address}, {home.city}, {home.state}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary/60 hover:bg-secondary">{home.gender}</Badge>
                    {home.isMatFriendly && <Badge variant="outline" className="border-primary/30 text-primary">MAT</Badge>}
                    <Badge variant="outline" className={home.bedsAvailable > 0 ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"}>
                      {home.bedsAvailable > 0 ? `${home.bedsAvailable} Beds` : "Waitlist"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {home.description}
                  </p>
                  
                  <div className="pt-4 border-t border-border/50 flex gap-2">
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Details
                    </Button>
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
