import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last Updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Introduction</h2>
              <p>
                Sober Stay ("Company," "we," "us," "our") operates as a digital platform that connects individuals seeking recovery housing with verified sober living providers. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal information in connection with our services.
              </p>
              <p>
                By accessing or using Sober Stay, you acknowledge you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
              <p><strong className="text-white">2.1 Information You Provide:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email, phone number, password)</li>
                <li>Profile information (recovery status, housing preferences, medical history disclosures)</li>
                <li>Application materials (references, background information)</li>
                <li>Communication records (messages between users)</li>
                <li>Payment information (processed through third-party payment processors; we do not store card details)</li>
              </ul>
              
              <p><strong className="text-white">2.2 Automatically Collected Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and device identifiers</li>
                <li>Browser type, operating system, referring URLs</li>
                <li>Pages visited and time spent on platform</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <p><strong className="text-white">2.3 Third-Party Information:</strong></p>
              <p>
                We may receive information about you from third parties, including payment processors and verification services. We are not responsible for third-party privacy practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
              <p>We use personal information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our platform</li>
                <li>Process applications and facilitate connections between users</li>
                <li>Process payments and subscriptions</li>
                <li>Communicate with you regarding your account</li>
                <li>Enforce our Terms of Use and other agreements</li>
                <li>Prevent fraud and detect security incidents</li>
                <li>Comply with legal obligations</li>
                <li>Send administrative communications (not marketing without consent)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. Information Sharing</h2>
              <p>
                We share personal information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Between matched users (tenant/provider) as necessary for connection purposes</li>
                <li>With service providers (payment processors, hosting providers) under strict confidentiality agreements</li>
                <li>When required by law or in response to lawful government requests</li>
                <li>To protect rights, privacy, safety, or property of our users or the public</li>
                <li>In connection with a merger, acquisition, bankruptcy, or sale of assets (we will provide notice)</li>
              </ul>
              <p>
                <strong className="text-white">We do not sell personal information to third parties.</strong> We do not share medical or treatment history information with anyone except as directly necessary for user-to-user connections or legal requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encryption, firewalls, and access controls to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable. We cannot guarantee absolute security.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. Your Rights and Choices</h2>
              <p>
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal retention requirements)</li>
                <li>Opt-out of certain communications</li>
                <li>Data portability (export your information)</li>
              </ul>
              <p>
                To exercise these rights, contact us at privacy@soberstay.com. We will respond within 30 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. Retention</h2>
              <p>
                We retain personal information for as long as necessary to provide services, comply with legal obligations, or resolve disputes. Account information may be retained for up to 3 years after account closure for legal and business purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. Children</h2>
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect information from minors. If we become aware of such collection, we will delete the information promptly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">9. International Users</h2>
              <p>
                If you access our services from outside the United States, your information may be transferred to and stored in the United States. By using our services, you consent to this transfer.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">10. Changes to Privacy Policy</h2>
              <p>
                We may update this policy periodically. Continued use of our services after changes constitutes acceptance of the revised policy. We will provide notice of material changes via email or platform notification.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">11. Contact Us</h2>
              <p>
                For privacy-related inquiries, contact:
              </p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-white">Sober Stay</p>
                <p>Email: privacy@soberstay.com</p>
                <p>Address: Privacy Department, Sober Stay, Inc.</p>
              </div>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground">
              <p>© 2024 Sober Stay, Inc. All rights reserved. This Privacy Policy is provided "as-is" without warranty.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
