import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Disclaimer() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Disclaimer - Comprehensive Liability Release</CardTitle>
            <p className="text-muted-foreground">Last Updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">COMPLETE LIABILITY RELEASE AND WAIVER</h2>
              <p className="text-white font-bold">
                BY USING SOBER STAY, YOU VOLUNTARILY AND KNOWINGLY RELEASE SOBER STAY, INC. FROM ALL LIABILITY FOR ANY CLAIMS, DAMAGES, LOSSES, OR EXPENSES WHATSOEVER, WHETHER KNOWN OR UNKNOWN.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. PLATFORM NATURE</h2>
              <p>
                Sober Stay is EXCLUSIVELY a technology platform that facilitates connections. Sober Stay is NOT: a healthcare provider, treatment facility, housing provider, property manager, employer, background check company, verification service, or party to any user transaction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. NO VERIFICATION OR SCREENING</h2>
              <p className="text-white font-bold">
                SOBER STAY DOES NOT CONDUCT BACKGROUND CHECKS, VERIFY IDENTITIES, INSPECT PROPERTIES, OR GUARANTEE USER SAFETY OR LEGITIMACY.
              </p>
              <p>You assume ALL RISK for interactions with unknown individuals and housing arrangements.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. NO RESPONSIBILITY FOR:</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>User conduct, identity, or background</li>
                <li>Housing conditions, safety, or legal compliance</li>
                <li>Financial transactions between users</li>
                <li>Lease agreements or rental disputes</li>
                <li>Personal injury, death, or assault</li>
                <li>Fraud, scam, or financial loss</li>
                <li>Property damage or theft</li>
                <li>Housing discrimination or violations of tenant rights</li>
                <li>Platform downtime or security breaches</li>
                <li>Reliance on information or recommendations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. ASSUMPTION OF ALL RISKS</h2>
              <p>
                You acknowledge and assume ALL RISKS associated with using Sober Stay, including risks of fraud, unsafe housing, criminal activity, relapse, and all other risks associated with housing and recovery.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. ZERO LIABILITY</h2>
              <p className="text-white font-bold">
                SOBER STAY'S LIABILITY IS ZERO DOLLARS ($0) FOR ANY AND ALL CLAIMS, WITHOUT EXCEPTION, REGARDLESS OF CIRCUMSTANCES OR DAMAGES.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. CRISIS RESOURCES</h2>
              <p>
                If you are in crisis: CALL 988 (Suicide & Crisis Lifeline), TEXT 741741 (Crisis Text Line), or CALL 911 (Emergency). Sober Stay is NOT a mental health service or treatment provider.
              </p>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground bg-red-500/10 p-4 rounded">
              <p className="font-bold text-red-400 text-base">
                THIS IS A BINDING LEGAL DOCUMENT. BY USING SOBER STAY, YOU WAIVE ALL CLAIMS AND ACCEPT ALL RISKS. DO NOT USE IF YOU DO NOT ACCEPT THESE TERMS.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
