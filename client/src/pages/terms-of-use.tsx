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
              <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
              <p>
                By accessing and using Sober Stay ("Platform," "Service," "we," "us"), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree to any of these terms, you are prohibited from using or accessing this Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
              <p>
                Sober Stay is a digital platform that facilitates introductions between individuals seeking recovery housing ("Tenants") and providers of sober living accommodations ("Providers"). We are a technology-enabled marketplace, not a housing provider, property manager, or recovery services provider.
              </p>
              <p className="text-white font-bold">
                We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Own or operate sober living facilities</li>
                <li>Employ or control Providers or Tenants</li>
                <li>Provide treatment, counseling, or medical services</li>
                <li>Conduct background checks or medical evaluations</li>
                <li>Guarantee property conditions, safety, or services</li>
                <li>Monitor or enforce agreements between users</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. Eligibility</h2>
              <p>
                You must be at least 18 years old to use this Platform. By using our Service, you represent and warrant that you meet all eligibility requirements and that any information you provide is accurate and complete.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. User Responsibilities</h2>
              <p>
                <strong className="text-white">4.1 Tenant Responsibilities:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide truthful information in applications and communications</li>
                <li>Comply with Provider house rules and facility policies</li>
                <li>Pay rent and fees as agreed directly with Provider</li>
                <li>Maintain all agreements and contracts with Providers</li>
                <li>Report safety concerns to appropriate authorities</li>
              </ul>

              <p><strong className="text-white">4.2 Provider Responsibilities:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain accurate property and service information</li>
                <li>Comply with all applicable housing and safety codes</li>
                <li>Possess necessary licenses and certifications</li>
                <li>Provide safe and clean accommodations</li>
                <li>Respect Tenants' privacy and dignity</li>
              </ul>

              <p><strong className="text-white">4.3 Prohibited Conduct:</strong></p>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide false, misleading, or defamatory information</li>
                <li>Engage in harassment, discrimination, or abuse</li>
                <li>Attempt to circumvent our platform to avoid fees</li>
                <li>Violate local, state, or federal laws</li>
                <li>Interfere with Platform functionality or security</li>
                <li>Engage in fraudulent activity</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. Payment Terms</h2>
              <p>
                Providers subscribe to Sober Stay at $49/month per listing. Subscription fees are non-refundable. Payment is processed monthly and can be canceled anytime. Tenant-Provider financial arrangements (rent, fees, deposits) are independent transactions for which Sober Stay bears no responsibility.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. Disclaimer of Warranties</h2>
              <p className="text-white font-bold">
                SOBER STAY PROVIDES THE PLATFORM "AS-IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Platform will be uninterrupted, secure, or error-free</li>
                <li>Information on the Platform is accurate or complete</li>
                <li>Defects will be corrected</li>
                <li>The Platform is free from viruses or harmful components</li>
                <li>Users or housing arrangements will be suitable or safe</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. Limitation of Liability</h2>
              <p className="text-white font-bold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOBER STAY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR EMOTIONAL DISTRESS, ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM OR THIS AGREEMENT, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED $100.
              </p>
              <p>
                This limitation applies to all causes of action, whether based on warranty, contract, tort, or any other legal theory, including but not limited to claims arising from housing conditions, Provider conduct, Tenant behavior, fraud, or platform disruptions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Sober Stay, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any law or third-party right</li>
                <li>Any transaction or interaction with other users</li>
                <li>Your housing arrangement with any Provider</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">9. User Verification Disclaimer</h2>
              <p>
                While Sober Stay implements verification procedures, we do not guarantee the accuracy, legitimacy, or safety of any user or property. We make no representations regarding:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>User identity or background</li>
                <li>Property safety, condition, or compliance with codes</li>
                <li>Provider qualifications or licensing</li>
                <li>Tenant sobriety status or reliability</li>
              </ul>
              <p>
                Users are solely responsible for conducting their own due diligence, inspections, and background checks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">10. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Sober Stay (including design, text, graphics, logos, icons, images, audio clips, video clips, and data compilation) are owned by Sober Stay, its licensors, or other providers and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, modify, or distribute any Platform content without our prior written consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">11. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of [State], without regard to conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located within [Jurisdiction] for resolution of any disputes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">12. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">13. Entire Agreement</h2>
              <p>
                These Terms, along with our Privacy Policy, constitute the entire agreement between you and Sober Stay regarding your use of the Platform and supersede all prior and contemporaneous agreements, understandings, and negotiations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">14. Modification</h2>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will provide notice of material changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">15. Contact Information</h2>
              <p>
                For questions or concerns regarding these Terms:
              </p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-white">Sober Stay Legal Team</p>
                <p>Email: legal@soberstay.com</p>
              </div>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground">
              <p>© 2024 Sober Stay, Inc. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
