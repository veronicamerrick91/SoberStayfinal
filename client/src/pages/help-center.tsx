import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          q: "What is Sober Stay?",
          a: "Sober Stay is a digital platform that connects individuals seeking recovery housing with verified sober living providers. We help you find community-based recovery housing options that support your path to long-term sobriety."
        },
        {
          q: "Is Sober Stay a treatment provider?",
          a: "No. Sober Stay is a connection platform only. We do not provide medical services, counseling, therapy, or treatment. Sober living homes are recovery support environments, not treatment facilities. For treatment services, consult a healthcare provider."
        },
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' and choose your role (Tenant or Provider). Fill in your information, verify your email, and complete your profile. Tenants should be honest about their recovery background and housing needs."
        }
      ]
    },
    {
      category: "For Tenants",
      items: [
        {
          q: "How do I search for housing?",
          a: "Log in and go to Browse. Filter by location, price range, gender requirements, and amenities. Click on listings to view details, photos, and house rules. Message providers with questions."
        },
        {
          q: "What should I include in my application?",
          a: "Be honest and complete. Include your recovery timeline, sobriety date, recovery commitments, employment status, references, and why this specific home is right for you. Providers value authenticity."
        },
        {
          q: "How do I message a provider?",
          a: "Click 'Chat' on any listing. Introduce yourself and ask questions. Get to know the community before applying. Ask about daily structure, support services, house culture, and expectations."
        },
        {
          q: "What happens after I apply?",
          a: "Providers review your application, typically within 2-5 business days. They may approve, deny, or request more information. You'll receive updates through the platform. If approved, coordinate move-in details directly with the provider."
        },
        {
          q: "Can I apply to multiple homes?",
          a: "Yes, you can apply to multiple listings. It's smart to have multiple options. Be upfront about your timeline and flexibility."
        }
      ]
    },
    {
      category: "For Providers",
      items: [
        {
          q: "What documents do I need to verify?",
          a: "Submit: Business License, Insurance Certificate, Facility Photos, Safety Compliance Report, and Property Inspection Report. These documents help tenants trust your facility and ensure legitimacy."
        },
        {
          q: "How much does a listing cost?",
          a: "$49/month per property listing. This includes unlimited messages, application management, and platform access. You can cancel anytime."
        },
        {
          q: "How do I review tenant applications?",
          a: "Applications appear in your dashboard. Review each tenant's recovery background, references, and fit with your home. Approve, deny, or request additional information. Communicate respectfully."
        },
        {
          q: "What should I include in my listing?",
          a: "Clear pricing, house rules, amenities, number of beds, gender requirements, daily schedule, support services, neighborhood info, and your philosophy. Include quality photos and honest descriptions."
        }
      ]
    },
    {
      category: "Safety & Security",
      items: [
        {
          q: "How is my information protected?",
          a: "We encrypt all data in transit and at rest. We never sell your information. We only share between matched users as needed. See our Privacy Policy for full details."
        },
        {
          q: "What should I do if I feel unsafe?",
          a: "Trust your instincts. Leave any situation that feels unsafe. Contact local law enforcement immediately. Use the platform's safety reporting feature to alert us. Call 911 in emergencies."
        },
        {
          q: "Can I report a user or listing?",
          a: "Yes. Click the flag icon on any listing or message. Report scams, safety concerns, inappropriate behavior, or violations. Our team reviews all reports and takes action."
        }
      ]
    },
    {
      category: "Billing & Accounts",
      items: [
        {
          q: "What payment methods do you accept?",
          a: "Credit card, debit card, and bank transfers. Payments are processed securely through our payment partner. Provider subscriptions renew monthly."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, anytime. Providers can cancel subscriptions from their dashboard. No penalty or early termination fee."
        },
        {
          q: "Is Sober Stay responsible for rent or lease disputes?",
          a: "No. All rental payments and lease agreements are between tenants and providers. Sober Stay is not involved in financial transactions. Resolve disputes directly."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-bold text-white">Help Center</h1>
            <p className="text-lg text-muted-foreground">
              Find answers, get support, and learn how to use Sober Stay
            </p>
          </div>

          {/* Contact Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "📧", title: "Email", text: "support@soberstay.com" },
              { icon: "📱", title: "Phone", text: "1-800-SOBER-STAY" },
              { icon: "🎯", title: "Response Time", text: "Within 24 hours" }
            ].map((item, i) => (
              <Card key={i} className="bg-white/5 border-border text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="text-white font-bold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-6">
            {faqs.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <Card key={itemIdx} className="bg-white/5 border-border hover:border-primary/30 transition-colors">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === itemIdx ? null : itemIdx)}
                        className="w-full p-4 flex items-start justify-between hover:bg-white/5 transition-colors"
                      >
                        <span className="text-white font-medium text-left pr-4">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${expandedFaq === itemIdx ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFaq === itemIdx && (
                        <div className="px-4 pb-4 border-t border-border/50 pt-4">
                          <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-white">Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Can't find your answer? Contact our support team and we'll help within 24 hours.
              </p>
              <div className="space-y-3">
                <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <textarea placeholder="Your question or issue..." rows={4} className="w-full px-4 py-2 rounded-lg bg-background/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="bg-white/5 border-border">
            <CardHeader>
              <CardTitle className="text-white">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">• <a href="/terms-of-use" className="text-primary hover:underline">Terms of Use</a></p>
                <p className="text-gray-300">• <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a></p>
                <p className="text-gray-300">• <a href="/disclaimer" className="text-primary hover:underline">Disclaimer</a></p>
                <p className="text-gray-300">• <a href="/safety-reporting" className="text-primary hover:underline">Safety & Reporting</a></p>
                <p className="text-gray-300">• <a href="/blog" className="text-primary hover:underline">Blog & Resources</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
