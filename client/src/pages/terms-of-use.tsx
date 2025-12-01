import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsOfUse() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Terms of Use</CardTitle>
            <p className="text-muted-foreground">Last Updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Sober Stay ("Platform"), you agree to be bound by these Terms of Use. If you do not agree to any part of these terms, you must not use the Platform. Sober Stay reserves the right to modify these terms at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Platform Description</h2>
              <p>
                Sober Stay is a technology platform that facilitates connections between individuals seeking recovery housing ("Tenants") and providers of sober living accommodations ("Providers"). Sober Stay is NOT a housing provider, treatment facility, healthcare provider, or employer. Sober Stay merely facilitates introductions between independent parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. User Eligibility</h2>
              <p>
                To use Sober Stay, you must be:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>At least 18 years old</li>
                <li>Able to legally enter into binding agreements</li>
                <li>Not prohibited from using the Platform under applicable law</li>
                <li>Truthful and accurate in all information provided</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. User Responsibilities</h2>
              <p>
                As a user, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, complete, and truthful information</li>
                <li>Maintain confidentiality of your account credentials</li>
                <li>Not share your account with others</li>
                <li>Not use the Platform for illegal or harmful purposes</li>
                <li>Not harass, threaten, or discriminate against other users</li>
                <li>Not engage in fraud or deceptive practices</li>
                <li>Not attempt to gain unauthorized access</li>
                <li>Conduct your own due diligence and background checks</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. Housing Arrangements</h2>
              <p>
                Sober Stay does NOT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Control or manage housing arrangements between users</li>
                <li>Process rental payments or hold funds in escrow</li>
                <li>Enforce lease agreements or rental contracts</li>
                <li>Resolve disputes between tenants and providers</li>
                <li>Conduct property inspections or certifications</li>
                <li>Verify property safety or habitability</li>
              </ul>
              <p className="mt-4">
                <strong>All housing arrangements are independent agreements between users, conducted outside of Sober Stay's participation or control.</strong> Users are responsible for negotiating terms, reviewing contracts, and resolving disputes directly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. Financial Transactions</h2>
              <p>
                Sober Stay does NOT process payments for housing arrangements. All rent, deposits, and fees are direct transactions between Tenants and Providers. Users are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Verifying Provider legitimacy before sending money</li>
                <li>Using secure payment methods</li>
                <li>Never sending upfront deposits before viewing property</li>
                <li>Obtaining written lease agreements</li>
                <li>Resolving payment disputes directly with the other party</li>
              </ul>
              <p className="mt-4">
                Sober Stay subscription fees are the only payments processed by Sober Stay. Providers pay $49/month per listing. Subscription charges renew monthly unless canceled.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. User-Generated Content</h2>
              <p>
                By posting listings, messages, photos, or other content on Sober Stay, you grant us a non-exclusive license to use, display, and distribute your content on the Platform. You retain ownership but consent to public display. You are solely responsible for content you post. Sober Stay is not liable for user-generated content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. Prohibited Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Post false, misleading, or deceptive information</li>
                <li>Engage in discrimination based on protected characteristics</li>
                <li>Violate Fair Housing Laws or housing discrimination statutes</li>
                <li>Post sexually explicit, violent, or hateful content</li>
                <li>Spam, harass, or abuse other users</li>
                <li>Solicit illegal goods or services</li>
                <li>Attempt to manipulate pricing or listings</li>
                <li>Reverse engineer or access platform code</li>
                <li>Interfere with platform security or operations</li>
              </ul>
              <p className="mt-4">
                Violations may result in account suspension or permanent ban.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">9. Reporting and Moderation</h2>
              <p>
                Users may report violations, scams, or safety concerns. Sober Stay will review reports and take appropriate action, which may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Removing inappropriate content</li>
                <li>Suspending user accounts</li>
                <li>Banning users from the Platform</li>
                <li>Reporting to law enforcement</li>
              </ul>
              <p className="mt-4">
                Sober Stay reserves discretion in moderation decisions. We are not obligated to remove content or penalize users, though we aim to maintain a safe community.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">10. Disclaimers and Limitations</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS-IS" WITHOUT WARRANTIES. SOBER STAY DOES NOT WARRANT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>User safety or legitimacy</li>
                <li>Property conditions or safety</li>
                <li>Accuracy of listings or information</li>
                <li>Uninterrupted platform availability</li>
                <li>Freedom from bugs or errors</li>
              </ul>
              <p className="mt-4">
                <strong>LIMITATION OF LIABILITY:</strong> Sober Stay's total liability for any claim is $0. Sober Stay is not liable for indirect, consequential, special, or punitive damages.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">11. Intellectual Property</h2>
              <p>
                Sober Stay owns all rights to the Platform, including design, features, and functionality. You may not copy, modify, or distribute Platform code without permission. All trademarks and logos are property of Sober Stay, Inc.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">12. Termination</h2>
              <p>
                Sober Stay may suspend or terminate your account:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For violations of these Terms</li>
                <li>For illegal activity</li>
                <li>For abuse or harassment</li>
                <li>For inactivity (30+ days)</li>
                <li>At our sole discretion</li>
              </ul>
              <p className="mt-4">
                You may terminate your account anytime by contacting support.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">13. Dispute Resolution</h2>
              <p>
                Any disputes between users must be resolved directly between the parties. Sober Stay does not mediate, arbitrate, or adjudicate user disputes. For disputes involving Sober Stay, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>First attempt good-faith resolution with support</li>
                <li>Submit to binding arbitration (not litigation)</li>
                <li>Waive rights to class action lawsuits</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">14. Governing Law</h2>
              <p>
                These Terms are governed by applicable state laws. You consent to jurisdiction in state courts and waive jury trial rights for disputes with Sober Stay.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">15. Severability</h2>
              <p>
                If any provision is unenforceable, remaining provisions remain valid and in effect.
              </p>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground bg-amber-500/10 p-4 rounded">
              <p className="font-bold text-amber-200">
                BY USING SOBER STAY, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE, DO NOT USE THE PLATFORM.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
