import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Home, Users, Calendar, Shield, CheckCircle, ChevronDown, ChevronUp, Heart, Sparkles } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the main purpose of a sober living home?",
    answer: "The main purpose of a sober living home is to provide a safe, supportive, substance-free living environment for individuals in recovery. These homes bridge the gap between intensive treatment and independent living, offering structure, accountability, and peer support during a critical transition period."
  },
  {
    question: "Who can live in a sober living home?",
    answer: "Sober living homes are open to anyone committed to maintaining sobriety. This includes individuals completing treatment programs, those seeking a supportive environment after relapse, or anyone who needs structure and accountability in their recovery. Most homes require residents to be sober upon entry."
  },
  {
    question: "What are the rules in sober living homes?",
    answer: "Common rules include complete abstinence from drugs and alcohol, participation in regular drug testing, attendance at house meetings, completion of household chores, adherence to curfews, and respect for other residents. Many homes also require participation in recovery meetings or programs."
  },
  {
    question: "Is sober living the same as rehab?",
    answer: "No, sober living is different from rehab. Rehabilitation programs provide intensive treatment including therapy, medical care, and structured programming. Sober living homes offer a supportive living environment but typically don't provide formal treatment. Many people use sober living as a step-down from rehab."
  },
  {
    question: "How is sober living different from living at home?",
    answer: "Sober living provides structure, accountability, and peer support that may not be available at home. Residents live with others in recovery, follow house rules, participate in drug testing, and attend meetings. This environment helps reinforce recovery habits before transitioning to fully independent living."
  },
  {
    question: "Can families visit residents in sober living?",
    answer: "Most sober living homes allow family visits during designated hours. Policies vary by home – some have specific visiting hours, while others may allow more flexibility. Family involvement is often encouraged as part of the recovery process, though overnight guests are typically not permitted."
  }
];

export function WhatIsSoberLiving() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                What Is Sober Living?
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Understanding sober living homes and how they support long-term recovery from addiction.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-invert">
              <h2 className="text-3xl font-bold text-white mb-6">Understanding Sober Living Homes</h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober living homes, also known as sober houses or recovery residences, are group living environments for people recovering from addiction to drugs or alcohol. These homes provide a structured, substance-free environment where residents can continue their recovery journey while gradually transitioning back to independent living. Unlike rehabilitation centers, sober living homes don't typically offer formal treatment programs – instead, they provide a supportive community and accountability structure that reinforces the skills learned in treatment.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The concept of sober living dates back to the 1940s with the emergence of halfway houses and Oxford Houses. Today, there are thousands of sober living homes across the United States, ranging from basic shared housing to luxury residences with extensive amenities. What unites them all is a commitment to providing a safe, alcohol-free and drug-free environment for people in recovery.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">How Sober Living Homes Work</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober living homes operate on principles of mutual support, accountability, and personal responsibility. Residents typically share a house with several other people in recovery, with each person having their own bedroom or sharing a room. Common areas like kitchens, living rooms, and outdoor spaces are shared, fostering a sense of community and encouraging residents to develop healthy interpersonal skills.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Most sober living homes are self-supporting, meaning residents pay rent and share in household expenses. This financial responsibility is an important part of recovery, helping residents develop money management skills and a sense of accountability. Rent typically covers housing, utilities, and access to shared amenities, though additional services may cost extra.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-12">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Home className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Safe Housing</h3>
                        <p className="text-muted-foreground">Clean, comfortable living spaces maintained to high standards with regular inspections and upkeep.</p>
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
                        <h3 className="text-xl font-bold text-white mb-2">Community Living</h3>
                        <p className="text-muted-foreground">Residents live together, share responsibilities, and support each other through the recovery process.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Zero Tolerance</h3>
                        <p className="text-muted-foreground">Strict policies against drugs and alcohol with regular testing to maintain a safe environment.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Structured Schedule</h3>
                        <p className="text-muted-foreground">House meetings, curfews, and expectations create a framework that supports recovery routines.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">The Benefits of Sober Living</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Research consistently shows that people who participate in sober living after treatment have better outcomes than those who return directly to their previous living situations. A study published in the Journal of Psychoactive Drugs found that residents of sober living homes showed significant improvements in employment, arrests, and substance use over a 12-month period.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The benefits of sober living extend beyond just maintaining sobriety. Living in a recovery-focused environment helps residents develop life skills, build healthy relationships, establish employment or educational goals, and create a foundation for long-term success. The peer support available in sober living homes is particularly valuable, as residents can learn from each other's experiences and encourage one another through challenges.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Types of Sober Living Homes</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober living homes vary widely in their structure, services, and amenities. Some operate as democratically-run houses where residents share equally in decision-making and responsibilities. Others have professional staff, house managers, or owners who oversee operations. Many homes specialize in serving specific populations, such as men's sober living, women's sober living, young adult programs, or LGBTQ+-affirming residences.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The National Alliance for Recovery Residences (NARR) has established standards for recovery housing and categorizes homes into four levels based on the support they provide. Level 1 homes are peer-run with minimal structure, while Level 4 homes offer clinical services and intensive support. Understanding these distinctions can help you find a home that matches your needs and stage of recovery.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Who Should Consider Sober Living?</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sober living is appropriate for anyone who wants a supportive, substance-free environment as they work on their recovery. This includes people completing residential treatment who aren't ready to return home, individuals who've experienced relapse and need additional support, those leaving incarceration who need stable housing, and anyone whose home environment isn't conducive to recovery.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The decision to enter sober living is personal and depends on individual circumstances. Some people stay for just a few months, while others find that living in a sober community long-term is the best choice for their ongoing recovery. There's no one-size-fits-all approach – what matters is finding the right level of support for where you are in your journey.
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
            <h2 className="text-3xl font-bold text-white mb-6">Find a Sober Living Home Today</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to take the next step? Browse verified sober living homes and find your path to lasting recovery.
            </p>
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                Browse Sober Living Homes
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default WhatIsSoberLiving;
