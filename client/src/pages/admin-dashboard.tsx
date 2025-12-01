import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Sober Living Homes: What to Expect",
      excerpt: "A comprehensive guide to what sober living homes are, how they differ from treatment facilities, and what you can expect when moving in.",
      author: "Recovery Coach Emma",
      date: "December 15, 2024",
      category: "Recovery",
      readTime: 5,
      featured: true
    },
    {
      id: 2,
      title: "Building a Strong Recovery Network",
      excerpt: "Tips and strategies for developing meaningful connections that support long-term recovery. Learn how community can be your greatest asset.",
      author: "Peer Support Specialist Alex",
      date: "December 10, 2024",
      category: "Peer Support",
      readTime: 7
    },
    {
      id: 3,
      title: "Navigating Housing Applications: A Step-by-Step Guide",
      excerpt: "Everything you need to know about applying to sober living homes, what information to prepare, and how to present yourself to providers.",
      author: "Recovery Coach Emma",
      date: "December 5, 2024",
      category: "Housing",
      readTime: 6
    },
    {
      id: 4,
      title: "Managing Triggers in Early Recovery",
      excerpt: "Identify common triggers and learn practical coping strategies to stay strong during challenging moments in your recovery journey.",
      author: "Licensed Therapist James",
      date: "November 28, 2024",
      category: "Wellness",
      readTime: 8
    },
    {
      id: 5,
      title: "The Importance of Routine in Recovery",
      excerpt: "Discover how establishing healthy daily routines supports accountability, stability, and long-term recovery success.",
      author: "Recovery Coach Emma",
      date: "November 20, 2024",
      category: "Wellness",
      readTime: 5
    },
    {
      id: 6,
      title: "Provider Spotlight: Best Practices in Sober Living Management",
      excerpt: "Learn from successful sober living providers about creating supportive, safe environments that foster recovery and community.",
      author: "Platform Admin",
      date: "November 15, 2024",
      category: "Provider Resources",
      readTime: 6
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-bold text-white">Sober Stay Blog</h1>
            <p className="text-lg text-muted-foreground">
              Resources, insights, and stories to support your recovery journey
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.find(p => p.featured) && (
            <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
              <CardContent className="p-8">
                <Badge className="bg-primary text-primary-foreground mb-4">Featured</Badge>
                <h2 className="text-2xl font-heading font-bold text-white mb-3">
                  {blogPosts.find(p => p.featured)?.title}
                </h2>
                <p className="text-gray-300 mb-4">
                  {blogPosts.find(p => p.featured)?.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blogPosts.find(p => p.featured)?.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blogPosts.find(p => p.featured)?.author}
                  </div>
                  <span>{blogPosts.find(p => p.featured)?.readTime} min read</span>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Read Article
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Blog Posts Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">Latest Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.filter(p => !p.featured).map((post) => (
                <Card key={post.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
                    </div>
                    <CardTitle className="text-white text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-white/5 border-border">
            <CardHeader>
              <CardTitle className="text-white">Stay Updated</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Subscribe to our newsletter for weekly tips, resources, and recovery insights delivered to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
