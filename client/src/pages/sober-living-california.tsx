import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Sun, Users, Shield, Building, Heart, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How much does sober living cost in California?",
    answer: "Sober living costs in California range widely based on location and amenities. Basic shared rooms in less expensive areas may start around $600-800 per month, while private rooms in coastal cities like Los Angeles or San Diego can range from $1,500 to $4,000+ per month. Luxury sober living homes with extensive amenities can cost even more."
  },
  {
    question: "What cities in California have the most sober living homes?",
    answer: "Major California cities with extensive sober living options include Los Angeles, San Diego, Orange County (especially Costa Mesa and Huntington Beach), San Francisco Bay Area, and the Inland Empire. Southern California, particularly Orange County, is known as a hub for recovery services and has hundreds of sober living homes."
  },
  {
    question: "Is sober living regulated in California?",
    answer: "California has specific regulations for sober living homes. The California Department of Health Care Services oversees licensed residential treatment facilities, while many sober living homes operate under fair housing laws. Some homes are certified through organizations like the California Consortium of Addiction Programs and Professionals (CCAPP)."
  },
  {
    question: "Can I use insurance for sober living in California?",
    answer: "Most insurance plans don't directly cover sober living rent. However, some California sober living homes partner with treatment programs that accept insurance, and you may be able to use insurance for outpatient services while living in sober housing. Some homes accept Medi-Cal for specific levels of care."
  },
  {
    question: "What's the weather like for recovery in California?",
    answer: "California's mild climate is often cited as beneficial for recovery. Year-round sunshine and warm weather allow for outdoor activities, exercise, and connection with nature – all important elements of a healthy recovery lifestyle. Many homes feature outdoor spaces, pools, and easy access to beaches or mountains."
  },
  {
    question: "Do I need to be a California resident to apply?",
    answer: "No, you don't need to be a California resident to apply for sober living in the state. Many people relocate to California specifically for recovery, attracted by the climate, recovery community, and variety of options. However, you'll need to plan for transportation, employment, and meeting any residency requirements for local services."
  }
];

export function SoberLivingCalifornia() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sober Living in California
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover quality sober living homes across the Golden State – from Los Angeles to San Francisco and everywhere in between.
              </p>
              <Link href="/browse?state=California">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                  <Search className="w-5 h-5 mr-2" /> Find Homes in California
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-invert">
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose California for Sober Living?</h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                California has long been a destination for individuals seeking recovery from addiction. The state's combination of beautiful weather, diverse recovery communities, world-class treatment options, and quality sober living homes makes it an ideal place to rebuild your life. From the beaches of Southern California to the mountains of the north, the Golden State offers environments that support healing and personal growth.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The recovery community in California is one of the largest and most established in the nation. With thousands of 12-step meetings held daily, specialized recovery programs, and a culture that embraces wellness and sobriety, you'll find abundant support for your journey. Many people credit California's recovery-friendly environment with helping them achieve lasting sobriety.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Sun className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Year-Round Sunshine</h3>
                        <p className="text-muted-foreground">California's mild climate supports outdoor activities, exercise, and vitamin D – all important for mental health and recovery.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Strong Recovery Community</h3>
                        <p className="text-muted-foreground">Thousands of daily meetings, recovery events, and sober activities create a supportive network for lasting change.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Building className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Variety of Options</h3>
                        <p className="text-muted-foreground">From budget-friendly shared housing to luxury recovery residences, California offers homes for every need and budget.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Wellness Culture</h3>
                        <p className="text-muted-foreground">California's focus on health and wellness aligns perfectly with recovery values – healthy food, fitness, and mindfulness are everywhere.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Popular Regions for Sober Living in California</h2>

              <h3 className="text-2xl font-bold text-white mb-4">Southern California</h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Southern California, particularly Orange County, is often considered the recovery capital of the United States. Cities like Costa Mesa, Huntington Beach, Newport Beach, and Laguna Beach have high concentrations of sober living homes, treatment centers, and recovery meetings. The area's beach lifestyle, strong recovery community, and abundance of options make it a popular choice for people from across the country.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Los Angeles and surrounding areas also offer extensive sober living options. From the Hollywood Hills to the South Bay, you'll find homes catering to various needs and budgets. LA's size means you can find both bustling urban recovery communities and quieter suburban options.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">San Diego</h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                San Diego combines beautiful weather with a more relaxed pace than LA. The city has a growing recovery community with quality sober living homes in areas like Pacific Beach, Mission Valley, and North County. San Diego's outdoor lifestyle – with easy access to beaches, hiking trails, and parks – supports an active, healthy recovery.
              </p>

              <h3 className="text-2xl font-bold text-white mb-4">Northern California</h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The San Francisco Bay Area offers sober living options for those who prefer Northern California's cooler climate and urban culture. While not as concentrated as Southern California, the Bay Area has a strong recovery community with homes in San Francisco, Oakland, and surrounding suburbs. Wine country areas like Napa and Sonoma might seem counterintuitive, but they also have recovery communities serving those who live and work in the region.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">What to Consider When Choosing California Sober Living</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Location within California matters significantly. Consider factors like proximity to family (if that's supportive for your recovery), access to employment opportunities, cost of living in the area, and the local recovery community. What works for someone in Malibu might not work for someone in Fresno – take time to research different regions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                California's cost of living, particularly in coastal areas, can be high. Budget carefully and understand what's included in rent. Some homes include utilities, food, and access to amenities, while others charge separately. Look for homes that offer good value for your budget while meeting your recovery needs.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Transportation is important in California, especially in car-dependent cities like Los Angeles. Consider whether you'll have a vehicle or need to rely on public transportation. Some homes offer transportation assistance or are located near public transit and recovery meetings.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Starting Fresh in California</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                For many people, relocating to California for sober living represents a fresh start. Being in a new environment, away from old triggers and negative influences, can support early recovery. However, a geographic change alone doesn't guarantee success – you'll still need to do the work of recovery. The difference is that California offers an environment rich with resources to support that work.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                If you're considering relocating, plan ahead. Research areas thoroughly, connect with homes before arriving, and have a plan for employment or income. Many people make the move work successfully, finding new communities, opportunities, and ultimately, lasting sobriety in the Golden State.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-card/80 transition-colors"
                    >
                      <span className="text-lg font-medium text-white">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="p-6 pt-0 bg-card">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Find Sober Living in California</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse verified sober living homes across California and take the first step toward your new life.
            </p>
            <Link href="/browse?state=California">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                Search California Homes
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default SoberLivingCalifornia;
