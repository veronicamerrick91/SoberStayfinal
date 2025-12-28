import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, AlertTriangle, Shield, Users } from "lucide-react";

export function SafetyReporting() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-bold text-white">Safety & Reporting</h1>
            <p className="text-lg text-muted-foreground">
              Your safety matters. We're committed to maintaining a safe community.
            </p>
          </div>

          {/* Safety Tips */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">Safety Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Verify Before Committing",
                  tips: [
                    "Research the provider and property thoroughly",
                    "Conduct your own background check",
                    "Inspect the property in person",
                    "Speak with current residents if possible",
                    "Check online reviews and references"
                  ]
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Protect Your Information",
                  tips: [
                    "Never wire money before seeing property",
                    "Don't share SSN until ready to apply",
                    "Use secure payment methods",
                    "Meet in public before visiting property",
                    "Tell someone where you'll be"
                  ]
                },
                {
                  icon: <AlertTriangle className="w-8 h-8" />,
                  title: "Red Flags to Watch",
                  tips: [
                    "Pressure to move in immediately",
                    "Requests for payment upfront",
                    "Unwillingness to meet in person",
                    "Unrealistic prices or too-good-to-be-true offers",
                    "Evasive about house rules or policies"
                  ]
                },
                {
                  icon: <Flag className="w-8 h-8" />,
                  title: "Trust Your Instincts",
                  tips: [
                    "If something feels wrong, it probably is",
                    "Don't ignore uncomfortable feelings",
                    "You have the right to decline any situation",
                    "Your safety comes before politeness",
                    "It's okay to say no and look elsewhere"
                  ]
                }
              ].map((section, i) => (
                <Card key={i} className="bg-white/5 border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{section.icon}</div>
                      <CardTitle className="text-white">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How to Report */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">How to Report a Problem</h2>
            
            <Card className="bg-gradient-to-r from-red-500/20 to-red-500/5 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Report a Listing or User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white font-bold mb-2">On a Listing:</p>
                  <ol className="space-y-2 text-gray-300 text-sm">
                    <li>1. Find the listing you want to report</li>
                    <li>2. Click the flag icon in the top right</li>
                    <li>3. Select the reason (Safety Concern, Scam, Inappropriate Content, Contact Issues, Other)</li>
                    <li>4. Provide details about why you're reporting</li>
                    <li>5. Submit - our team will review within 24 hours</li>
                  </ol>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">On a User (Message):</p>
                  <ol className="space-y-2 text-gray-300 text-sm">
                    <li>1. Go to your messages</li>
                    <li>2. Find the conversation with the user</li>
                    <li>3. Click the flag icon in the message</li>
                    <li>4. Select the reason (Harassment, Inappropriate Content, Spam, Scam, Other)</li>
                    <li>5. Submit - we'll investigate and take action</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-border">
              <CardHeader>
                <CardTitle className="text-white">Report Categories Explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white font-bold mb-1">Safety Concern</p>
                  <p className="text-gray-300 text-sm">Property conditions, neighborhood safety, unsafe practices, health hazards, or concerns about other residents.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Scam</p>
                  <p className="text-gray-300 text-sm">Fraudulent listings, fake properties, nonexistent homes, money demanded upfront, or deceptive practices.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Inappropriate Content</p>
                  <p className="text-gray-300 text-sm">Offensive photos, discriminatory language, harassment, threats, or sexually explicit content.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Contact Issues</p>
                  <p className="text-gray-300 text-sm">Attempts to move communication off-platform, requests for personal information, or pressure to bypass Sober Stay.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Discrimination</p>
                  <p className="text-gray-300 text-sm">Housing discrimination based on race, religion, disability, sexual orientation, family status, or other protected characteristics.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* What Happens After Report */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">What Happens After You Report</h2>
            
            <Card className="bg-white/5 border-border">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-white font-bold mb-2">1. Immediate Review (24 hours)</p>
                  <p className="text-gray-300">Our team reviews the report to determine if platform guidelines were violated.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">2. Investigation (3-5 days)</p>
                  <p className="text-gray-300">We gather additional information, contact the reported user if needed, and investigate thoroughly.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">3. Action Taken</p>
                  <p className="text-gray-300">Depending on findings: content may be removed, listing suspended, user suspended, or account permanently banned.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">4. Notification</p>
                  <p className="text-gray-300">You'll receive confirmation that your report was received. Serious reports may involve law enforcement.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">5. Ongoing Monitoring</p>
                  <p className="text-gray-300">We monitor for repeat offenders and take escalated action if patterns emerge.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Legal Issues */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">When to Contact Authorities</h2>
            
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="pt-6 space-y-4">
                <p className="text-white font-bold">Contact law enforcement immediately if you experience:</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Fraud or financial crime</li>
                  <li>• Theft or property crime</li>
                  <li>• Assault, violence, or threat of violence</li>
                  <li>• Sexual harassment or assault</li>
                  <li>• Unsafe living conditions (no heat, structural hazards, etc.)</li>
                  <li>• Illegal activity</li>
                </ul>
                <p className="text-gray-300 text-sm mt-4">
                  <strong>Call 911 for emergencies</strong>. Contact your local police non-emergency line to file reports.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-border">
              <CardHeader>
                <CardTitle className="text-white">Housing Discrimination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  If you've experienced housing discrimination, file a complaint with:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><strong className="text-white">HUD Fair Housing Office</strong></p>
                  <p className="text-gray-300">Phone: 1-800-669-9777</p>
                  <p className="text-gray-300">Website: hud.gov/fairhousing</p>
                  <p className="text-gray-300">Time limit: Within 1 year of discrimination</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-white">Report an Urgent Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you need to report a serious issue or discuss a safety concern privately:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>📧 <strong className="text-white">Email:</strong> support@soberstayhomes.com</p>
                <p>📱 <strong className="text-white">Phone:</strong> (877)56-SOBER</p>
                <p>⚠️ <strong className="text-white">Emergencies:</strong> Call 911</p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <p className="text-amber-200 text-sm leading-relaxed">
                <strong>Important:</strong> Sober Stay is a platform that connects users. While we take safety seriously and monitor for violations, we cannot guarantee user safety. You are responsible for verifying information, inspecting properties, conducting background checks, and making informed decisions. If you feel unsafe at any time, trust your instincts and seek help immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
