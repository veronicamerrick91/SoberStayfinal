import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Home, MessageSquare, Lock, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-bold text-white">How Sober Stay Works</h1>
            <p className="text-xl text-muted-foreground">
              Connecting individuals in recovery with verified sober living communities
            </p>
          </div>

          {/* For Tenants */}
          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-white">For Tenants</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "1. Create Your Profile",
                  desc: "Sign up as a Tenant and build your profile with recovery information, housing preferences, and personal details. Be honest and complete - providers value authenticity."
                },
                {
                  icon: <Home className="w-8 h-8" />,
                  title: "2. Browse Verified Homes",
                  desc: "Explore verified sober living homes in your area. View photos, amenities, house rules, and provider information. Filter by location, price, and house type."
                },
                {
                  icon: <MessageSquare className="w-8 h-8" />,
                  title: "3. Connect with Providers",
                  desc: "Use secure messaging to ask questions, learn more about house culture, and build relationships before applying. Get to know the community first."
                },
                {
                  icon: <Check className="w-8 h-8" />,
                  title: "4. Submit Applications",
                  desc: "When you find the right fit, submit an application. Include your story, references, and what you're looking for in recovery housing."
                },
                {
                  icon: <Lock className="w-8 h-8" />,
                  title: "5. Interview & Approval",
                  desc: "Providers review your application and may request additional information or schedule an interview. They'll confirm acceptance or move to another home."
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "6. Move In & Thrive",
                  desc: "Once approved, coordinate move-in details directly with your provider. Join the recovery community and begin your next chapter."
                }
              ].map((step, i) => (
                <Card key={i} className="bg-white/5 border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/20 text-primary">
                        {step.icon}
                      </div>
                      <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* For Providers */}
          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-white">For Providers</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "1. Create Provider Account",
                  desc: "Register as a Sober Living Provider and build your company profile. Highlight your philosophy, amenities, and community values."
                },
                {
                  icon: <Lock className="w-8 h-8" />,
                  title: "2. Verify Your Credentials",
                  desc: "Submit required documents (Business License, Insurance, Photos, Compliance Reports) for verification. Our team reviews for completeness."
                },
                {
                  icon: <Home className="w-8 h-8" />,
                  title: "3. List Your Properties",
                  desc: "Create detailed listings for each property. Set capacity, pricing, house rules, and amenities. Upload photos and descriptions that showcase your homes."
                },
                {
                  icon: <MessageSquare className="w-8 h-8" />,
                  title: "4. Connect with Tenants",
                  desc: "Respond to tenant messages and inquiries. Answer questions about house culture, daily schedules, support services, and community values."
                },
                {
                  icon: <Check className="w-8 h-8" />,
                  title: "5. Review Applications",
                  desc: "Review incoming applications from interested tenants. Make decisions based on fit, recovery stage, and your home's dynamics. Provide feedback when needed."
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "6. Welcome New Residents",
                  desc: "Approve qualified candidates and welcome them to your community. Provide onboarding support and help them integrate into house life."
                }
              ].map((step, i) => (
                <Card key={i} className="bg-white/5 border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/20 text-primary">
                        {step.icon}
                      </div>
                      <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-white">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Secure Messaging", desc: "Direct communication between tenants and providers for a personal touch" },
                { title: "Verified Listings", desc: "All providers go through verification for safety and legitimacy" },
                { title: "Recovery-Focused", desc: "Built specifically for the recovery housing community" },
                { title: "Detailed Profiles", desc: "Share your story and find the right fit for your recovery" },
                { title: "Application Management", desc: "Easy-to-use system for submitting and reviewing applications" },
                { title: "Community Support", desc: "Join a network of individuals committed to recovery and community" }
              ].map((feature, i) => (
                <Card key={i} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Important Info */}
          <section className="space-y-6 p-8 rounded-lg bg-white/5 border border-border">
            <h2 className="text-2xl font-bold text-white">Important to Know</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300"><strong className="text-white">Sober Stay is a platform only</strong> - We connect people to housing but do not provide treatment, counseling, or medical services</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300"><strong className="text-white">Housing arrangements are independent</strong> - Rent, fees, and lease terms are direct between tenants and providers</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300"><strong className="text-white">Do your due diligence</strong> - Verify property conditions, provider credentials, and agreements before moving</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300"><strong className="text-white">Trust your instincts</strong> - A good fit goes both ways. Take time to connect before committing</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300"><strong className="text-white">Recovery is a journey</strong> - Finding the right housing is an important step. You're not alone in this process</span>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <div className="text-center space-y-4 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
            <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
            <p className="text-gray-300">Join the Sober Stay community and find your recovery housing today</p>
            <div className="flex gap-4 justify-center">
              <a href="/for-tenants">
                <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  I'm Seeking Housing
                </button>
              </a>
              <a href="/for-providers">
                <button className="px-8 py-3 rounded-lg bg-white/10 text-primary hover:bg-white/20 font-medium border border-primary/30">
                  I'm a Provider
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
