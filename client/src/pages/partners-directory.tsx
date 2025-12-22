import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, Building2, BookOpen, Phone, Globe, Users, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { useQuery } from "@tanstack/react-query";

interface Partner {
  id: number;
  name: string;
  category: "organization" | "treatment" | "blog" | "hotline" | "association";
  description: string | null;
  website: string | null;
  focus: string[] | null;
  isActive: boolean;
}

const categoryInfo: Record<string, { label: string; icon: any; color: string }> = {
  organization: { label: "National Organization", icon: Building2, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  treatment: { label: "Treatment Center", icon: Heart, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  blog: { label: "Recovery Blog", icon: BookOpen, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  hotline: { label: "Crisis Hotline", icon: Phone, color: "bg-red-500/10 text-red-400 border-red-500/20" },
  association: { label: "Professional Association", icon: Users, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
};

export function PartnersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useDocumentMeta({
    title: "Recovery Partners & Resources Directory | Sober Stay",
    description: "Browse our directory of trusted recovery organizations, blogs, and addiction resources. Find support for your recovery journey."
  });

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    queryFn: async () => {
      const res = await fetch("/api/partners");
      if (!res.ok) throw new Error("Failed to fetch partners");
      return res.json();
    }
  });

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (partner.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || partner.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: "all", label: "All Partners", count: partners.length },
    { key: "organization", label: "Organizations", count: partners.filter(p => p.category === "organization").length },
    { key: "treatment", label: "Treatment Centers", count: partners.filter(p => p.category === "treatment").length },
    { key: "blog", label: "Blogs & Publications", count: partners.filter(p => p.category === "blog").length },
    { key: "hotline", label: "Crisis Hotlines", count: partners.filter(p => p.category === "hotline").length },
    { key: "association", label: "Associations", count: partners.filter(p => p.category === "association").length }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-16 pb-12 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="partners-h1">
              Recovery Partners & Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              We're proud to be part of the recovery community. Explore our directory of trusted organizations 
              and resources dedicated to helping people achieve lasting recovery.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search partners and resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg bg-card border-border"
                data-testid="input-search-partners"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.key)}
              className="gap-2"
              data-testid={`button-category-${cat.key}`}
            >
              {cat.label}
              <span className="bg-primary/20 text-primary-foreground px-2 py-0.5 rounded text-xs">
                {cat.count}
              </span>
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map(partner => {
              const catInfo = categoryInfo[partner.category] || categoryInfo.organization;
              const Icon = catInfo.icon;
              
              return (
                <Card 
                  key={partner.id} 
                  className="bg-card border-border hover:border-primary/50 transition-all"
                  data-testid={`card-partner-${partner.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-2 rounded-lg border ${catInfo.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded border ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-white mt-3 leading-tight">
                      {partner.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {partner.description || "No description available."}
                    </p>
                    {partner.focus && partner.focus.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {partner.focus.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {partner.website && (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        data-testid={`link-partner-${partner.id}`}
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No partners found matching your search.</p>
          </div>
        )}

        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to Partner with Sober Stay?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking to connect with organizations that share our mission of helping people find 
            quality recovery housing. If you'd like to be listed in our directory or explore partnership opportunities, 
            we'd love to hear from you.
          </p>
          <a href="/contact">
            <Button size="lg" data-testid="button-contact-partnership">
              Contact Us About Partnerships
            </Button>
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default PartnersDirectory;
