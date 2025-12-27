import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "wouter";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";

interface DisplayBlogPost {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  dateISO: string;
  readTime: string;
  featured?: boolean;
}

function transformBlogPost(post: BlogPost): DisplayBlogPost {
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
  
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.content.substring(0, 200) + "...",
    content: post.content,
    category: post.category,
    author: post.author,
    date: format(publishDate, "MMMM d, yyyy"),
    dateISO: publishDate.toISOString().split('T')[0],
    readTime: `${readTime} min read`,
    featured: false
  };
}

async function fetchBlogPosts(): Promise<DisplayBlogPost[]> {
  const response = await fetch("/api/blog-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  const posts: BlogPost[] = await response.json();
  const transformed = posts.map(transformBlogPost);
  if (transformed.length > 0) {
    transformed[0].featured = true;
  }
  return transformed;
}

async function fetchBlogPost(slug: string): Promise<DisplayBlogPost | null> {
  const response = await fetch(`/api/blog-posts/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch blog post");
  }
  const post: BlogPost = await response.json();
  return transformBlogPost(post);
}

export function BlogHub() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: blogPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
  });

  const { data: currentPost, isLoading: postLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
  });

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  if (slug) {
    if (postLoading) {
      return (
        <Layout>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </Layout>
      );
    }

    if (!currentPost) {
      return (
        <Layout>
          <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <article className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blog
            </Link>
            
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {currentPost.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {currentPost.title}
              </h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{currentPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentPost.readTime}</span>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                {currentPost.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <p key={i} className="font-bold text-white">{paragraph.replace(/\*\*/g, '')}</p>;
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
                        {items.map((item, j) => (
                          <li key={j}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>;
                })}
              </div>

              <div className="border-t border-border mt-12 pt-8">
                <h3 className="text-xl font-bold text-white mb-4">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {blogPosts.filter(p => String(p.id) !== String(currentPost.id)).slice(0, 2).map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer h-full">
                        <CardContent className="p-4">
                          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 text-xs">
                            {post.category}
                          </Badge>
                          <h4 className="font-bold text-white mb-2">{post.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": currentPost.title,
                    "description": currentPost.excerpt,
                    "author": {
                      "@type": "Organization",
                      "name": currentPost.author
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "Sober Stay",
                      "url": "https://soberstay.com"
                    },
                    "datePublished": currentPost.dateISO,
                    "url": `https://soberstay.com/blog/${currentPost.slug}`,
                    "articleSection": currentPost.category
                  })
                }}
              />

              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://soberstay.com"
                      },
                      {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://soberstay.com/blog"
                      },
                      {
                        "@type": "ListItem",
                        "position": 3,
                        "name": currentPost.title,
                        "item": `https://soberstay.com/blog/${currentPost.slug}`
                      }
                    ]
                  })
                }}
              />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (postsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sober Stay Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, guides, and stories to support your recovery journey.
              </p>
              
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-white/10"
                  data-testid="input-blog-search"
                />
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-primary" : "border-white/10"}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-primary" : "border-white/10"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredPost && !searchQuery && !selectedCategory && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Featured</h2>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        {featuredPost.category}
                      </Badge>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {featuredPost.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{featuredPost.date}</span>
                        <span>•</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory || "All Articles"}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {blogPosts.length === 0 
                      ? "No articles published yet. Check back soon!" 
                      : "No articles found. Try a different search."}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.filter(p => !p.featured || searchQuery || selectedCategory).map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                        <CardContent className="p-6 flex flex-col h-full">
                          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 w-fit">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-white mb-3">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Sober Living Home?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse sober living homes and start your recovery journey today.
            </p>
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Search Homes <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default BlogHub;
