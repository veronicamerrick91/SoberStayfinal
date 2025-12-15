import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  CheckCircle, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart, 
  MessageSquare,
  Star,
  Home,
  ArrowRight,
  Clock,
  Zap,
  Award
} from "lucide-react";
import { useDocumentMeta } from "@/lib/use-document-meta";
import { useState } from "react";

const benefits = [
  {
    icon: Users,
    title: "Reach More Residents",
    description: "Connect with thousands of people searching for sober living homes every month."
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description: "Stand out with our verification badge that builds trust with potential residents."
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    description: "Track views, inquiries, and applications to understand your listing performance."
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Communicate directly with prospective residents through our secure messaging system."
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Simple, transparent pricing with no hidden fees. Cancel anytime."
  },
  {
    icon: Zap,
    title: "Quick Setup",
    description: "Create your listing in minutes with our easy-to-use listing builder."
  }
];

const steps = [
  {
    number: "1",
    title: "Create Your Account",
    description: "Sign up for free and complete your provider profile with your business information."
  },
  {
    number: "2",
    title: "Build Your Listing",
    description: "Add photos, amenities, pricing, and house rules to showcase your property."
  },
  {
    number: "3",
    title: "Get Verified",
    description: "Complete our verification process to earn a trusted badge on your listing."
  },
  {
    number: "4",
    title: "Start Receiving Applications",
    description: "Connect with qualified residents and grow your sober living community."
  }
];

const faqs = [
  {
    question: "How much does it cost to list my sober living home?",
    answer: "Our subscription is $49/month or $399/year (save $189). This includes unlimited applications, messaging, analytics, and verified badge. There are no additional fees or commissions."
  },
  {
    question: "How do I get my listing verified?",
    answer: "Verification includes confirming your business registration, property ownership or management rights, and adherence to local regulations. Our team will guide you through the process."
  },
  {
    question: "Can I list multiple properties?",
    answer: "Yes! With a subscription, you can list multiple sober living homes under one account. Each property gets its own dedicated listing page."
  },
  {
    question: "How do residents find my listing?",
    answer: "Your listing appears in our directory when people search for sober living in your area. We also optimize listings for Google search so potential residents can find you directly."
  },
  {
    question: "What information do I need to create a listing?",
    answer: "You'll need property photos, pricing, amenities, house rules, and a description of your home. The more details you provide, the better your listing will perform."
  },
  {
    question: "Can I edit my listing after publishing?",
    answer: "Absolutely! You can update your listing anytime - add new photos, change pricing, update availability, and more."
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Sober Living Operator, California",
    text: "Sober Stay has transformed how we connect with residents. We've filled every bed and the application process is so smooth."
  },
  {
    name: "James R.",
    role: "Recovery Housing Manager, Florida",
    text: "The analytics dashboard helps us understand what's working. We've doubled our applications since joining."
  },
  {
    name: "Maria L.",
    role: "Women's Sober Living Owner, Texas",
    text: "Professional, easy to use, and the support team is amazing. Highly recommend for any sober living operator."
  }
];

export function ForProviders() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useDocumentMeta({
    title: "List Your Sober Living Home | For Providers | Sober Stay",
    description: "List your sober living home on Sober Stay. Reach thousands of people seeking recovery housing. Get verified, receive applications, and grow your community. Start for $49/month."
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <nav className="container mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-primary" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span>/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-white" itemProp="name">For Providers</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by 500+ Sober Living Operators</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                List Your Sober Living Home
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with thousands of people seeking recovery housing. 
                Get verified, receive applications, and grow your sober living community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup?role=provider">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full" data-testid="button-get-started">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full" data-testid="button-view-pricing">
                    View Pricing
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                No credit card required to create account
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why List on Sober Stay?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join the leading platform connecting sober living operators with people in recovery.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <benefit.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-muted-foreground">Get your listing live in four simple steps</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">No hidden fees. No commissions. Cancel anytime.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">$49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unlimited property listings
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Verified badge
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Analytics dashboard
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Direct messaging
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Cancel anytime
                    </li>
                  </ul>
                  <Link href="/signup?role=provider">
                    <Button className="w-full" variant="outline" data-testid="button-monthly-plan">
                      Start Monthly
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Annual</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">$399</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <p className="text-green-500 text-sm mb-4">Save $189 compared to monthly</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Everything in Monthly
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Featured listings
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      SEO optimization tools
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      2 months free
                    </li>
                  </ul>
                  <Link href="/signup?role=provider">
                    <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-annual-plan">
                      Start Annual
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">What Providers Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" itemScope itemType="https://schema.org/FAQPage">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-border rounded-lg overflow-hidden"
                  itemScope 
                  itemProp="mainEntity" 
                  itemType="https://schema.org/Question"
                >
                  <button
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-card/50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    data-testid={`faq-toggle-${index}`}
                  >
                    <h3 className="font-medium text-white" itemProp="name">{faq.question}</h3>
                    <span className="text-primary">{expandedFaq === index ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === index && (
                    <div 
                      className="p-4 pt-0 text-muted-foreground"
                      itemScope 
                      itemProp="acceptedAnswer" 
                      itemType="https://schema.org/Answer"
                    >
                      <p itemProp="text">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Grow Your Sober Living Community?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of sober living operators who trust Sober Stay to connect them with residents.
            </p>
            <Link href="/signup?role=provider">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full" data-testid="button-cta-get-started">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "List Your Sober Living Home | For Providers",
              "description": "List your sober living home on Sober Stay. Reach thousands of people seeking recovery housing.",
              "url": "https://soberstay.com/for-providers",
              "publisher": {
                "@type": "Organization",
                "name": "Sober Stay",
                "url": "https://soberstay.com"
              }
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Sober Stay Provider Subscription",
              "description": "List your sober living home and connect with residents seeking recovery housing.",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Monthly Subscription",
                  "price": "49.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "Annual Subscription",
                  "price": "399.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              ]
            })
          }}
        />
      </div>
    </Layout>
  );
}

export default ForProviders;
