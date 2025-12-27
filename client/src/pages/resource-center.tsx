import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Download, FileText, BookOpen, Shield, Heart, Users, CheckCircle, ArrowRight, Mail } from "lucide-react";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "checklist" | "worksheet" | "ebook";
  icon: typeof FileText;
  downloadName: string;
  content: string;
}

const resources: Resource[] = [
  {
    id: "choosing-guide",
    title: "How to Choose a Sober Living Home",
    description: "A comprehensive guide covering everything you need to know about selecting the right sober living home for your recovery journey.",
    type: "guide",
    icon: BookOpen,
    downloadName: "sober-stay-choosing-guide.txt",
    content: `HOW TO CHOOSE A SOBER LIVING HOME
A Complete Guide by Sober Stay

INTRODUCTION
Choosing the right sober living home is one of the most important decisions you'll make in your recovery journey. This guide will help you understand what to look for, questions to ask, and how to make the best choice for your situation.

WHAT IS SOBER LIVING?
Sober living homes provide a structured, substance-free living environment for individuals in recovery from addiction. Unlike treatment centers, sober living homes focus on helping residents transition to independent living while maintaining sobriety.

KEY FACTORS TO CONSIDER

1. LOCATION
- Proximity to work, school, or family
- Access to public transportation
- Distance from recovery meetings
- Neighborhood safety and environment

2. COST AND WHAT'S INCLUDED
- Monthly rent (typically $500-$2,500)
- Security deposit requirements
- What utilities are included
- Additional fees for services

3. HOUSE RULES AND STRUCTURE
- Drug testing policies
- Curfew requirements
- Guest policies
- Meeting attendance requirements
- Employment/school requirements

4. AMENITIES AND LIVING CONDITIONS
- Private vs. shared rooms
- Kitchen access and meal arrangements
- Laundry facilities
- Common areas and outdoor space
- WiFi and technology access

5. SUPPORT SERVICES
- House manager availability
- Case management services
- Job placement assistance
- Transportation help
- Connection to outpatient treatment

QUESTIONS TO ASK DURING YOUR SEARCH

About the Home:
- How long has the home been operating?
- What is the house manager's background?
- How many residents live there?
- What is the average length of stay?

About Rules and Expectations:
- What are the house rules?
- How often are drug tests conducted?
- What happens if someone relapses?
- Are there curfews? Are they flexible?

About Support:
- What recovery support is provided?
- Are house meetings held regularly?
- Is there a sponsor or mentor program?
- What happens in emergencies?

About Costs:
- What is the total monthly cost?
- What is included in the rent?
- Are there payment plans available?
- Is the deposit refundable?

RED FLAGS TO WATCH FOR
- No drug testing policy
- No clear house rules
- Overcrowded conditions
- Unprofessional management
- Pressure to sign immediately
- No references or reviews available
- Hidden fees or unclear pricing

MAKING YOUR DECISION
1. Visit multiple homes before deciding
2. Meet current residents if possible
3. Trust your instincts about the environment
4. Consider your specific recovery needs
5. Don't rush the decision

NEXT STEPS
Once you've found the right home:
1. Complete the application process
2. Prepare your deposit and first month's rent
3. Gather required documents (ID, references)
4. Plan your move-in logistics
5. Connect with your new community

For more resources and to search sober living homes, visit SoberStay.com

---
This guide was created by Sober Stay to help individuals find safe, supportive recovery housing.
`
  },
  {
    id: "interview-checklist",
    title: "Sober Living Interview Checklist",
    description: "A printable checklist of questions to ask when visiting potential sober living homes.",
    type: "checklist",
    icon: CheckCircle,
    downloadName: "sober-stay-interview-checklist.txt",
    content: `SOBER LIVING HOME INTERVIEW CHECKLIST
Print this checklist and bring it when visiting potential homes.

HOME NAME: ___________________________________
DATE VISITED: _________________________________
ADDRESS: _____________________________________

BASIC INFORMATION
[ ] How long has this home been operating?
[ ] Who owns/operates the home?
[ ] How many beds/residents?
[ ] What is the staff-to-resident ratio?
[ ] Is the home licensed or certified?

COSTS & PAYMENT
[ ] Monthly rent: $____________
[ ] Security deposit: $____________
[ ] Application fee: $____________
[ ] What's included in rent?
    [ ] Utilities
    [ ] Internet/WiFi
    [ ] Meals
    [ ] Laundry
    [ ] Transportation
[ ] Are payment plans available?
[ ] Is the deposit refundable?

HOUSE RULES
[ ] Curfew time: ____________
[ ] Are curfews negotiable for work?
[ ] Drug testing frequency: ____________
[ ] Type of drug tests used: ____________
[ ] Guest policy: ____________
[ ] Meeting attendance required? [ ] Yes [ ] No
    If yes, how many per week? ____________
[ ] Employment/school required? [ ] Yes [ ] No
    If yes, within how many days? ____________
[ ] Chore responsibilities? [ ] Yes [ ] No
[ ] Cell phone/electronics policy: ____________

LIVING CONDITIONS
[ ] Private room? [ ] Yes [ ] No
    If shared, how many roommates? ____________
[ ] Bathroom: [ ] Private [ ] Shared
[ ] Kitchen access? [ ] Yes [ ] No
[ ] Laundry on-site? [ ] Yes [ ] No
[ ] Outdoor space? [ ] Yes [ ] No
[ ] Parking available? [ ] Yes [ ] No
[ ] Pet-friendly? [ ] Yes [ ] No

SUPPORT & SERVICES
[ ] House manager on-site? [ ] Yes [ ] No
    Hours available: ____________
[ ] House meetings frequency: ____________
[ ] Case management available? [ ] Yes [ ] No
[ ] Job assistance available? [ ] Yes [ ] No
[ ] Transportation assistance? [ ] Yes [ ] No
[ ] Alumni program? [ ] Yes [ ] No

SAFETY & SECURITY
[ ] Security measures in place: ____________
[ ] What happens if someone relapses?
    ________________________________
[ ] Emergency protocols: ____________
[ ] First aid/Narcan on-site? [ ] Yes [ ] No

YOUR OBSERVATIONS
Overall cleanliness (1-5): ______
Residents seemed (1-5): ______
Staff professionalism (1-5): ______
Would you feel safe here? [ ] Yes [ ] No

NOTES:
_________________________________________
_________________________________________
_________________________________________
_________________________________________

NEXT STEPS:
[ ] Schedule follow-up visit
[ ] Request references
[ ] Submit application
[ ] Other: ____________

---
Created by Sober Stay | SoberStay.com
`
  },
  {
    id: "first-week-worksheet",
    title: "Your First Week in Sober Living",
    description: "A worksheet to help you prepare for and navigate your first week in a new sober living home.",
    type: "worksheet",
    icon: FileText,
    downloadName: "sober-stay-first-week-worksheet.txt",
    content: `YOUR FIRST WEEK IN SOBER LIVING
A Preparation & Transition Worksheet

BEFORE MOVE-IN: PREPARATION CHECKLIST

Documents to Gather:
[ ] Government-issued ID
[ ] Proof of income or employment
[ ] Emergency contact information
[ ] Insurance information (if applicable)
[ ] Recovery history/treatment records
[ ] Prescription medications in original bottles
[ ] References from treatment or sponsors

Personal Items to Pack:
[ ] Clothing for one week
[ ] Toiletries and personal care items
[ ] Bedding (check what's provided)
[ ] Phone and charger
[ ] Journal or notebook
[ ] Recovery literature
[ ] Photos or meaningful items

Financial Preparation:
[ ] First month's rent secured
[ ] Security deposit ready
[ ] Emergency fund for incidentals
[ ] Transportation money for first week

DAY 1: MOVE-IN DAY

Morning Tasks:
[ ] Eat a good breakfast
[ ] Review house rules one more time
[ ] Pack final items
[ ] Confirm move-in time

Upon Arrival:
[ ] Meet house manager
[ ] Complete paperwork
[ ] Tour the facility
[ ] Introduce yourself to housemates
[ ] Unpack and organize your space
[ ] Save important phone numbers

Evening:
[ ] Attend house meeting if scheduled
[ ] Find a local meeting for tomorrow
[ ] Set alarm for morning
[ ] Journal about your feelings

DAYS 2-3: ESTABLISHING ROUTINE

Daily Structure Template:
Morning:
- Wake-up time: ______
- Morning routine
- Breakfast
- Chores (if assigned)

Afternoon:
- Work/School/Job search
- Lunch
- Personal time

Evening:
- Recovery meeting
- Dinner
- House meeting (if scheduled)
- Personal time
- Bedtime: ______

DAYS 4-5: BUILDING CONNECTIONS

People to Connect With:
[ ] House manager
[ ] At least 2 housemates
[ ] Someone at a local meeting
[ ] Sponsor or mentor

Questions to Ask Housemates:
- What tips do you have for living here?
- Which meetings do you recommend?
- Where do you go for groceries?
- Any local job opportunities?

DAYS 6-7: REFLECTION & ADJUSTMENT

Weekly Check-In Questions:

How am I feeling about the home?
_________________________________
_________________________________

What's going well?
_________________________________
_________________________________

What's challenging?
_________________________________
_________________________________

What do I need help with?
_________________________________
_________________________________

Goals for Week 2:
1. _______________________________
2. _______________________________
3. _______________________________

IMPORTANT CONTACTS

House Manager: ____________________
Phone: ___________________________

Sponsor: _________________________
Phone: ___________________________

Emergency Contact: ________________
Phone: ___________________________

Nearest Meeting Location: __________
Meeting Times: ____________________

SELF-CARE REMINDERS

[ ] Take it one day at a time
[ ] Ask for help when you need it
[ ] Attend meetings regularly
[ ] Stay connected with your support network
[ ] Be patient with yourself
[ ] Celebrate small wins

---
Created by Sober Stay | SoberStay.com
`
  },
  {
    id: "family-guide",
    title: "Family Guide to Sober Living",
    description: "A guide for families supporting a loved one in their transition to sober living.",
    type: "guide",
    icon: Heart,
    downloadName: "sober-stay-family-guide.txt",
    content: `FAMILY GUIDE TO SOBER LIVING
Supporting Your Loved One's Recovery Journey

INTRODUCTION
When a family member enters sober living, it affects the entire family. This guide will help you understand what sober living is, how to support your loved one, and how to take care of yourself during this process.

UNDERSTANDING SOBER LIVING

What Sober Living Is:
- A transitional living environment
- A bridge between treatment and independence
- A community of peers in recovery
- A structured, substance-free home

What Sober Living Is Not:
- A treatment center
- A short-term fix
- A place that "cures" addiction
- A substitute for ongoing recovery work

WHAT TO EXPECT

Length of Stay:
- Typically 3-12 months
- Some residents stay longer
- Length depends on individual needs
- Rushing the process can be harmful

Typical Requirements:
- Maintaining sobriety
- Regular drug testing
- Attending recovery meetings
- Following house rules
- Employment or school enrollment
- Participating in house community

HOW TO BE SUPPORTIVE

DO:
- Respect their boundaries
- Celebrate milestones (30 days, 60 days, etc.)
- Attend family support meetings (Al-Anon, Nar-Anon)
- Learn about addiction as a disease
- Communicate openly and honestly
- Be patient with the process
- Encourage their recovery activities

DON'T:
- Enable unhealthy behaviors
- Expect immediate perfection
- Ignore your own needs
- Make excuses for them
- Take control of their recovery
- Violate house visiting policies
- Pressure them to leave before ready

COMMUNICATION TIPS

Healthy Boundaries:
- Respect house rules about calls/visits
- Don't show up unannounced
- Keep conversations supportive
- Avoid lectures or guilt trips
- Listen more than you speak

Helpful Phrases:
- "I'm proud of you for taking this step"
- "How can I support you?"
- "I'm here when you need to talk"
- "I'm learning about this too"

Phrases to Avoid:
- "When are you coming home?"
- "Haven't you learned your lesson?"
- "I don't understand why you can't just..."
- "Other people seem fine after treatment"

FINANCIAL CONSIDERATIONS

What Families Often Help With:
- Initial deposit and first month's rent
- Basic necessities (toiletries, clothing)
- Transportation costs
- Phone bill

Setting Financial Boundaries:
- Discuss expectations upfront
- Consider payment plans vs. lump sums
- Don't enable by covering all expenses
- Encourage financial independence

TAKING CARE OF YOURSELF

Self-Care for Families:
- Attend Al-Anon or family support groups
- Consider individual therapy
- Maintain your own routines
- Set and keep your boundaries
- Practice stress-relief activities
- Stay connected with your support network

Remember:
- You didn't cause the addiction
- You can't control their recovery
- You can't cure them
- But you CAN support and love them

RESOURCES FOR FAMILIES

Support Groups:
- Al-Anon: al-anon.org
- Nar-Anon: nar-anon.org
- SMART Recovery Family & Friends

Hotlines:
- SAMHSA National Helpline: 1-800-662-4357
- Family support available 24/7

Books:
- "Codependent No More" by Melody Beattie
- "Beautiful Boy" by David Sheff
- "Beyond Addiction" by Jeffrey Foote

WHEN TO BE CONCERNED

Warning Signs:
- Sudden change in behavior
- Isolation from family and friends
- Secretive about activities
- Financial problems
- Mood swings or hostility
- Missing recovery meetings
- Leaving sober living suddenly

What to Do:
- Express concern without judgment
- Encourage open communication
- Contact the house manager if worried
- Have crisis resources ready
- Don't ignore your instincts

CELEBRATING PROGRESS

Recovery Milestones to Acknowledge:
- Completing first week
- 30 days of sobriety
- Getting a job
- 60 and 90 days
- Moving to more independent living
- One year of sobriety

Ways to Celebrate:
- Send a card or letter
- Plan a family meal
- Acknowledge their hard work
- Share your pride verbally
- Create new positive memories

---
Created by Sober Stay | SoberStay.com
For more resources, visit our Resource Center.
`
  },
  {
    id: "provider-toolkit",
    title: "Provider Listing Toolkit",
    description: "Everything sober living operators need to create effective listings that attract qualified residents.",
    type: "guide",
    icon: Users,
    downloadName: "sober-stay-provider-toolkit.txt",
    content: `SOBER LIVING PROVIDER LISTING TOOLKIT
Attract More Qualified Residents

INTRODUCTION
This toolkit will help you create compelling listings that attract the right residents for your sober living home. Learn how to showcase your property, write effective descriptions, and stand out from the competition.

PHOTOGRAPHY TIPS

Essential Photos to Include:
1. Exterior front view (curb appeal)
2. Common living areas
3. Kitchen
4. Bedrooms (show bed configuration)
5. Bathrooms
6. Outdoor spaces
7. Dining area
8. Any special amenities

Photography Best Practices:
- Use natural lighting when possible
- Clean and declutter before shooting
- Show the space from multiple angles
- Capture the atmosphere and feel
- Include photos of community activities
- Update photos seasonally

What to Avoid:
- Blurry or dark images
- Cluttered or messy spaces
- Photos with residents (without consent)
- Misleading or edited photos
- Old or outdated images

WRITING YOUR DESCRIPTION

Opening Hook:
Start with what makes your home special.

Example: "Welcome to Serenity House, a peaceful haven in the heart of West Hollywood where residents build lasting recovery in a supportive community setting."

Key Information to Include:
- Location highlights
- Home atmosphere and culture
- Target demographic (if applicable)
- Unique features or programs
- Recovery philosophy
- What sets you apart

Description Formula:
1. Hook (1 sentence)
2. Location & setting (2-3 sentences)
3. Home culture & community (2-3 sentences)
4. Amenities & features (bullet points)
5. Programs & support (2-3 sentences)
6. Call to action

Sample Descriptions:

FOR A MEN'S HOME:
"Brotherhood House offers a structured environment where men in recovery support each other's journey to lasting sobriety. Located in a quiet residential neighborhood just minutes from downtown, our home provides the perfect balance of accountability and independence.

Our community emphasizes personal growth, accountability, and mutual support. Weekly house meetings, group activities, and peer mentorship create bonds that last well beyond residents' stay with us.

Amenities include private bedrooms, fully equipped kitchen, outdoor patio, and transportation to local meetings. Our experienced house manager brings 10+ years of recovery experience and is available 24/7 for support."

PRICING STRATEGY

Factors to Consider:
- Local market rates
- Your amenities and services
- Competition pricing
- Target resident demographic
- Included vs. additional costs

Transparency Tips:
- List all costs upfront
- Explain what's included
- Note any additional fees
- Offer payment options if available

HOUSE RULES PRESENTATION

Effective Rules Communication:
- Be clear and specific
- Explain the "why" behind rules
- Use positive framing when possible
- Prioritize safety-related rules

Example Format:
"Our Community Guidelines:
✓ Maintain sobriety and participate in weekly drug testing
✓ Attend minimum 3 recovery meetings per week
✓ Contribute to household chores on rotating schedule
✓ Respect quiet hours (10pm - 7am)
✓ Obtain employment within 30 days of move-in"

STANDING OUT FROM COMPETITION

Unique Selling Points to Highlight:
- Staff credentials and experience
- Success rates or alumni testimonials
- Special programs or services
- Certifications or accreditations
- Community involvement
- Location advantages

SEO TIPS FOR YOUR LISTING

Keywords to Include:
- Your city and state
- "Sober living" + location
- Gender-specific terms if applicable
- Specialty terms (MAT-friendly, LGBTQ+, etc.)
- Nearby landmarks or neighborhoods

RESPONDING TO INQUIRIES

Response Best Practices:
- Respond within 24 hours
- Be warm and professional
- Answer all questions thoroughly
- Invite them to visit
- Share next steps clearly

Sample Response Template:
"Thank you for your interest in [Home Name]! We'd be happy to answer any questions and schedule a tour at your convenience.

[Address specific questions from inquiry]

Our next steps typically include:
1. Phone conversation to discuss your needs
2. In-person tour of the home
3. Application submission
4. Interview with house manager
5. Move-in coordination

Would you be available for a call this week? You can reach me at [phone] or reply to this message.

Looking forward to connecting,
[Your name]"

MANAGING YOUR REPUTATION

Building Positive Reviews:
- Ask satisfied residents for feedback
- Make leaving a review easy
- Respond to all reviews professionally
- Address concerns promptly
- Showcase testimonials (with permission)

Handling Negative Feedback:
- Respond calmly and professionally
- Acknowledge concerns
- Offer to resolve offline
- Learn from constructive criticism
- Don't argue publicly

COMPLIANCE REMINDERS

Listing Accuracy:
- Keep information current
- Update availability regularly
- Remove sold-out listings promptly
- Accurately represent services

Legal Considerations:
- Fair housing compliance
- Truthful advertising
- Privacy protection
- Proper licensing display

---
Created by Sober Stay | SoberStay.com
For listing assistance, contact support@soberstayhomes.com
`
  }
];

export function ResourceCenter() {
  const [email, setEmail] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (resource: Resource) => {
    setDownloadingId(resource.id);
    
    // Create blob and download
    const blob = new Blob([resource.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.downloadName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setDownloadingId(null);
    setDownloadSuccess(resource.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "guide": return "Guide";
      case "checklist": return "Checklist";
      case "worksheet": return "Worksheet";
      case "ebook": return "eBook";
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Free Recovery Resources
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Download free guides, checklists, and worksheets to help you or your loved one navigate the sober living journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">For Individuals in Recovery</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {resources.filter(r => r.id !== "provider-toolkit" && r.id !== "family-guide").map((resource) => (
                  <Card key={resource.id} className="bg-card border-border hover:border-primary/50 transition-all h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <resource.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">
                          {getTypeLabel(resource.type)}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white">{resource.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button 
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId === resource.id}
                        className="w-full bg-primary hover:bg-primary/90"
                        data-testid={`button-download-${resource.id}`}
                      >
                        {downloadSuccess === resource.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" /> Downloaded!
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" /> Download Free
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-white mb-8">For Families</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {resources.filter(r => r.id === "family-guide").map((resource) => (
                  <Card key={resource.id} className="bg-card border-border hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-500/10 rounded-lg">
                          <resource.icon className="w-6 h-6 text-rose-400" />
                        </div>
                        <span className="text-xs font-medium text-rose-400 uppercase tracking-wide">
                          {getTypeLabel(resource.type)}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white">{resource.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId === resource.id}
                        className="bg-rose-500 hover:bg-rose-600"
                        data-testid={`button-download-${resource.id}`}
                      >
                        {downloadSuccess === resource.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" /> Downloaded!
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" /> Download Free
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="text-3xl font-bold text-white mb-8">For Sober Living Providers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.filter(r => r.id === "provider-toolkit").map((resource) => (
                  <Card key={resource.id} className="bg-card border-border hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <resource.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                          {getTypeLabel(resource.type)}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white">{resource.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId === resource.id}
                        className="bg-blue-500 hover:bg-blue-600"
                        data-testid={`button-download-${resource.id}`}
                      >
                        {downloadSuccess === resource.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" /> Downloaded!
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" /> Download Free
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Get More Recovery Resources</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to receive new guides, recovery tips, and sober living updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-white/10 h-12"
                data-testid="input-newsletter-email"
              />
              <Button className="bg-primary hover:bg-primary/90 h-12 px-8" data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </section>

        {/* Browse Homes CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Sober Living Home?</h2>
            <p className="text-muted-foreground mb-6">
              Browse sober living homes and start your search today.
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

export default ResourceCenter;
