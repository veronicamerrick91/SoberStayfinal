import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon, AlertCircle } from "lucide-react";

export function CrisisResources() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Emergency Banner */}
          <div className="bg-red-500/20 border-2 border-red-500 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-3xl font-bold text-red-400 mb-2">In Crisis? Get Help NOW</h1>
                <p className="text-white text-lg font-bold">CALL 988 (Suicide & Crisis Lifeline) • Text HOME to 741741 • Call 911 for Emergency</p>
              </div>
            </div>
          </div>

          {/* National Hotlines */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">National Crisis & Recovery Hotlines</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  name: "988 Suicide & Crisis Lifeline",
                  number: "988 (CALL or TEXT)",
                  hours: "24/7, Free & Confidential",
                  desc: "Support for suicidal thoughts, emotional distress, and mental health crisis",
                  color: "red"
                },
                {
                  name: "SAMHSA National Helpline",
                  number: "1-800-662-4357",
                  hours: "24/7, Free & Confidential",
                  desc: "Substance abuse and mental health treatment referral and information service",
                  color: "blue"
                },
                {
                  name: "Crisis Text Line",
                  number: "Text HOME to 741741",
                  hours: "24/7, Free & Confidential",
                  desc: "Crisis support via text message for any crisis situation",
                  color: "green"
                },
                {
                  name: "National Domestic Violence Hotline",
                  number: "1-800-799-7233",
                  hours: "24/7, Free & Confidential",
                  desc: "Support for domestic violence and abuse situations",
                  color: "purple"
                },
                {
                  name: "NAMI Helpline (Mental Illness)",
                  number: "1-800-950-6264",
                  hours: "Mon-Fri, 10am-10pm ET",
                  desc: "Information and support for mental health conditions",
                  color: "indigo"
                },
                {
                  name: "The Trevor Project (LGBTQ+)",
                  number: "1-866-488-7386",
                  hours: "24/7, Free & Confidential",
                  desc: "Crisis support for LGBTQ+ youth experiencing suicidal thoughts",
                  color: "pink"
                }
              ].map((hotline, i) => (
                <Card key={i} className={`bg-white/5 border-2 border-${hotline.color}-500/50 hover:border-${hotline.color}-500 transition-colors`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <PhoneIcon className={`w-6 h-6 text-${hotline.color}-400 flex-shrink-0 mt-1`} />
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{hotline.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xl font-bold text-primary">{hotline.number}</p>
                    <p className="text-sm text-muted-foreground">{hotline.hours}</p>
                    <p className="text-gray-300 text-sm">{hotline.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Local Resources */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">Finding Local Resources</h2>
            
            <div className="space-y-4">
              <Card className="bg-white/5 border-border">
                <CardHeader>
                  <CardTitle className="text-white">Treatment & Recovery Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300">
                    Search for treatment facilities, support groups, and recovery resources in your area:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-300">• <strong>Treatment.com</strong> - Find addiction treatment centers nationwide</li>
                    <li className="text-gray-300">• <strong>AA/NA Meetings</strong> - Search for meetings at AA.org or NA.org</li>
                    <li className="text-gray-300">• <strong>SMART Recovery</strong> - Self-Empowerment And Recovery Training at smartrecovery.org</li>
                    <li className="text-gray-300">• <strong>Recovery Coaching</strong> - Professional support through RAMP (Recovery Advocates Movement)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-border">
                <CardHeader>
                  <CardTitle className="text-white">Mental Health Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300">
                    Find mental health support and counseling:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-300">• <strong>NAMI.org</strong> - Mental health resources and support groups</li>
                    <li className="text-gray-300">• <strong>Psychology Today</strong> - Find therapists by location and specialty</li>
                    <li className="text-gray-300">• <strong>SAMHSA Find Treatment</strong> - National treatment facility database</li>
                    <li className="text-gray-300">• <strong>Open Path Collective</strong> - Affordable therapy ($10-30/session)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-border">
                <CardHeader>
                  <CardTitle className="text-white">Housing & Emergency Assistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300">
                    If you need emergency housing or resources:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-300">• <strong>211.org</strong> - Dial 2-1-1 for local social services and housing</li>
                    <li className="text-gray-300">• <strong>HUD Homeless Services</strong> - Emergency shelter and housing assistance</li>
                    <li className="text-gray-300">• <strong>Catholic Charities/Salvation Army</strong> - Emergency assistance programs</li>
                    <li className="text-gray-300">• <strong>Local Police Non-Emergency</strong> - Welfare checks and emergency referrals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How to Help Others */}
          <section className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">If Someone You Know is in Crisis</h2>
            
            <Card className="bg-white/5 border-border">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-white font-bold mb-2">✓ Take it seriously</p>
                  <p className="text-gray-300">Don't dismiss or minimize their distress. Listen without judgment.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">✓ Stay with them</p>
                  <p className="text-gray-300">Don't leave someone alone if they're expressing thoughts of suicide or self-harm.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">✓ Call for help</p>
                  <p className="text-gray-300">Call 988, text 741741, or call 911 if there's immediate danger.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">✓ Remove weapons or harmful items</p>
                  <p className="text-gray-300">If safe to do so, remove access to means of self-harm.</p>
                </div>
                <div>
                  <p className="text-white font-bold mb-2">✓ Follow up</p>
                  <p className="text-gray-300">Check in after the crisis. Continued support matters.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Important Note */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <p className="text-amber-200 text-sm leading-relaxed">
                <strong>Important:</strong> Sober Stay is a housing connection platform, not a treatment provider or mental health service. If you're experiencing mental health, substance abuse, or suicidal crisis, please reach out to the hotlines above or call 911 immediately. Your life has value and help is available 24/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
