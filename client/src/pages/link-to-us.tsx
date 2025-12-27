import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, Image, FileText, ExternalLink, Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { useToast } from "@/hooks/use-toast";

function getBadgeHtml(siteUrl: string, variant: "dark" | "light" | "teal") {
  return `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer" title="Find Sober Living Homes on Sober Stay">
  <img src="${siteUrl}/badges/sober-stay-${variant}.svg" alt="Find Sober Living on Sober Stay" width="200" height="50" />
</a>`;
}

function getWidgetCode(siteUrl: string) {
  return `<!-- Sober Stay Search Widget -->
<div id="sober-stay-widget" style="max-width: 400px; font-family: system-ui, sans-serif;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; padding: 24px; color: white;">
    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Find Sober Living Homes</h3>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #94a3b8;">Powered by Sober Stay</p>
    <form action="${siteUrl}/browse" method="get" target="_blank">
      <input 
        type="text" 
        name="location" 
        placeholder="Enter city or state..."
        style="width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: white; font-size: 14px; box-sizing: border-box; margin-bottom: 12px;"
      />
      <button 
        type="submit"
        style="width: 100%; padding: 12px 16px; border-radius: 8px; border: none; background: #14b8a6; color: white; font-size: 14px; font-weight: 600; cursor: pointer;"
      >
        Search Sober Living Homes
      </button>
    </form>
  </div>
</div>
<!-- End Sober Stay Widget -->`;
}

function getProviderEmbedCode(siteUrl: string, providerId: string, propertyName: string) {
  return `<!-- Sober Stay Listing Badge -->
<a href="${siteUrl}/property/${providerId}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px; padding: 16px 20px; color: white; font-family: system-ui, sans-serif;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="background: #14b8a6; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div>
        <div style="font-size: 12px; color: #94a3b8;">Listed on Sober Stay</div>
        <div style="font-size: 14px; font-weight: 600;">${propertyName}</div>
      </div>
    </div>
  </div>
</a>
<!-- End Sober Stay Badge -->`;
}

export function LinkToUs() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [providerName, setProviderName] = useState("Your Sober Living Home");
  const [providerId, setProviderId] = useState("1");
  const { toast } = useToast();

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://soberstay.com";

  useDocumentMeta({
    title: "Link to Sober Stay | Badges, Widgets & Embed Codes",
    description: "Add a Sober Stay badge or widget to your website. Help others find sober living homes while supporting our recovery housing directory."
  });

  const badges = useMemo(() => [
    {
      id: "badge-dark",
      name: "Dark Badge (Recommended)",
      description: "Best for light-colored websites",
      html: getBadgeHtml(siteUrl, "dark"),
      preview: (
        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-700">
          <Heart className="w-5 h-5 text-teal-400" />
          <div className="text-left">
            <div className="text-sm font-semibold">Find Housing on</div>
            <div className="text-xs text-teal-400">SoberStay.com</div>
          </div>
        </div>
      )
    },
    {
      id: "badge-light",
      name: "Light Badge",
      description: "Best for dark-colored websites",
      html: getBadgeHtml(siteUrl, "light"),
      preview: (
        <div className="bg-white text-slate-900 px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-200">
          <Heart className="w-5 h-5 text-teal-600" />
          <div className="text-left">
            <div className="text-sm font-semibold">Find Housing on</div>
            <div className="text-xs text-teal-600">SoberStay.com</div>
          </div>
        </div>
      )
    },
    {
      id: "badge-teal",
      name: "Teal Badge",
      description: "Matches the Sober Stay brand",
      html: getBadgeHtml(siteUrl, "teal"),
      preview: (
        <div className="bg-teal-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Heart className="w-5 h-5 text-white" />
          <div className="text-left">
            <div className="text-sm font-semibold">Find Housing on</div>
            <div className="text-xs text-teal-100">SoberStay.com</div>
          </div>
        </div>
      )
    }
  ], [siteUrl]);

  const textLinks = useMemo(() => [
    {
      id: "text-simple",
      name: "Simple Text Link",
      description: "Basic link to Sober Stay",
      html: `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer">Find Sober Living Homes on Sober Stay</a>`
    },
    {
      id: "text-resource",
      name: "Resource Link",
      description: "For resource pages and directories",
      html: `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer">Sober Stay</a> - Find sober living homes and recovery housing nationwide.`
    },
    {
      id: "text-browse",
      name: "Browse Link",
      description: "Direct link to browse listings",
      html: `<a href="${siteUrl}/browse" target="_blank" rel="noopener noreferrer">Browse Sober Living Homes</a>`
    },
    {
      id: "text-california",
      name: "California Link",
      description: "State-specific link example",
      html: `<a href="${siteUrl}/sober-living/california" target="_blank" rel="noopener noreferrer">Sober Living Homes in California</a>`
    }
  ], [siteUrl]);

  const widgetCode = useMemo(() => getWidgetCode(siteUrl), [siteUrl]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the code manually",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-16 pb-12 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="link-to-us-h1">
              Link to Sober Stay
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Help others find quality recovery housing by adding a Sober Stay badge or link to your website. 
              Choose from badges, text links, or an embeddable search widget.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="badges" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="badges" className="gap-2" data-testid="tab-badges">
              <Image className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2" data-testid="tab-text">
              <FileText className="w-4 h-4" />
              Text Links
            </TabsTrigger>
            <TabsTrigger value="widget" className="gap-2" data-testid="tab-widget">
              <Code className="w-4 h-4" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="provider" className="gap-2" data-testid="tab-provider">
              <Heart className="w-4 h-4" />
              Providers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Badge Embed Codes</h2>
                <p className="text-muted-foreground">
                  Copy and paste these badges onto your website to link to Sober Stay.
                </p>
              </div>

              {badges.map(badge => (
                <Card key={badge.id} className="bg-card border-border" data-testid={`card-${badge.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <CardDescription>{badge.description}</CardDescription>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        {badge.preview}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{badge.html}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 gap-2"
                        onClick={() => copyToClipboard(badge.html, badge.id)}
                        data-testid={`button-copy-${badge.id}`}
                      >
                        {copiedId === badge.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Text Link Options</h2>
                <p className="text-muted-foreground">
                  Simple text links to include in your content, resource pages, or footer.
                </p>
              </div>

              {textLinks.map(link => (
                <Card key={link.id} className="bg-card border-border" data-testid={`card-${link.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{link.name}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">Preview: </span>
                      <span 
                        className="text-primary underline cursor-pointer"
                        dangerouslySetInnerHTML={{ __html: link.html.replace(/href="[^"]*"/g, 'href="#"') }}
                      />
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{link.html}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 gap-2"
                        onClick={() => copyToClipboard(link.html, link.id)}
                        data-testid={`button-copy-${link.id}`}
                      >
                        {copiedId === link.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="widget">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Embeddable Search Widget</h2>
                <p className="text-muted-foreground">
                  Add a search widget to your site that lets visitors search for sober living homes.
                </p>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Search Widget Preview</CardTitle>
                  <CardDescription>This is how the widget will appear on your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="max-w-[400px] w-full">
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-1">Find Sober Living Homes</h3>
                        <p className="text-sm text-slate-400 mb-4">Powered by Sober Stay</p>
                        <input
                          type="text"
                          placeholder="Enter city or state..."
                          className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm mb-3"
                          disabled
                        />
                        <Button className="w-full" disabled>
                          Search Sober Living Homes
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                      <code>{widgetCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 gap-2"
                      onClick={() => copyToClipboard(widgetCode, "widget")}
                      data-testid="button-copy-widget"
                    >
                      {copiedId === "widget" ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="provider">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Provider Listing Badge</h2>
                <p className="text-muted-foreground">
                  If you're a sober living provider with a listing on Sober Stay, add this badge to your website 
                  to link back to your listing and build credibility.
                </p>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Customize Your Badge</CardTitle>
                  <CardDescription>Enter your listing details to generate a personalized embed code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Your Property Name
                      </label>
                      <input
                        type="text"
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-white"
                        placeholder="e.g., Serenity House"
                        data-testid="input-provider-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Your Listing ID
                      </label>
                      <input
                        type="text"
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-white"
                        placeholder="e.g., 123"
                        data-testid="input-provider-id"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Find this in your listing URL: /property/[ID]
                      </p>
                    </div>
                  </div>

                  <div className="py-4">
                    <p className="text-sm font-medium text-white mb-3">Preview:</p>
                    <div className="flex justify-center">
                      <a 
                        href="#" 
                        className="inline-block no-underline"
                        onClick={(e) => e.preventDefault()}
                      >
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg px-5 py-4 text-white">
                          <div className="flex items-center gap-3">
                            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Listed on Sober Stay</div>
                              <div className="text-sm font-semibold">{providerName}</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto max-h-60">
                      <code>{getProviderEmbedCode(siteUrl, providerId, providerName)}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 gap-2"
                      onClick={() => copyToClipboard(getProviderEmbedCode(siteUrl, providerId, providerName), "provider")}
                      data-testid="button-copy-provider"
                    >
                      {copiedId === "provider" ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Why Add a Backlink?
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• <strong className="text-white">Build Trust:</strong> Show visitors your home is listed on a verified platform</li>
                  <li>• <strong className="text-white">Improve SEO:</strong> Quality backlinks help both sites rank better</li>
                  <li>• <strong className="text-white">Drive Traffic:</strong> Get more visibility for your listing</li>
                  <li>• <strong className="text-white">Support Recovery:</strong> Help more people find quality housing</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default LinkToUs;
