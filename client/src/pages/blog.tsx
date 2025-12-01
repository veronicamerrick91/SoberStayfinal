import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Recovery Tips for New Residents",
    excerpt: "Essential advice for starting your journey in a sober living home and building a strong recovery foundation.",
    content: "Starting a new chapter in your recovery journey can feel overwhelming, but you're taking an important step toward a healthier future. Here are proven strategies that help new residents thrive in sober living environments...",
    author: "Sarah Mitchell",
    date: "Dec 1, 2025",
    category: "Recovery Tips",
  },
  {
    id: "2",
    title: "Understanding Sober Living Homes",
    excerpt: "Learn what sober living homes are, how they differ from treatment facilities, and what to expect when you arrive.",
    content: "Sober living homes are transitional housing facilities that provide a supportive environment for individuals committed to recovery. Unlike treatment centers, they focus on daily living skills and peer support...",
    author: "James Rodriguez",
    date: "Nov 28, 2025",
    category: "Education",
  },
  {
    id: "3",
    title: "Building Community in Recovery",
    excerpt: "Discover how meaningful connections and peer support create the foundation for long-term sobriety.",
    content: "One of the most powerful aspects of sober living is the community you build with others who understand your journey. Shared experiences create deep bonds that support lasting recovery...",
    author: "Emma Wilson",
    date: "Nov 25, 2025",
    category: "Community",
  },
  {
    id: "4",
    title: "Finding the Right Recovery Home for You",
    excerpt: "A comprehensive guide to evaluating sober living homes and choosing the perfect fit for your recovery needs.",
    content: "Choosing a sober living home is a personal decision that depends on your unique recovery goals and lifestyle. Consider these factors when evaluating different options...",
    author: "Marcus Johnson",
    date: "Nov 22, 2025",
    category: "Guidance",
  },
  {
    id: "5",
    title: "Managing Mental Health in Recovery",
    excerpt: "Practical strategies for addressing anxiety, depression, and emotional challenges while maintaining sobriety.",
    content: "Mental health and addiction recovery are deeply interconnected. Many individuals in recovery face challenges with anxiety or depression, which require specialized attention and support...",
    author: "Dr. Lisa Chen",
    date: "Nov 19, 2025",
    category: "Mental Health",
  },
  {
    id: "6",
    title: "Success Stories: Real Journeys to Recovery",
    excerpt: "Inspiring stories from individuals who transformed their lives through sober living and community support.",
    content: "Real people, real recoveries. These success stories demonstrate the power of commitment, community, and the right support system in achieving lasting sobriety...",
    author: "Sober Stay Team",
    date: "Nov 16, 2025",
    category: "Stories",
  },
];

export function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Recovery Tips", "Education", "Community", "Guidance", "Mental Health", "Stories"];
  
  const filteredPosts = selectedCategory === "All" 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-transparent pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Sober Stay Blog</h1>
            <p className="text-lg text-muted-foreground">Resources, stories, and guidance for your recovery journey</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPost ? (
              <Card className="bg-card border-border mb-8">
                <CardContent className="pt-8">
                  <Button 
                    onClick={() => setSelectedPost(null)} 
                    variant="ghost" 
                    className="mb-4 text-primary hover:text-primary/80"
                  >
                    ← Back to Articles
                  </Button>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedPost.date}
                    </div>
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{selectedPost.category}</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">{selectedPost.excerpt}</p>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">Share your recovery journey or ask questions in our community forum.</p>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Join the Conversation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group" onClick={() => setSelectedPost(post)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">{post.category}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {post.date}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                            Read Article <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary/10 border-t border-b border-primary/20 py-12 mt-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">Subscribe to our newsletter for recovery tips, success stories, and community updates.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-white placeholder:text-muted-foreground"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
