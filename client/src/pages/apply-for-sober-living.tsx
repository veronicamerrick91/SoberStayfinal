import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, CheckCircle, Clock, MessageSquare, Shield, Users, ChevronDown, ChevronUp, Clipboard, Send } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What do I need to apply for sober living?",
    answer: "Most applications require basic personal information, recovery history, employment or income details, emergency contacts, and sometimes references. Some homes may require a photo ID, proof of income, or documentation of recent treatment. Sober Stay allows you to create a reusable application profile to streamline this process."
  },
  {
    question: "How long does the application process take?",
    answer: "Application review times vary by home. Some providers respond within 24-48 hours, while others may take up to a week. Using Sober Stay to apply directly can speed up the process by ensuring your application is complete and reaching providers instantly."
  },
  {
    question: "Do I need to be sober to apply?",
    answer: "Most sober living homes require applicants to be sober at the time of move-in. Some may require a minimum number of sober days (often 7-30 days) or completion of a detox or treatment program. Each home has different requirements, so check with the specific provider."
  },
  {
    question: "Can I apply to multiple homes at once?",
    answer: "Yes! Sober Stay allows you to create one application profile and submit it to multiple homes simultaneously. This saves time and increases your chances of finding a placement quickly. You can compare options and choose the best fit for your needs."
  },
  {
    question: "What if my application is denied?",
    answer: "If your application is denied, don't be discouraged. Ask the provider for feedback and address any concerns. Different homes have different requirements – a denial from one doesn't mean you won't be accepted elsewhere. Keep applying and consider what factors might make you a better candidate."
  },
  {
    question: "Is there an application fee?",
    answer: "Sober Stay does not charge fees to apply through our platform. Some individual homes may have application or administrative fees, but many do not. If a home charges a fee, it should be clearly disclosed upfront. Be cautious of homes that require large upfront payments before you've seen the property."
  }
];

export function ApplyForSoberLiving() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Apply for Sober Living
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn how to apply for sober living homes and start your application today with Sober Stay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tenant-profile">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                    <FileText className="w-5 h-5 mr-2" /> Create Your Application
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-primary/50 text-primary hover:bg-primary/10">
                    Browse Homes First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-invert">
              <h2 className="text-3xl font-bold text-white mb-6">How to Apply for Sober Living Housing</h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Applying for sober living housing is an important step in your recovery journey. The application process helps providers ensure their homes are a good fit for potential residents while giving you the opportunity to learn more about the community you'll be joining. At Sober Stay, we've simplified the application process so you can focus on what matters most – your recovery.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The first step is understanding what sober living providers are looking for. Most homes want to ensure that applicants are committed to their recovery, able to follow house rules, and will be positive members of the community. They'll want to know about your recovery history, current situation, and goals for the future. Being honest and thorough in your application increases your chances of finding a good match.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">The Sober Stay Application Process</h2>

              <div className="grid md:grid-cols-3 gap-6 my-8">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clipboard className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Step 1: Create Profile</h3>
                    <p className="text-muted-foreground">Fill out your application profile once with your personal details, recovery history, and preferences.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Step 2: Apply to Homes</h3>
                    <p className="text-muted-foreground">Browse listings and submit your saved application to multiple homes with just a few clicks.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Step 3: Connect</h3>
                    <p className="text-muted-foreground">Communicate directly with providers, schedule tours, and finalize your placement.</p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">What to Include in Your Application</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                A strong sober living application includes several key elements. Start with your basic personal information – your name, contact details, and demographic information. You'll also need to provide emergency contact information, which is important for your safety and required by most homes.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Your recovery history is a crucial part of the application. Be prepared to share information about your substance use history, treatment you've completed, your current sobriety date, and any ongoing recovery support (such as therapy, meetings, or medication-assisted treatment). Providers use this information to assess whether their home is the right level of care for your needs.
              </p>

              <div className="bg-card border border-border rounded-lg p-6 my-8">
                <h3 className="text-xl font-bold text-white mb-4">Application Checklist</h3>
                <ul className="space-y-3">
                  {[
                    "Personal information (name, date of birth, contact details)",
                    "Emergency contact information",
                    "Recovery history and sobriety date",
                    "Treatment history (programs completed)",
                    "Employment or income information",
                    "Housing preferences (location, budget, amenities)",
                    "Photo ID (may be required)",
                    "References (some homes require these)"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">Tips for a Successful Application</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Being honest in your application is essential. Providers are experienced in working with people in recovery and understand that everyone's journey is different. Trying to hide or minimize your history can backfire and may result in placement in a home that isn't the right fit for your needs. Present yourself authentically and focus on your commitment to recovery.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Take your time completing your application thoroughly. Incomplete applications may be delayed or denied. Answer all questions fully and provide any requested documentation promptly. If you're unsure about something, it's better to ask for clarification than to guess.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Consider applying to multiple homes simultaneously. This increases your chances of finding a placement quickly and gives you options to compare. Sober Stay makes this easy by allowing you to save your application and submit it to multiple properties with just a few clicks.
              </p>

              <h2 className="text-3xl font-bold text-white mb-6 mt-12">What Happens After You Apply</h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                After submitting your application, providers will review your information and determine if you're a good fit for their home. This process can take anywhere from a few hours to several days, depending on the provider's workload and policies. Some providers may contact you for additional information or to schedule an interview.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Many homes offer tours or interviews as part of the application process. This is your opportunity to see the property, meet staff and possibly current residents, and ask questions. Take advantage of this chance to ensure the home feels right for you. Trust your instincts – you'll be living there, so it's important to feel comfortable with the environment.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Once you're accepted, you'll work with the provider to finalize move-in details, including the move-in date, required deposits, what to bring, and house rules. Be sure to ask about anything you're unsure of – understanding expectations upfront helps ensure a smooth transition.
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
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Application?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your application profile now and start applying to sober living homes today.
            </p>
            <Link href="/tenant-profile">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full">
                Create Application Profile
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default ApplyForSoberLiving;
