import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ArrowLeft, TrendingUp, Search, CheckCircle, AlertCircle, Copy, Share2, BarChart3, Zap } from "lucide-react";
import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function SEOTools() {
  const [location, setLocation] = useLocation();
  const user = getAuth();
  const [title, setTitle] = useState("Serenity House Boston - Sober Living Community");
  const [description, setDescription] = useState("Find safe, supportive sober living at Serenity House Boston. 24/7 staff support, community-focused recovery environment, and evidence-based treatment approach.");
  const [keywords, setKeywords] = useState("sober living Boston, recovery housing, halfway house, addiction recovery");
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [customKeyword, setCustomKeyword] = useState("");

  useEffect(() => {
    if (!user || user.role !== "provider") {
      setLocation("/for-providers");
    }
    window.scrollTo(0, 0);
  }, [user, setLocation]);

  const calculateSeoScore = () => {
    let score = 0;
    const checks = [];

    if (title.length >= 30 && title.length <= 60) {
      score += 25;
      checks.push("✓ Title length is optimal (30-60 characters)");
    } else if (title.length > 0) {
      checks.push("⚠ Title should be 30-60 characters (currently " + title.length + ")");
      score += 10;
    }

    if (description.length >= 120 && description.length <= 160) {
      score += 25;
      checks.push("✓ Meta description length is optimal (120-160 characters)");
    } else if (description.length > 0) {
      checks.push("⚠ Meta description should be 120-160 characters (currently " + description.length + ")");
      score += 10;
    }

    if (keywords.split(",").length >= 3) {
      score += 25;
      checks.push("✓ You have sufficient keywords (3+ phrases)");
    } else if (keywords.length > 0) {
      checks.push("⚠ Add at least 3 keyword phrases separated by commas");
      score += 10;
    }

    if (title.toLowerCase().includes("sober") || title.toLowerCase().includes("recovery")) {
      score += 15;
      checks.push("✓ Title includes recovery-related keywords");
    }

    if (description.toLowerCase().includes("boston") || description.toLowerCase().includes("property")) {
      checks.push("💡 Consider adding your location or property name to description");
    }

    if (score === 0) {
      checks.push("Start by adding a title, description, and keywords above");
    }

    setSeoScore(Math.min(score, 100));
    setSuggestions(checks);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/provider-dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">SEO Tools & Optimization</h1>
            <p className="text-muted-foreground">Optimize your listing for maximum search visibility</p>
          </div>
        </div>

        {/* SEO Score Card */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Your SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${seoScore * 2.827} 282.7`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{seoScore}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-muted-foreground">Optimize these elements to improve your search ranking</p>
                <Button onClick={calculateSeoScore} className="bg-primary hover:bg-primary/90 gap-2">
                  <BarChart3 className="w-4 h-4" /> Calculate Score
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Title Optimizer */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Page Title Optimizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Page Title (SEO Title Tag)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your page title..."
                className="bg-white/5 border-border/50 text-white"
                data-testid="input-seo-title"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{title.length} characters</span>
                <span>Optimal: 30-60 characters</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 border border-border rounded">
              <p className="text-sm text-white">
                <strong>Preview:</strong>
              </p>
              <p className="text-blue-400 text-sm truncate">{title || "Your page title will appear here"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Meta Description Optimizer */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Meta Description Optimizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Meta Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your meta description..."
                className="bg-white/5 border-border/50 text-white min-h-20"
                data-testid="input-seo-description"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{description.length} characters</span>
                <span>Optimal: 120-160 characters</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 border border-border rounded">
              <p className="text-sm text-white">
                <strong>Preview (Google):</strong>
              </p>
              <p className="text-blue-400 text-sm line-clamp-2">{description || "Your meta description will appear here"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Keyword Optimizer */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Keyword Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Target Keywords (comma-separated)</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="sober living, recovery housing, halfway house..."
                className="bg-white/5 border-border/50 text-white"
                data-testid="input-seo-keywords"
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas. Use long-tail keywords for better results (3-5 words per phrase).
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Add Custom Keyword</p>
              <div className="flex gap-2">
                <Input
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Type your own keyword..."
                  className="bg-white/5 border-border/50 text-white"
                  data-testid="input-custom-keyword"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && customKeyword.trim()) {
                      setKeywords((prev) => (prev ? `${prev}, ${customKeyword.trim()}` : customKeyword.trim()));
                      setCustomKeyword("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (customKeyword.trim()) {
                      setKeywords((prev) => (prev ? `${prev}, ${customKeyword.trim()}` : customKeyword.trim()));
                      setCustomKeyword("");
                    }
                  }}
                  className="bg-primary/50 hover:bg-primary/70 text-primary-foreground shrink-0"
                  data-testid="button-add-custom-keyword"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Suggested Keywords</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "sober living homes",
                  "recovery housing",
                  "halfway houses",
                  "sober living near me",
                  "addiction recovery",
                  "support groups recovery",
                  "transitional housing",
                  "men's recovery home",
                  "women's sober living",
                ].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      if (!keywords.includes(keyword)) {
                        setKeywords((prev) => (prev ? `${prev}, ${keyword}` : keyword));
                      }
                    }}
                    className="p-2 bg-primary/10 border border-primary/50 rounded text-xs text-primary hover:bg-primary/20 transition-colors text-left"
                    data-testid={`button-add-keyword-${keyword.replace(/\s+/g, "-")}`}
                  >
                    + {keyword}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Checklist */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-white">SEO Checklist & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    suggestion.startsWith("✓") ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {suggestion.startsWith("✓") ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : suggestion.startsWith("⚠") ? (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <p className={`text-sm ${suggestion.startsWith("✓") ? "text-emerald-200" : "text-gray-200"}`}>{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Preview */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" /> Social Media Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Facebook Preview */}
              <div className="p-4 bg-white/5 border border-border rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-2">FACEBOOK PREVIEW</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                  <p className="text-xs text-blue-400">soberstayhomes.com</p>
                </div>
              </div>

              {/* Twitter Preview */}
              <div className="p-4 bg-white/5 border border-border rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-2">TWITTER/X PREVIEW</p>
                <div className="space-y-2">
                  <p className="text-sm text-white line-clamp-3">{description}</p>
                  <p className="text-xs text-blue-400">{keywords.split(",")[0]?.trim()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" 
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
              console.log("SEO settings saved:", { title, description, keywords });
            }}
            data-testid="button-save-seo"
          >
            <CheckCircle className="w-4 h-4" /> {saved ? "✓ Saved!" : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => {
              navigator.clipboard.writeText(`Title: ${title}\nDescription: ${description}\nKeywords: ${keywords}`);
              alert("SEO settings copied to clipboard!");
            }}
            data-testid="button-copy-seo"
          >
            <Copy className="w-4 h-4" /> Copy Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}
