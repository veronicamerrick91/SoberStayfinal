import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, Building2, BookOpen, Phone, Globe, Users } from "lucide-react";
import { useState } from "react";
import { useDocumentMeta } from "@/lib/use-document-meta";

interface Partner {
  id: number;
  name: string;
  category: "organization" | "blog" | "hotline" | "association";
  description: string;
  website: string;
  focus: string[];
}

const partners: Partner[] = [
  // National Organizations (1-15)
  {
    id: 1,
    name: "SAMHSA (Substance Abuse and Mental Health Services Administration)",
    category: "organization",
    description: "Federal agency leading public health efforts to advance behavioral health and reduce substance abuse impact.",
    website: "https://www.samhsa.gov",
    focus: ["Policy", "Research", "Treatment Locator"]
  },
  {
    id: 2,
    name: "National Institute on Drug Abuse (NIDA)",
    category: "organization",
    description: "NIH institute supporting research on drug use and addiction to improve health outcomes.",
    website: "https://nida.nih.gov",
    focus: ["Research", "Education", "Science"]
  },
  {
    id: 3,
    name: "National Alliance for Recovery Residences (NARR)",
    category: "association",
    description: "National organization developing standards for recovery residences and certifying homes.",
    website: "https://narronline.org",
    focus: ["Standards", "Certification", "Advocacy"]
  },
  {
    id: 4,
    name: "Faces & Voices of Recovery",
    category: "organization",
    description: "National advocacy organization mobilizing people in recovery to change public perception.",
    website: "https://facesandvoicesofrecovery.org",
    focus: ["Advocacy", "Community", "Policy"]
  },
  {
    id: 5,
    name: "The Partnership to End Addiction",
    category: "organization",
    description: "Nonprofit helping families struggling with addiction through science-based resources.",
    website: "https://drugfree.org",
    focus: ["Family Support", "Prevention", "Resources"]
  },
  {
    id: 6,
    name: "Alcoholics Anonymous (AA)",
    category: "organization",
    description: "International fellowship of people recovering from alcoholism through 12-step program.",
    website: "https://www.aa.org",
    focus: ["12-Step", "Fellowship", "Meetings"]
  },
  {
    id: 7,
    name: "Narcotics Anonymous (NA)",
    category: "organization",
    description: "Nonprofit fellowship helping people recover from drug addiction through peer support.",
    website: "https://na.org",
    focus: ["12-Step", "Drug Recovery", "Meetings"]
  },
  {
    id: 8,
    name: "SMART Recovery",
    category: "organization",
    description: "Science-based addiction recovery support using cognitive behavioral techniques.",
    website: "https://www.smartrecovery.org",
    focus: ["CBT", "Self-Empowerment", "Meetings"]
  },
  {
    id: 9,
    name: "Recovery Research Institute",
    category: "organization",
    description: "Massachusetts General Hospital center advancing addiction treatment through research.",
    website: "https://www.recoveryanswers.org",
    focus: ["Research", "Education", "Science"]
  },
  {
    id: 10,
    name: "Shatterproof",
    category: "organization",
    description: "National nonprofit working to transform addiction treatment through advocacy and education.",
    website: "https://www.shatterproof.org",
    focus: ["Advocacy", "Treatment Quality", "Stigma Reduction"]
  },
  {
    id: 11,
    name: "Young People in Recovery (YPR)",
    category: "organization",
    description: "National organization providing peer-based recovery support for young adults.",
    website: "https://youngpeopleinrecovery.org",
    focus: ["Young Adults", "Peer Support", "Education"]
  },
  {
    id: 12,
    name: "National Council for Mental Wellbeing",
    category: "organization",
    description: "Membership organization driving policy and practice change for mental health and addiction.",
    website: "https://www.thenationalcouncil.org",
    focus: ["Mental Health", "Policy", "Training"]
  },
  {
    id: 13,
    name: "Oxford House",
    category: "organization",
    description: "Network of democratically-run sober living houses across the United States.",
    website: "https://oxfordhouse.org",
    focus: ["Sober Living", "Self-Help", "Community"]
  },
  {
    id: 14,
    name: "National Association for Addiction Treatment Providers (NAATP)",
    category: "association",
    description: "Professional association promoting quality treatment and ethical practices.",
    website: "https://www.naatp.org",
    focus: ["Treatment Standards", "Ethics", "Provider Support"]
  },
  {
    id: 15,
    name: "Association of Recovery Community Organizations (ARCO)",
    category: "association",
    description: "Network of recovery community organizations providing peer support services.",
    website: "https://facesandvoicesofrecovery.org/arco",
    focus: ["Recovery Support", "Community Building", "Advocacy"]
  },

  // Recovery Blogs & Publications (16-27)
  {
    id: 31,
    name: "The Fix",
    category: "blog",
    description: "Leading addiction and recovery news magazine covering culture, science, and policy.",
    website: "https://www.thefix.com",
    focus: ["News", "Culture", "Personal Stories"]
  },
  {
    id: 32,
    name: "Addiction.com",
    category: "blog",
    description: "Comprehensive resource for addiction information, treatment, and recovery support.",
    website: "https://www.addiction.com",
    focus: ["Education", "Treatment Finder", "Resources"]
  },
  {
    id: 33,
    name: "Sober Nation",
    category: "blog",
    description: "Recovery community platform with resources, stories, and treatment information.",
    website: "https://sobernation.com",
    focus: ["Community", "Stories", "Treatment"]
  },
  {
    id: 34,
    name: "Recovery.org",
    category: "blog",
    description: "Educational platform providing addiction information and treatment resources.",
    website: "https://www.recovery.org",
    focus: ["Education", "Insurance Help", "Treatment"]
  },
  {
    id: 35,
    name: "Workit Health Blog",
    category: "blog",
    description: "Digital health company blog covering modern approaches to addiction recovery.",
    website: "https://www.workithealth.com/blog",
    focus: ["MAT", "Telehealth", "Modern Recovery"]
  },
  {
    id: 36,
    name: "In The Rooms",
    category: "blog",
    description: "Online recovery community with virtual meetings and member resources.",
    website: "https://www.intherooms.com",
    focus: ["Virtual Meetings", "Community", "Support"]
  },
  {
    id: 37,
    name: "Addiction Center",
    category: "blog",
    description: "Resource hub for addiction education, treatment options, and recovery support.",
    website: "https://www.addictioncenter.com",
    focus: ["Education", "Treatment", "Helpline"]
  },
  {
    id: 38,
    name: "Alcohol Rehab Guide",
    category: "blog",
    description: "Educational resource for alcohol addiction treatment and recovery information.",
    website: "https://www.alcoholrehabguide.org",
    focus: ["Alcohol", "Treatment Guide", "Resources"]
  },
  {
    id: 39,
    name: "Drug Rehab",
    category: "blog",
    description: "Comprehensive guide to drug addiction treatment options and recovery resources.",
    website: "https://www.drugrehab.com",
    focus: ["Drug Addiction", "Treatment", "Resources"]
  },
  {
    id: 40,
    name: "Rehabs.com",
    category: "blog",
    description: "Treatment center directory and addiction education resource platform.",
    website: "https://www.rehabs.com",
    focus: ["Directory", "Reviews", "Education"]
  },
  {
    id: 41,
    name: "Addiction Blog",
    category: "blog",
    description: "Expert-written articles on addiction science, treatment, and recovery.",
    website: "https://addictionblog.org",
    focus: ["Science", "Q&A", "Expert Content"]
  },
  {
    id: 42,
    name: "Recovery Warriors",
    category: "blog",
    description: "Eating disorder and addiction recovery community and resource platform.",
    website: "https://www.recoverywarriors.com",
    focus: ["Eating Disorders", "Dual Diagnosis", "Community"]
  },

  // Crisis Hotlines & Immediate Help (43-50)
  {
    id: 43,
    name: "SAMHSA National Helpline",
    category: "hotline",
    description: "Free, confidential 24/7 treatment referral and information service.",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    focus: ["24/7 Helpline", "Treatment Referral", "Free"]
  },
  {
    id: 44,
    name: "988 Suicide & Crisis Lifeline",
    category: "hotline",
    description: "National suicide prevention and mental health crisis support line.",
    website: "https://988lifeline.org",
    focus: ["Crisis Support", "Suicide Prevention", "24/7"]
  },
  {
    id: 45,
    name: "Crisis Text Line",
    category: "hotline",
    description: "Free text-based mental health support available 24/7 via text message.",
    website: "https://www.crisistextline.org",
    focus: ["Text Support", "Youth Friendly", "24/7"]
  },
  {
    id: 46,
    name: "Veterans Crisis Line",
    category: "hotline",
    description: "Confidential crisis support for veterans and their families.",
    website: "https://www.veteranscrisisline.net",
    focus: ["Veterans", "Military Families", "24/7"]
  },
  {
    id: 47,
    name: "National Domestic Violence Hotline",
    category: "hotline",
    description: "Support for abuse victims, many of whom struggle with substance use.",
    website: "https://www.thehotline.org",
    focus: ["Domestic Violence", "Safety Planning", "24/7"]
  },
  {
    id: 48,
    name: "RAINN (Rape, Abuse & Incest National Network)",
    category: "hotline",
    description: "Support for survivors of sexual violence, often connected to substance abuse.",
    website: "https://www.rainn.org",
    focus: ["Sexual Assault", "Trauma", "24/7 Support"]
  },
  {
    id: 49,
    name: "National Eating Disorders Association (NEDA)",
    category: "hotline",
    description: "Support and resources for eating disorders, often co-occurring with addiction.",
    website: "https://www.nationaleatingdisorders.org",
    focus: ["Eating Disorders", "Dual Diagnosis", "Helpline"]
  },
  {
    id: 50,
    name: "The Trevor Project",
    category: "hotline",
    description: "Crisis intervention and suicide prevention for LGBTQ+ young people.",
    website: "https://www.thetrevorproject.org",
    focus: ["LGBTQ+", "Youth", "Crisis Support"]
  }
];

const categoryInfo = {
  organization: { label: "National Organization", icon: Building2, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
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

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || partner.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: "all", label: "All Partners", count: partners.length },
    { key: "organization", label: "Organizations", count: partners.filter(p => p.category === "organization").length },
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => {
            const catInfo = categoryInfo[partner.category];
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
                    {partner.description}
                  </p>
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPartners.length === 0 && (
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
