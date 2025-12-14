import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "wouter";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, User } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: string;
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

const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "what-to-expect-first-month-sober-living",
    title: "What to Expect in Your First Month of Sober Living",
    excerpt: "Moving into a sober living home can feel overwhelming. Here's everything you need to know about your first 30 days and how to make the most of this important transition.",
    content: `Moving into a sober living home is a significant step in your recovery journey. The first month can feel like a whirlwind of new experiences, rules, and relationships. Here's what you can expect and how to navigate this transition successfully.

## Week 1: Adjustment Period

The first week is all about settling in. You'll be getting to know your housemates, learning the house rules, and establishing your daily routine. It's normal to feel a mix of excitement and anxiety during this time.

**What you'll experience:**
- Orientation with the house manager
- Introduction to housemates
- Learning house rules and expectations
- Setting up your living space
- Attending your first house meeting

**Tips for success:**
- Ask questions when you're unsure
- Be open and friendly with housemates
- Start attending recovery meetings right away
- Keep a journal to process your feelings

## Week 2: Building Routine

By the second week, you should start settling into a routine. This is when the real work of recovery living begins.

**Focus areas:**
- Establishing a sleep schedule
- Creating morning and evening routines
- Finding local meetings that work for you
- Beginning job search or work schedule
- Connecting with a sponsor if you haven't already

## Week 3: Deepening Connections

The third week is often when you start forming genuine connections with your housemates. These relationships can become a crucial part of your support network.

**What's happening:**
- Deeper conversations with housemates
- Finding your "tribe" within the house
- Contributing more actively to house life
- Feeling more comfortable with the environment

## Week 4: Looking Ahead

By the end of your first month, you should feel more settled and can start thinking about your longer-term goals.

**Reflect on:**
- What's working well for you?
- What challenges have you faced?
- What goals do you want to set for month two?
- How has your perspective on recovery evolved?

## Common Challenges and Solutions

**Feeling homesick:** This is completely normal. Stay connected with supportive family and friends while building your new community.

**Conflicts with housemates:** Address issues directly but respectfully. Your house manager can help mediate if needed.

**Urges or cravings:** Use your support network. Call your sponsor, attend an extra meeting, or talk to a housemate.

**Boredom:** Stay busy with positive activities. Many sober living homes organize group outings and activities.

## The Bottom Line

Your first month in sober living sets the foundation for your continued recovery. Be patient with yourself, stay engaged with the community, and remember that everyone in the house has been exactly where you are now.

The structure and support of sober living exist to help you succeed. Take advantage of every resource available to you, and don't be afraid to ask for help when you need it.`,
    category: "Sober Living Tips",
    author: "Sober Stay Team",
    date: "December 10, 2025",
    dateISO: "2025-12-10",
    readTime: "8 min read",
    featured: true
  },
  {
    id: "2",
    slug: "how-to-choose-right-sober-living-home",
    title: "How to Choose the Right Sober Living Home for You",
    excerpt: "Finding the perfect sober living home requires careful consideration. Learn what factors matter most and how to evaluate your options effectively.",
    content: `Choosing the right sober living home is one of the most important decisions you'll make in early recovery. The right environment can support your growth, while the wrong fit can create unnecessary challenges. Here's how to find the perfect match.

## Understanding Your Needs

Before you start your search, take time to understand what you need from a sober living environment.

**Questions to ask yourself:**
- Do I prefer more structure or independence?
- Is location near family important to me?
- What's my budget?
- Do I have any specific needs (LGBTQ+ affirming, faith-based, etc.)?
- Am I looking for additional services like job assistance?

## Key Factors to Evaluate

### 1. Location

Location affects more than just convenience. Consider:
- Proximity to work or school opportunities
- Access to recovery meetings
- Distance from triggers or unhealthy environments
- Transportation options
- Nearby support networks (family, sponsor, treatment providers)

### 2. Cost and Value

Sober living costs vary widely. When evaluating price:
- Compare what's included in the monthly fee
- Ask about additional costs (utilities, food, etc.)
- Understand payment expectations
- Check if scholarships or sliding scale fees are available
- Consider the value, not just the cost

### 3. House Culture and Community

The community you'll be living with matters enormously:
- Visit and meet current residents if possible
- Ask about the typical resident profile
- Understand the house's recovery philosophy
- Inquire about house activities and community building
- Trust your gut feeling about the atmosphere

### 4. Structure and Rules

Different homes offer different levels of structure:
- Drug testing frequency and type
- Curfew policies
- Meeting attendance requirements
- Work or school requirements
- Guest policies
- Phone and technology rules

### 5. Staff and Support

Quality of support can make or break your experience:
- Who is the house manager and what's their background?
- What hours is staff available?
- What happens in emergencies?
- Are there connections to additional resources?

## Red Flags to Watch For

Be cautious if you encounter:
- Reluctance to answer questions
- No drug testing policy
- Overcrowded conditions
- Unprofessional management
- Pressure to commit immediately
- Lack of clear rules or structure
- No references or reviews available

## Making Your Decision

After gathering information:
1. Visit your top 2-3 choices
2. Talk to current or former residents
3. Trust your instincts about where you feel safest
4. Consider starting with a shorter commitment if unsure
5. Remember: you can always move if it's not the right fit

The right sober living home will feel supportive, structured, and safe. Take your time with this decision – it's worth getting right.`,
    category: "Finding Housing",
    author: "Sober Stay Team",
    date: "December 8, 2025",
    dateISO: "2025-12-08",
    readTime: "7 min read"
  },
  {
    id: "3",
    slug: "building-healthy-relationships-recovery",
    title: "Building Healthy Relationships in Recovery",
    excerpt: "Recovery transforms not just you, but how you relate to others. Learn how to build authentic, supportive relationships in your sober living community and beyond.",
    content: `One of the most rewarding aspects of recovery is learning to build genuine, healthy relationships. In sober living, you have a unique opportunity to practice these skills in a supportive environment.

## Why Relationships Matter in Recovery

Healthy relationships are crucial to long-term sobriety:
- They provide accountability and support
- They reduce isolation and loneliness
- They model healthy coping and communication
- They give us purpose and connection

## Starting Fresh: Relationships in Sober Living

Your sober living community is the perfect place to practice new relationship skills.

### With Housemates

**Building connections:**
- Be genuinely curious about others' stories
- Share your own experience appropriately
- Participate in group activities
- Offer help when you can
- Respect boundaries

**Handling conflicts:**
- Address issues directly but kindly
- Use "I" statements
- Listen to understand, not to respond
- Involve house management if needed
- Practice forgiveness

### With Staff

- Be honest and transparent
- Ask for help when you need it
- Follow through on commitments
- Communicate proactively about challenges

## Rebuilding Family Relationships

Recovery often means repairing damaged relationships.

**Tips for family reconciliation:**
- Be patient – trust takes time to rebuild
- Make consistent, reliable efforts
- Acknowledge past hurts
- Set healthy boundaries
- Consider family therapy

**What to avoid:**
- Making promises you can't keep
- Expecting immediate forgiveness
- Oversharing your recovery journey
- Forcing the pace of reconnection

## Romantic Relationships in Early Recovery

Most recovery experts recommend avoiding new romantic relationships in the first year of sobriety.

**Why wait?**
- Focus your energy on recovery
- Learn who you are sober first
- Avoid emotional triggers
- Build a solid foundation

**If you're already in a relationship:**
- Communicate openly about your recovery
- Set boundaries around substances
- Attend couples counseling if helpful
- Prioritize your sobriety

## Building a Sober Support Network

Beyond your sober living community, build a broader support network:
- Sponsor or mentor
- Home group in 12-step programs
- Sober friends and activities
- Recovery-supportive family members
- Therapist or counselor

## Red Flags in Relationships

Be aware of relationships that may threaten your recovery:
- People who pressure you to use
- Relationships based on caretaking or enabling
- Isolation from your support network
- High drama or chaos
- Dishonesty or manipulation

Healthy relationships support your growth and sobriety. If a relationship consistently drains you or threatens your recovery, it may be time to reassess.

## The Bottom Line

Building healthy relationships is a skill that improves with practice. Your sober living community provides a safe space to learn and grow. Be patient with yourself and others, and remember that authentic connection is one of the greatest gifts of recovery.`,
    category: "Recovery Life",
    author: "Sober Stay Team",
    date: "December 5, 2025",
    dateISO: "2025-12-05",
    readTime: "6 min read"
  },
  {
    id: "4",
    slug: "sober-living-vs-halfway-house-differences",
    title: "Sober Living vs. Halfway House: What's the Difference?",
    excerpt: "Understanding the differences between sober living homes and halfway houses can help you choose the right option for your recovery journey.",
    content: `When researching recovery housing options, you'll often hear the terms "sober living home" and "halfway house" used interchangeably. While they share similarities, there are important differences that can affect your recovery experience.

## What Is a Sober Living Home?

Sober living homes are residential facilities that provide a structured, substance-free living environment. They're typically privately owned and operated, with residents paying rent to live there.

**Key characteristics:**
- Voluntary participation
- Private ownership and operation
- Rent-based (residents pay monthly)
- Varying levels of structure
- No formal treatment services
- Focus on peer support and independent living

## What Is a Halfway House?

Halfway houses, also known as transitional housing or residential reentry centers, are often government-funded or nonprofit facilities that serve as a step between incarceration or intensive treatment and independent living.

**Key characteristics:**
- May be court-mandated
- Often government or nonprofit funded
- May be free or reduced cost
- More structured programming
- May include formal treatment services
- Often time-limited stays

## Key Differences

### Funding and Cost

**Sober Living:**
- Private pay (resident pays rent)
- Costs range from $500-$2,500+/month
- Some accept insurance for services
- Scholarships sometimes available

**Halfway House:**
- Often government or grant funded
- May be free or low-cost
- Sometimes covered by criminal justice system
- Income-based sliding scales common

### Level of Structure

**Sober Living:**
- Structure varies by home
- More flexibility and independence
- Rules focused on maintaining sobriety
- Residents typically can work or attend school

**Halfway House:**
- Generally more structured
- May have mandatory programming
- Stricter schedules and oversight
- Often includes case management

### Admission Requirements

**Sober Living:**
- Typically voluntary
- Usually requires sobriety at move-in
- May require treatment completion
- Application and interview process

**Halfway House:**
- May be court-mandated
- Often serves specific populations
- May accept individuals directly from incarceration
- Referral-based admission common

### Services Provided

**Sober Living:**
- Peer support community
- House meetings
- Drug testing
- Some offer case management or job assistance

**Halfway House:**
- Often includes formal programming
- May have on-site counseling
- Case management services
- Job training or placement
- Life skills programming

### Length of Stay

**Sober Living:**
- No typical time limit
- Residents stay as long as needed
- Average stay 3-12 months
- Some residents stay years

**Halfway House:**
- Often time-limited (30-180 days)
- May be determined by court or program
- Extensions sometimes possible
- Focus on transitioning to independence

## Which Is Right for You?

**Consider sober living if:**
- You're seeking voluntary recovery support
- You want more independence and flexibility
- You're leaving treatment and need transitional support
- You can afford monthly rent
- You want to choose your living environment

**Consider a halfway house if:**
- You're transitioning from incarceration
- You need structured programming
- Cost is a significant barrier
- You've been referred by court or treatment
- You need more intensive support services

## The Bottom Line

Both sober living homes and halfway houses serve important roles in the recovery continuum. The right choice depends on your individual circumstances, needs, and where you are in your recovery journey.

Regardless of which option you choose, the goal is the same: a safe, supportive environment where you can build the foundation for lasting sobriety.`,
    category: "Recovery Education",
    author: "Sober Stay Team",
    date: "December 1, 2025",
    dateISO: "2025-12-01",
    readTime: "7 min read"
  },
  {
    id: "5",
    slug: "employment-tips-sober-living",
    title: "Finding Employment While in Sober Living: A Complete Guide",
    excerpt: "Getting a job while in sober living can feel daunting. Learn practical strategies for job searching, interviewing, and succeeding at work during early recovery.",
    content: `Finding and maintaining employment is a crucial part of the sober living experience. Not only does it provide financial independence, but it also gives structure, purpose, and builds self-esteem. Here's how to navigate the job search in early recovery.

## When to Start Looking

Most sober living homes require residents to find employment within 30-60 days of move-in. However, the right timing depends on your individual situation.

**Consider these factors:**
- Your stability in recovery
- Recommendations from treatment providers
- House requirements
- Your financial situation
- Previous work history

## Overcoming Common Barriers

### Employment Gaps

**How to address:**
- Be honest but brief about gaps
- Focus on what you've learned and how you've grown
- Emphasize your current stability and motivation
- Highlight any volunteer work or training during gaps

### Criminal Record

**Know your rights:**
- Many states have "ban the box" laws
- Employers can't ask about arrests without convictions
- Some industries are more recovery-friendly
- Consider expungement if eligible

**Strategies:**
- Research recovery-friendly employers
- Be prepared to discuss briefly and positively
- Focus on rehabilitation and growth
- Seek jobs at companies that hire people with records

### Lack of Recent References

**Solutions:**
- Use references from treatment or sober living
- Include volunteer supervisors
- Ask for references from 12-step sponsors
- Be honest about your situation

## Job Search Strategies

### Recovery-Friendly Industries

Some industries are known for being more accepting of people in recovery:
- Food service and hospitality
- Construction and trades
- Retail
- Healthcare support roles
- Peer support services
- Landscaping and maintenance

### Using Your Network

Your recovery community can be a valuable job resource:
- Ask housemates about their employers
- Attend sober networking events
- Connect with recovery community job boards
- Ask your sponsor about opportunities

### Online Job Search

**Tips for success:**
- Update your LinkedIn profile
- Use job boards like Indeed, ZipRecruiter
- Check local nonprofit job programs
- Look for "second chance" employers

## Interview Preparation

### Handling the "Tell Me About Yourself" Question

Focus on:
- Your skills and qualifications
- Your enthusiasm for the opportunity
- Your reliability and work ethic
- Brief, positive mention of personal growth (optional)

### The Gap/Recovery Conversation

**If asked directly:**
- Be honest but brief
- Focus on your current stability
- Emphasize what you've learned
- Pivot to your qualifications and enthusiasm

**Sample response:**
"I took time off to focus on personal health challenges. During that time, I developed strong self-discipline, learned to work well with others, and gained clarity about my goals. I'm now in a stable living situation and excited to bring my full energy to this role."

### Questions to Ask

Show interest and assess fit:
- What does a typical day look like?
- How would you describe the team culture?
- What are the opportunities for growth?
- What are the next steps in the process?

## Succeeding at Work in Recovery

### Protecting Your Recovery

- Keep meeting attendance a priority
- Build sober relationships at work
- Have a plan for work events with alcohol
- Communicate with your sponsor about work challenges

### Managing Stress

- Use healthy coping skills
- Take breaks when needed
- Don't overcommit too soon
- Balance work with recovery activities

### Building Your Career

- Show up reliably and on time
- Be willing to learn and grow
- Seek feedback and mentorship
- Set realistic goals for advancement

## Resources for Job Seekers in Recovery

- **Goodwill Industries** - Job training and placement
- **America Works** - Employment services for people with barriers
- **Department of Labor** - Career One-Stop centers
- **Local recovery community organizations** - Often have job boards

The bottom line: Finding employment in recovery is absolutely possible. It may take persistence and creativity, but the right opportunity is out there. Stay focused on your recovery first, and the rest will follow.`,
    category: "Career & Finance",
    author: "Sober Stay Team",
    date: "November 28, 2025",
    dateISO: "2025-11-28",
    readTime: "9 min read"
  }
];

const categories = Array.from(new Set(blogPosts.map(post => post.category)));

export function BlogHub() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const currentPost = slug ? blogPosts.find(post => post.slug === slug) : null;

  if (currentPost) {
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
                  {blogPosts.filter(p => p.id !== currentPost.id).slice(0, 2).map(post => (
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

              {/* Article Schema for SEO */}
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

              {/* BreadcrumbList Schema */}
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

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
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

        {/* Categories */}
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

        {/* Featured Post */}
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

        {/* All Posts */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory || "All Articles"}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found. Try a different search.</p>
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

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Sober Living Home?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse verified sober living homes and start your recovery journey today.
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
