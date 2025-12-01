import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";

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
    title: "Recovery Tips for New Residents: 10 Strategies for Success in Sober Living Homes",
    excerpt: "Essential advice for starting your journey in a sober living home and building a strong recovery foundation. Learn proven strategies for thriving in recovery housing.",
    content: `Starting a new chapter in a sober living home can feel overwhelming, but you're taking an important step toward lasting recovery and a healthier future. Whether you're transitioning from treatment or starting fresh, these proven strategies will help you build a strong foundation for sobriety.

## Essential Recovery Tips for New Residents

1. **Build Strong Relationships with Housemates**
Your fellow residents understand the recovery journey like no one else. Take time to connect authentically, attend house meetings together, and support each other through challenges. These peer connections become the backbone of your recovery community.

2. **Establish Daily Routines**
Consistency creates stability. Wake up at the same time, eat meals together, attend support group meetings regularly, and maintain personal hygiene rituals. Structure helps rewire your brain and reduces triggers.

3. **Commit to House Rules**
Sober living homes have guidelines for curfews, chores, and substance testing. Following these rules isn't punishment—it's the framework that keeps everyone safe and accountable.

4. **Attend Meetings Consistently**
Whether AA, NA, SMART Recovery, or other support groups, regular meeting attendance is crucial. Most sober living programs require 3-7 meetings per week. This isn't optional—it's your lifeline.

5. **Find a Sponsor or Mentor**
Having an experienced mentor who's walked the recovery path accelerates your progress. They provide guidance, accountability, and hope based on lived experience.

6. **Practice Honest Communication**
Share your struggles, celebrate your wins, and ask for help when needed. Vulnerability is strength in recovery, not weakness.

7. **Develop Healthy Coping Skills**
Replace old habits with exercise, journaling, meditation, creative hobbies, or outdoor activities. These healthy outlets manage stress without substances.

8. **Set Realistic Goals**
Recovery is about incremental progress. Start with 30-day goals, then 90 days, then one year. Each milestone builds confidence and commitment.

9. **Give Back to Others**
Once you've stabilized, help newer residents. Teaching others reinforces your own recovery and creates meaningful purpose.

10. **Stay Connected to Your Why**
Remember why you chose recovery. Keep photos, journal entries, or reminders of what sobriety means to you and what you're working toward.

## The Power of Accountability in Sober Living

Living with others in recovery creates natural accountability. Random drug testing, house meetings, and peer support ensure you stay on track. This structure is exactly what many people need during early recovery.

## Your Recovery Timeline Matters

Most successful residents stay in sober living homes for 6-24 months. This gives you time to rebuild relationships, reestablish employment, develop healthy habits, and create a support network that will sustain lifelong sobriety.

Start today. Your best recovery is waiting.`,
    author: "Sarah Mitchell, Recovery Counselor",
    date: "Dec 1, 2025",
    category: "Recovery Tips",
  },
  {
    id: "2",
    title: "What Are Sober Living Homes? Complete Guide to Transitional Housing",
    excerpt: "Learn what sober living homes are, how they work, how they differ from treatment facilities, and what to expect when you move in. Comprehensive guide to sober living housing.",
    content: `If you're considering sober living or recommending it to someone in recovery, understanding how these programs work is essential. Sober living homes bridge the gap between intensive treatment and independent living, providing structure without being overly restrictive.

## What Exactly Is a Sober Living Home?

Sober living homes (sometimes called halfway houses, sober homes, or recovery residences) are transitional housing facilities for people committed to sobriety. They provide safe, substance-free environments where residents support each other's recovery journey while learning to rebuild their lives independently.

## Key Features of Sober Living Homes

### Structure and Safety
- Substance-free environment with regular drug testing
- House rules and curfews that create accountability
- Staff or peer managers who ensure the program runs smoothly
- Secure, welcoming living spaces

### Community Support
- Peer support from people with shared recovery experiences
- Mandatory house meetings and group activities
- Mentorship from longer-term residents
- A family-like atmosphere built on mutual respect

### Flexibility
- More independence than inpatient treatment
- Residents typically work or attend school
- Free time for personal appointments and relationships
- Gradual transition to independent living

## Sober Living vs. Treatment Centers: Key Differences

| Feature | Sober Living Homes | Treatment Centers |
|---------|-------------------|------------------|
| Duration | 6-24 months | 28-90 days |
| Medical Staff | Usually not | Yes, medical team |
| Therapy | Peer-based + optional professional | Daily therapy sessions |
| Work/School | Encouraged/required | Not during treatment |
| Structure | House rules and meetings | Highly structured daily schedule |
| Cost | $300-1,500/month | $1,000-30,000+ |
| Focus | Reintegration and life skills | Detoxification and initial recovery |

## What to Expect Your First Day in a Sober Living Home

- Tour of the house and your room
- Introduction to housemates and staff
- Review of house rules and expectations
- Your first house meeting
- Orientation to local support group meetings
- Discussion of your recovery goals

## Who Benefits Most From Sober Living?

Sober living homes work best for people who:
- Have completed inpatient or outpatient treatment
- Are serious about staying sober
- Want peer support and accountability
- Need time to rebuild their lives
- Are ready to transition back to independent living gradually
- Have completed initial detoxification and stabilization

## How Long Should You Stay?

Research shows optimal outcomes occur with 6-24 months of sober living residence. Most programs have flexible exit timelines based on individual progress, but staying at least 6 months significantly increases long-term recovery success rates.

## Start Your Sober Living Journey Today

Sober living homes provide the perfect balance of support and independence for long-term recovery. Find the right fit and begin your transition to a fulfilling, sober life.`,
    author: "James Rodriguez, Housing Specialist",
    date: "Nov 28, 2025",
    category: "Education",
  },
  {
    id: "3",
    title: "Building Community in Recovery: The Power of Peer Support in Sober Living",
    excerpt: "Discover how meaningful connections and peer support create the foundation for long-term sobriety. Why community matters in recovery and sober living homes.",
    content: `One of the most transformative aspects of sober living is the community you build. Research consistently shows that strong peer support networks are one of the strongest predictors of long-term recovery success. Let's explore why community matters so much and how to build meaningful connections in sober living.

## Why Community is Critical for Recovery

### Isolation Kills Recovery
One of the biggest threats to sobriety is isolation. Loneliness often triggers relapse. Sober living communities combat this by surrounding you with people who understand your struggle firsthand.

### Shared Experience Creates Deep Bonds
When you live with people facing similar challenges, authentic connections form naturally. These aren't surface-level relationships—they're bonds forged through vulnerability and mutual support.

### Accountability That Actually Works
Your housemates aren't judgmental—they're invested in your success because they're invested in their own. When you know people care about your wellbeing, accountability becomes motivating rather than punitive.

## How Peer Support Accelerates Recovery

### Immediate Understanding
Housemates get it. They don't need explanations about withdrawal symptoms, cravings, or shame. They've been there. This immediate understanding is healing in ways that even professional therapists can't replicate.

### Role Models for Long-Term Sobriety
Seeing someone who was where you are 6, 12, or 24 months ago—now thriving, employed, reconnected with family—provides concrete hope and a roadmap for your own recovery.

### Safe Space to Fail and Learn
Recovery isn't linear. In a supportive community, mistakes become learning opportunities rather than shameful secrets. You can talk openly about struggles without fear of judgment.

### Celebration of Milestones
From 30 days sober to getting a job to reconciling with family, your community celebrates your wins. This positive reinforcement builds momentum and self-worth.

## Building Authentic Connections in Your Sober Living Home

### Show Up Authentically
Be honest about your struggles, fears, and goals. Vulnerability invites connection. The more real you are, the deeper your relationships become.

### Participate Actively
Attend house meetings, join group activities, help with chores, go to meetings together. Participation builds familiarity and trust.

### Support Others Generously
Give what you're getting. Listen to housemates' challenges. Share what you've learned. As you help others, your own recovery deepens.

### Respect Boundaries
Everyone's recovery journey is unique. Respect different approaches, backgrounds, and timelines. Diversity within community makes it stronger.

## The Sober Living Community Effect

Living in a house of 5-15 people in recovery creates something special:
- You're never alone when facing triggers or cravings
- You have immediate accountability for decisions
- You learn healthy relationship skills in real-time
- You develop a support network for life after sober living
- You find purpose through helping others succeed

## Long-Term Impact of Recovery Community

Research shows that people who maintain strong peer support networks have:
- 2-3x higher rates of sustained sobriety
- Better mental health outcomes
- Stronger employment and financial stability
- More stable family relationships
- Greater overall life satisfaction

## Your Community is Waiting

The power of shared recovery is transformative. When you enter sober living, you're not just getting housing—you're gaining a family of people committed to each other's success. This community connection becomes the foundation for a lifetime of sobriety.

Join a recovery community today. Your future self will thank you.`,
    author: "Emma Wilson, Community Advocate",
    date: "Nov 25, 2025",
    category: "Community",
  },
  {
    id: "4",
    title: "How to Choose the Best Sober Living Home: Complete Evaluation Guide",
    excerpt: "Comprehensive guide to finding and evaluating sober living homes. Learn key factors to consider when choosing recovery housing that fits your needs.",
    content: `Choosing a sober living home is one of the most important decisions in your recovery journey. The right environment can accelerate your healing; the wrong one can undermine your progress. Here's how to evaluate and find the best sober living home for your unique situation.

## Critical Factors When Choosing a Sober Living Home

### 1. Accreditation and Licensing
Check if the facility is licensed by your state and accredited by organizations like:
- NARR (National Alliance for Recovery Residences)
- Your state's Department of Health or Social Services
- Local housing authorities

Accreditation ensures standards for safety, hygiene, and program quality.

### 2. Program Philosophy and Structure
Different homes emphasize different approaches:
- **12-Step Based**: Focused on AA/NA meetings and sponsors
- **Holistic**: Incorporating yoga, meditation, art therapy
- **Peer-Run**: Managed by residents in recovery
- **Staff-Managed**: Professional staff provide oversight

Choose a philosophy that aligns with your values and recovery approach.

### 3. Resident Demographics
Consider:
- Age range of residents
- Gender (male, female, or co-ed)
- Recovery stage (early vs. established sobriety)
- Similar backgrounds or life experiences

You want to feel comfortable and understood by your housemates.

### 4. House Rules and Expectations
Every sober living home has different standards:
- Curfews and house meetings
- Drug testing frequency and procedures
- Work/school requirements
- Visitor policies
- Chore assignments
- Consequences for rule violations

Make sure you can commit to these standards.

### 5. Location and Accessibility
Consider:
- Proximity to your job or school
- Access to public transportation
- Nearness to support group meetings (AA, NA, SMART Recovery, etc.)
- Local healthcare providers
- Connection to family and support systems

A good location removes barriers to staying engaged in recovery.

### 6. Cost and Payment Options
Sober living typically costs $300-1,500/month depending on:
- Location (urban vs. suburban)
- Amenities and house condition
- Level of staff involvement
- Geographic region

Ask about:
- Payment plans or sliding scale fees
- Insurance acceptance
- Financial assistance programs
- Grant eligibility

### 7. Staff Qualifications and Support
Evaluate the team:
- Do staff have recovery experience themselves?
- Are counselors licensed?
- What's the staff-to-resident ratio?
- What support services are offered?
- Can they help with employment, education, or legal issues?

### 8. House Condition and Living Environment
Visit in person to assess:
- Clean, safe living space
- Adequate bedrooms and bathrooms
- Common areas for community building
- Kitchen facilities
- Emergency protocols and first aid equipment

### 9. Aftercare and Alumni Support
Ask about:
- What happens after you leave?
- Alumni network and ongoing support
- Options for extended residence if needed
- Relapse prevention planning
- Connection to other community resources

### 10. Reputation and Reviews
Research:
- Online reviews and testimonials
- Questions to ask current and former residents
- Local reputation in the recovery community
- Referral sources and recommendations

## Questions to Ask During Your Visit

- What is your average length of stay?
- What's your success rate (sustained sobriety)?
- How do you handle someone with mental health conditions?
- What's your relapse policy? (Important—policies vary widely)
- Can I speak with current residents?
- What happens if I have an emergency or crisis?
- How do you integrate residents into the broader recovery community?

## Red Flags to Avoid

- No proper licensing or accreditation
- Refusal to let you speak with current residents
- Unclear or unrealistic pricing
- No clear consequences for rule violations
- Isolated location far from support meetings
- Staff without recovery or professional credentials
- Excessive restrictions that feel punitive rather than supportive
- No aftercare plan

## The Right Fit Makes All the Difference

The best sober living home for you might not be the "best" one overall. It's the one that matches YOUR recovery needs, values, goals, and circumstances. Take time to evaluate thoroughly. Your investment of effort now pays dividends in successful, sustained recovery.

## Start Your Search Today

Contact local treatment centers, recovery organizations, or use Sober Stay to browse verified sober living homes in your area. The perfect recovery home is waiting for you.`,
    author: "Marcus Johnson, Recovery Coach",
    date: "Nov 22, 2025",
    category: "Guidance",
  },
  {
    id: "5",
    title: "Mental Health and Addiction Recovery: Managing Dual Diagnosis in Sober Living",
    excerpt: "Practical strategies for addressing anxiety, depression, PTSD and mental health challenges while maintaining sobriety in recovery housing.",
    content: `Mental health and addiction recovery are deeply interconnected. Many people in recovery face challenges with anxiety, depression, PTSD, bipolar disorder, or other mental health conditions. Understanding how to manage dual diagnosis is essential for lasting sobriety. Let's explore practical strategies for mental wellness in sober living homes.

## The Connection Between Mental Health and Addiction

### The Self-Medication Cycle
Many people initially used substances to cope with underlying mental health issues:
- Using alcohol to numb anxiety or depression
- Using stimulants to combat low mood
- Using depressants to manage racing thoughts or anxiety
- Using any substance to escape painful emotions

Early recovery often surfaces these underlying conditions. This is actually progress—now you can address the root cause rather than just the symptom.

### Neurochemistry and Recovery
Addiction rewires brain chemistry. Early recovery means your brain is rebalancing:
- Dopamine levels gradually normalize
- Your reward system recalibrates
- Mood regulation takes time to stabilize (often 6-12 months)
- Anxiety and depression may intensify initially before improving

## Practical Mental Health Strategies in Sober Living

### 1. Professional Mental Health Support
If possible:
- Find a therapist or counselor experienced with dual diagnosis
- Consider psychiatric evaluation if medication might help
- Attend therapy sessions consistently
- Be honest about symptoms and medication side effects

Many sober living homes can help connect you with mental health providers.

### 2. Medication Management
If prescribed psychiatric medications:
- Take them exactly as prescribed
- Don't share or trade medications with housemates
- Attend all psychiatric appointments
- Track how medications affect your mood and sleep
- Communicate openly with your prescriber about concerns

Proper psychiatric medication is not "cheating" recovery—it's essential medical care.

### 3. Exercise and Movement
Physical activity is one of the most powerful mental health interventions:
- 30 minutes of walking daily reduces anxiety and depression
- Weight training builds confidence and strength
- Yoga and stretching reduce stress
- Sports provide community and purpose
- Outdoor time in nature dramatically improves mood

Many sober living homes organize group fitness activities.

### 4. Sleep Hygiene
Poor sleep devastates mental health and triggers cravings:
- Maintain consistent sleep/wake times
- Avoid screens 1 hour before bed
- Keep your room cool and dark
- Avoid caffeine after 2 PM
- Use calming rituals (tea, journaling, reading)

Quality sleep is non-negotiable for mental health recovery.

### 5. Nutrition and Hydration
Brain chemistry depends on proper nutrition:
- Eat protein with every meal (stabilizes mood)
- Reduce sugar (causes mood crashes)
- Stay hydrated (dehydration worsens anxiety)
- B-vitamins support neurological health
- Omega-3s support brain function

Many sober living homes provide healthy group meals.

### 6. Stress Management Techniques
Build your anxiety toolkit:
- Deep breathing exercises (4-7-8 technique)
- Progressive muscle relaxation
- Meditation and mindfulness apps
- Journaling for emotional processing
- Creative outlets (art, music, writing)

Practice these daily, not just in crisis moments.

### 7. Peer Support for Mental Health
Your housemates understand:
- You can talk openly about depression or anxiety without judgment
- Others have similar struggles and effective coping strategies
- Shared vulnerability deepens connections
- Helping others with their mental health challenges strengthens your own resilience

### 8. Structured Schedule
Consistency stabilizes mood:
- Regular wake times and bedtimes
- Scheduled meals with housemates
- Consistent work or school routine
- Planned recreation and downtime
- Predictable evening routines

Structure is therapeutic for anxiety and depression.

## Warning Signs to Take Seriously

Reach out to staff or your therapist immediately if you experience:
- Suicidal thoughts or self-harm urges
- Severe depression lasting weeks
- Anxiety so intense it prevents functioning
- Inability to sleep for extended periods
- Substance use thoughts or active use
- Hallucinations or delusions
- Complete loss of interest in recovery or activities

Mental health crises are medical emergencies. Sober living staff can help connect you to crisis resources.

## Long-Term Mental Health in Recovery

As you progress:
- Months 3-6: Initial mood instability often peaks, then improves
- Months 6-12: Most people notice significant mood improvement
- Year 1+: Mental health stabilizes as brain chemistry normalizes

## Co-Occurring Disorder Success

People with dual diagnosis (addiction + mental illness) can absolutely achieve long-term recovery. The key is:
- Getting proper mental health assessment
- Addressing both conditions simultaneously
- Using professional help, peer support, and self-care
- Being patient with your brain's healing process
- Staying committed to recovery through difficult periods

## Your Mental Health Matters

Sober living provides an ideal environment for addressing both addiction and mental health simultaneously. In community with others who understand, with structure and support, you can heal completely.

If you're struggling with mental health and addiction, sober living might be exactly what you need. Reach out today.`,
    author: "Dr. Lisa Chen, Clinical Psychologist",
    date: "Nov 19, 2025",
    category: "Mental Health",
  },
  {
    id: "6",
    title: "Real Recovery Stories: How People Transformed Their Lives in Sober Living",
    excerpt: "Inspiring stories from individuals who achieved lasting sobriety through sober living homes. Real journeys, real people, real recovery wins.",
    content: `Recovery is possible. These aren't just words—they're the lived reality of thousands of people who walked through the doors of sober living homes at their lowest point and emerged with their lives completely transformed. Meet some of them.

## Marcus: From Homelessness to Home Ownership

"When I arrived at my first sober living home, I had nothing. Literally nothing. I'd lost my job, my family had given up on me, and I'd been sleeping on friends' couches for months. I was 34 years old and had nothing to show for it.

The first week was terrifying. Living with six other guys in recovery? Sharing a bathroom? House meetings and mandatory meetings? I wanted to run.

But something shifted. These guys weren't judging me. They'd been exactly where I was. One resident, David, who'd been sober for 18 months, took me under his wing. He got me to meetings, helped me find my first job washing dishes, listened when I wanted to give up.

By month three, I had my first paycheck. By month six, I'd reconciled with my sister. By month twelve, I was promoted to line cook. After 18 months in sober living, I moved into my own apartment. Today—5 years later—I'm a restaurant manager, coaching new residents, and I just bought my first house.

If you'd told 34-year-old homeless Marcus that he'd be a homeowner in 5 years, I never would have believed you. But sober living saved my life. The community, the structure, the hope—it all mattered."

—Marcus T., 5+ years sober

## Sarah: Rebuilding a Broken Family

"I lost custody of my kids. Not one, but both of them. They were 4 and 7. I thought I'd never see them again, and honestly, I thought I deserved that. The guilt was suffocating.

I entered sober living at my lowest. I spent the first month just crying. But the women in my house—especially Jennifer who'd also lost custody—she became like a sister to me. She showed me that recovery and rebuilding family relationships was possible. She was at 3 years sober and had just gotten shared custody back.

My program connected me with a therapist who specialized in family recovery. I started documenting my sobriety progress, going to parenting classes, and proving through action—not words—that I was committed to being present for my children.

After 8 months sober, I got supervised visitation. After 14 months, I got shared custody. I've now been sober for 4 years and have primary custody. My kids know me as Mom—sober, present, loving Mom. Last month, my daughter told me, 'Mom, I'm proud of you.' I sobbed.

Sober living gave me my family back."

—Sarah K., 4+ years sober, mother of two

## James: From Self-Destruction to Self-Worth

"I grew up in a chaotic home. By 25, I was a walking disaster—heroin addiction, multiple arrests, destroyed relationships, health problems that came from years of injecting drugs. A probation officer basically forced me into sober living as an alternative to prison.

I was angry. Angry at the world, angry at my family, angry at myself. The first months in sober living, I was convinced it was all bullshit. These people couldn't help me. But then something unexpected happened: people started believing in me before I believed in myself.

My housemate Colin saw something in me. He encouraged me to get my GED. I got it. He pushed me to try community college. I'm now on track to transfer to a four-year university. My mom came to my housemate's graduation and met my recovery community. She sobbed when she met the people who'd saved my life.

I've been sober 3 years. I'm 28, in college studying social work because I want to help people in addiction the way my community helped me. I have a part-time job, a healthy relationship with my family, and I sponsor two newer residents.

My old self—angry, hopeless, self-destructive—feels like a different person entirely. Sober living didn't just save my life. It gave me a purpose and a future worth living for."

—James M., 3+ years sober

## Elena: From Crisis to Connection

"I didn't think I was that bad. I had a good job, a nice apartment, a boyfriend. But I was secretly drinking a bottle of wine every night. I woke up one morning with zero memory of the night before, realized I'd damaged an important work relationship, and finally saw the truth: I was alcoholic.

My therapist recommended sober living. I argued against it. I wasn't 'that kind' of addict. I wasn't homeless. I wasn't using heroin. I was functional.

What I learned in sober living shattered my denial: addiction doesn't discriminate by job title, address, or drug of choice. In my house, I lived with a former attorney who'd lost everything to cocaine, a nurse who was addicted to prescription pills, and a teacher addicted to alcohol like me.

For the first time, I had honest conversations about addiction. I learned that my 'just drinking wine' was just as destructive as anyone else's addiction. The stigma dissolved. The shame diminished. I found connection.

That was 3 years ago. I've been sober 3 years. I'm still in my job, still in my career, but now I'm present, healthy, and authentic. I speak at local colleges about high-functioning alcoholism. I mentor women in early recovery. The community I found in sober living—I maintain it actively because I know how vital it is.

Sober living taught me: recovery isn't about how bad your situation is. It's about willingness. I was willing. That made all the difference."

—Elena R., 3+ years sober

## Common Threads in Recovery Success

If you look at Marcus, Sarah, James, and Elena's stories, certain themes emerge:

- **They were willing**: They showed up, even when scared
- **They found community**: They connected authentically with others
- **They got support**: From staff, peers, and professionals
- **They took action**: They didn't wait for recovery to happen to them
- **They stayed**: They didn't leave at the first difficulty
- **They built identity beyond addiction**: They discovered who they could be sober
- **They gave back**: They helped others, strengthening their own recovery

## Your Recovery Story Starts Here

You have a recovery story inside you too. It might look different than Marcus's or Sarah's or James's, but it's equally powerful. Sober living provides the environment, the community, and the support system where your transformation becomes possible.

Your best life is waiting on the other side of addiction. Sober living homes are where recovery becomes reality.

**Ready to write your recovery story? Start today.**`,
    author: "Sober Stay Recovery Team",
    date: "Nov 16, 2025",
    category: "Stories",
  },
];

export function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    // Load articles from localStorage or save default articles
    const savedArticles = localStorage.getItem("sober-stay-blog-articles");
    if (savedArticles) {
      try {
        setBlogPosts(JSON.parse(savedArticles));
      } catch (e) {
        // If parsing fails, use default articles and save them
        localStorage.setItem("sober-stay-blog-articles", JSON.stringify(BLOG_POSTS));
        setBlogPosts(BLOG_POSTS);
      }
    } else {
      // First time - save default articles
      localStorage.setItem("sober-stay-blog-articles", JSON.stringify(BLOG_POSTS));
      setBlogPosts(BLOG_POSTS);
    }
  }, []);

  const categories = ["All", "Recovery Tips", "Education", "Community", "Guidance", "Mental Health", "Stories"];
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleSubscribe = () => {
    if (subscribedEmail.trim()) {
      setSubscriptionMessage(`✓ Subscribed! Check ${subscribedEmail} for updates.`);
      setSubscribedEmail("");
      setTimeout(() => setSubscriptionMessage(""), 4000);
    }
  };

  const handleJoinConversation = () => {
    // In a real app, this would navigate to a forum or open a modal
    window.location.href = "/help-center";
  };

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
                    <Button onClick={handleJoinConversation} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <Button onClick={handleSubscribe} className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
            </div>
            {subscriptionMessage && (
              <p className="text-sm text-green-400">{subscriptionMessage}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
