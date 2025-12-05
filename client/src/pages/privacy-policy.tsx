import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last Updated: October 2025</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Introduction</h2>
              <p>
                Sober Stay, Inc. ("Company," "we," "us," "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
              <p className="font-bold text-white">We collect information you provide directly:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account registration (name, email, phone, role)</li>
                <li>Profile information (bio, recovery details, housing preferences)</li>
                <li>Application submissions (personal history, references, employment)</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Communication content (messages, chat history)</li>
                <li>Document uploads (photos, identification, verification documents)</li>
              </ul>
              <p className="font-bold text-white mt-4">Information collected automatically:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on platform</li>
                <li>Cookies and tracking technologies</li>
                <li>Location data (if enabled)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and operate the Sober Stay platform</li>
                <li>Facilitate connections between tenants and providers</li>
                <li>Process applications and manage listings</li>
                <li>Enable messaging and communications</li>
                <li>Process payments (via third-party payment processors)</li>
                <li>Send service updates and notifications</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and abuse</li>
                <li>Improve platform features and user experience</li>
                <li>Respond to user inquiries and support requests</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. How We Share Information</h2>
              <p>
                We share information with matched users (tenant/provider) to facilitate connections. We may share information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Other users of the platform (as necessary for housing arrangements)</li>
                <li>Service providers (payment processors, email services, hosting providers)</li>
                <li>Law enforcement (when required by law)</li>
                <li>Legal advisors (for compliance purposes)</li>
              </ul>
              <p className="mt-4">
                <strong>We DO NOT:</strong> sell personal information, share for marketing purposes, or disclose to third parties without consent (except as legally required).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encrypted databases for data at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security audits</li>
                <li>Secure password requirements</li>
              </ul>
              <p className="mt-4">
                However, no security system is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide services and maintain your account</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p className="mt-4">
                You may request data deletion subject to legal retention requirements. Deleted account data may persist in backups for 90 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. Your Privacy Rights</h2>
              <p>Depending on your location, you may have rights to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Restrict processing of your information</li>
                <li>Request portability of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact: support@soberstayhomes.com
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. Cookies and Tracking</h2>
              <p>
                We use cookies to enhance user experience and track platform usage. You can control cookie preferences in your browser settings. Disabling cookies may limit platform functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">9. Third-Party Links</h2>
              <p>
                Sober Stay may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before sharing information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">10. Children's Privacy</h2>
              <p>
                Sober Stay is not intended for users under 18. We do not knowingly collect information from minors. If we discover we've collected data from a minor, we will delete it immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">11. Policy Changes</h2>
              <p>
                We may update this Privacy Policy periodically. Material changes will be communicated via email or prominent notification. Continued use of Sober Stay constitutes acceptance of updates.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">12. Contact Us</h2>
              <p>
                For privacy questions or to exercise your rights:
              </p>
              <p className="mt-2 text-white">
                📧 Email: support@soberstayhomes.com<br />
                📱 Phone: 1-800-SOBER-STAY<br />
                💬 Help: support@soberstayhomes.com
              </p>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground bg-blue-500/10 p-4 rounded">
              <p className="font-bold text-blue-400">
                Your privacy is important to us. We collect minimal information necessary to operate the platform and connect users safely and securely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
