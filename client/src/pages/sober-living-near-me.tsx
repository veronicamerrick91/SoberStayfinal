import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Search, Shield, Users, Heart, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I find sober living homes near me?",
    answer: "Use Sober Stay's search feature to browse sober living homes in your area. Simply enter your city, state, or zip code to see available options. You can filter by price, gender, amenities, and more to find the perfect fit for your recovery journey."
  },
  {
    question: "What should I look for in a sober living home?",
    answer: "Key factors include location, cost, house rules, available amenities, staff qualifications, and the overall community atmosphere. Look for homes that offer structured programs, drug testing policies, and support for your specific recovery needs."
  },
  {
    question: "How much does sober living cost?",
    answer: "Sober living costs vary widely depending on location, amenities, and level of support. Prices typically range from $500 to $2,500 per month. Some homes accept insurance or offer sliding scale fees based on income."
  },
  {
    question: "What's the difference between sober living and a halfway house?",
    answer: "While often used interchangeably, halfway houses are typically government-funded and may be court-mandated, while sober living homes are privately operated and voluntary. Sober living homes often offer more flexibility and amenities but may cost more."
  },
  {
    question: "Can I work while living in a sober living home?",
    answer: "Yes, most sober living homes encourage residents to work or attend school. Employment is often a requirement after an initial adjustment period, as it helps build responsibility and financial independence during recovery."
  },
  {
    question: "How long can I stay in a sober living home?",
    answer: "Length of stay varies by individual needs and house policies. Some residents stay for a few months, while others may stay for a year or longer. There's typically no maximum time limit as long as you follow house rules and pay rent."
  }
];

export function SoberLivingNearMe() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sober Living Near Me
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find safe, supportive sober living homes in your area. Start your search today and take the next step in your recovery journey.
              </p>
              <Link href="/browse">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                  <Search className="w-5 h-5 mr-2" /> Search Homes Near You
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-invert">
              <h2 className="text-3xl font-bold text-white mb-6">Finding the Right Sober Living Home in Your Area</h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                When you're searching for "sober living near me," you're taking an important step toward lasting recovery. Sober living homes provide a crucial bridge between intensive treatment and independent living, offering the structure and support you need while rebuilding your life. At Sober Stay, we make it easy to find quality sober living homes in your community.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The transition from treatment to everyday life can be challenging. Sober living homes offer a safe, substance-free environment where you can practice the skills you've learned while having access to peer support and accountability. Whether you're leaving a residential treatment program, completing outpatient therapy, or simply need a fresh start, finding the right sober living home near you is essential for your continued success.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">What to Expect from Sober Living Homes</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober living homes vary in their structure, rules, and amenities, but most share common elements designed to support recovery. Residents typically live together in a house-like setting, sharing responsibilities such as cooking, cleaning, and maintaining the home. This communal living arrangement fosters accountability and helps residents develop life skills essential for independent living.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Most sober living homes require residents to abstain from alcohol and drugs, participate in regular drug testing, attend house meetings, and contribute to household chores. Many also encourage or require attendance at 12-step meetings or other recovery support groups. Some homes offer additional services such as case management, employment assistance, or connections to outpatient treatment.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Safe Environment</h3>
                        <p className="text-muted-foreground">Substance-free homes with regular drug testing and clear house rules to maintain a recovery-focused atmosphere.</p>
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
                        <h3 className="text-xl font-bold text-white mb-2">Peer Support</h3>
                        <p className="text-muted-foreground">Live alongside others who understand your journey and can offer encouragement and accountability.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Convenient Locations</h3>
                        <p className="text-muted-foreground">Find homes near work, school, family, or recovery meetings to support your daily routine.</p>
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
                        <h3 className="text-xl font-bold text-white mb-2">Structured Support</h3>
                        <p className="text-muted-foreground">House meetings, curfews, and accountability measures help maintain focus on recovery goals.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">How to Search for Sober Living Homes</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Finding the right sober living home requires research and careful consideration. Start by determining your needs: What's your budget? Do you prefer a gender-specific home? What amenities are important to you? Are you looking for a home that accepts pets or allows couples? Once you know what you're looking for, use Sober Stay to search for homes that match your criteria.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                When evaluating potential homes, consider visiting in person if possible. This allows you to meet current residents and staff, see the living conditions, and get a feel for the community atmosphere. Ask questions about house rules, costs, what's included in the rent, and what additional services are available. Trust your instincts – the right home should feel supportive and welcoming.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Benefits of Local Sober Living</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Choosing a sober living home in your local area offers several advantages. You can maintain connections with family, friends, and existing support networks. You may be able to continue working at your current job or attending your regular recovery meetings. Familiarity with the area can reduce stress and make the transition easier.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                However, some people benefit from relocating to a new area for a fresh start. If your local environment is triggering or lacks adequate recovery resources, moving to a different city might be the right choice. Sober Stay can help you find quality homes regardless of location, whether you're staying close to home or exploring new possibilities.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The most important factor is finding a home that supports your recovery goals. Whether that's around the corner or across the country, we're here to help you find your safe haven.
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
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Sober Living Home?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse sober living homes in your area and take the next step toward lasting recovery.
            </p>
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                Start Your Search
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default SoberLivingNearMe;
