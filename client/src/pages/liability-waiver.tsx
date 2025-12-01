import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LiabilityWaiver() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Comprehensive Liability Release and Waiver</CardTitle>
            <p className="text-muted-foreground">Last Updated: October 2025</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">ACKNOWLEDGMENT AND RELEASE OF LIABILITY</h2>
              <p className="text-white font-bold">
                SOBER STAY, INC. - COMPREHENSIVE LIABILITY WAIVER AND RELEASE
              </p>
              <p>
                By using Sober Stay ("Platform," "Service," "we," "us," "our"), you acknowledge that you have read, understood, and voluntarily agree to be bound by this Comprehensive Liability Release and Waiver ("Waiver"), which serves as a complete and unconditional release of all claims against Sober Stay, Inc., its officers, directors, employees, agents, and successors.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. NATURE OF PLATFORM AND SERVICES</h2>
              <p>
                Sober Stay is exclusively a technology platform that facilitates introductions between individuals seeking recovery housing ("Tenants") and providers of sober living accommodations ("Providers"). Sober Stay is NOT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A healthcare provider, medical facility, or treatment facility</li>
                <li>A housing provider, property manager, landlord, or operator</li>
                <li>A recovery services provider or rehabilitation facility</li>
                <li>An employment agency or employment provider</li>
                <li>A background check company or verification service</li>
                <li>An insurance provider or escrow service</li>
                <li>A party to any lease, rental agreement, or housing arrangement</li>
                <li>Responsible for user conduct, identity, or authentication</li>
                <li>Responsible for property conditions, safety, or legal compliance</li>
                <li>Responsible for financial transactions between users</li>
              </ul>
              <p>
                Sober Stay is solely a platform that enables user-to-user communication and connection. All housing arrangements, financial transactions, and terms are independent agreements between individual users, conducted entirely outside Sober Stay's participation, control, or oversight.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. COMPLETE RELEASE AND WAIVER OF ALL CLAIMS</h2>
              <p className="text-white font-bold">
                YOU HEREBY VOLUNTARILY AND KNOWINGLY RELEASE, WAIVE, DISCHARGE, AND HOLD HARMLESS SOBER STAY, INC., AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, REPRESENTATIVES, AND SUCCESSORS FROM ANY AND ALL CLAIMS, DEMANDS, CAUSES OF ACTION, DAMAGES, LIABILITIES, COSTS, AND EXPENSES OF ANY KIND, NOW KNOWN OR HEREAFTER DISCOVERED, ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM OR THIS AGREEMENT.
              </p>
              <p>
                This waiver applies to all claims, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal injury, death, or property damage</li>
                <li>Emotional distress, psychological harm, or trauma</li>
                <li>Housing discrimination or violation of fair housing laws</li>
                <li>Breach of lease or rental agreements</li>
                <li>Violation of tenant rights or housing codes</li>
                <li>Unsafe or uninhabitable property conditions</li>
                <li>Fraud, scam, or financial loss</li>
                <li>Identity theft or unauthorized account access</li>
                <li>Harassment, abuse, assault, or violent crime by other users</li>
                <li>Theft, robbery, or property crime by other users</li>
                <li>Sexual harassment or assault</li>
                <li>Discrimination based on protected characteristics</li>
                <li>Violation of privacy or unauthorized data collection</li>
                <li>Data breach or security incident</li>
                <li>Platform unavailability, downtime, or technical errors</li>
                <li>Inaccurate, false, or misleading information on the platform</li>
                <li>Reliance on platform information or recommendations</li>
                <li>Medical emergencies or health complications</li>
                <li>Relapse or failure of recovery efforts</li>
                <li>Any conduct or negligence of other users</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. ASSUMPTION OF ALL RISKS</h2>
              <p>
                You acknowledge and assume all risks associated with using Sober Stay, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Risk of interaction with unknown individuals of unverified background or intent</li>
                <li>Risk of financial loss, fraud, or scam</li>
                <li>Risk of unsafe, unhealthy, or illegal housing conditions</li>
                <li>Risk of criminal activity by other users or third parties</li>
                <li>Risk of platform security breaches or data compromise</li>
                <li>Risk of relapse or recovery setback</li>
                <li>Risk of housing instability or eviction</li>
                <li>Risk of violation of your rights or safety</li>
              </ul>
              <p>
                You voluntarily and knowingly assume these risks with full awareness and understanding. Sober Stay is not responsible for any consequences resulting from these risks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. NO VERIFICATION, SCREENING, OR DUE DILIGENCE</h2>
              <p>
                Sober Stay does NOT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Conduct background checks or criminal investigations</li>
                <li>Verify user identity, authenticity, or legitimacy</li>
                <li>Screen users for criminal history, fraud, or misconduct</li>
                <li>Verify Provider credentials, licenses, or certifications</li>
                <li>Inspect properties for safety, habitability, or legal compliance</li>
                <li>Verify property information accuracy or completeness</li>
                <li>Monitor user conduct or communications</li>
                <li>Guarantee user reliability, honesty, or trustworthiness</li>
                <li>Perform medical or psychological evaluations</li>
                <li>Guarantee user sobriety or recovery commitment</li>
              </ul>
              <p>
                YOU ASSUME FULL RESPONSIBILITY for conducting your own background checks, property inspections, reference verification, and due diligence before any housing arrangement.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. NO LIABILITY CAPS, EXCEPTIONS, OR LIMITATIONS</h2>
              <p className="text-white font-bold">
                Sober Stay's liability is limited to ZERO dollars ($0) for any and all claims. In no event shall Sober Stay be liable for any amount whatsoever, regardless of the nature of the claim, the type of damages, or the circumstances.
              </p>
              <p>
                This limitation applies to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Direct damages and indirect damages</li>
                <li>Consequential damages and incidental damages</li>
                <li>Special damages and punitive damages</li>
                <li>Lost profits, lost data, or lost opportunities</li>
                <li>Claims based on warranty, contract, tort, or strict liability</li>
                <li>Claims arising from negligence or gross negligence</li>
                <li>Claims arising from fraud or intentional misconduct</li>
                <li>Claims that Sober Stay should have foreseen</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. INDEMNIFICATION AND DEFENSE</h2>
              <p>
                You agree to defend, indemnify, hold harmless, and reimburse Sober Stay (including all legal fees, costs, and expenses) from any claims, damages, or liabilities arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the platform</li>
                <li>Your violation of these terms</li>
                <li>Your violation of any law or third-party right</li>
                <li>Your interactions with other users</li>
                <li>Your housing arrangement with any provider</li>
                <li>Any allegation that you caused harm to another user</li>
                <li>Any allegation you violated another's rights</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. VOLUNTARY AND INFORMED CONSENT</h2>
              <p>
                You confirm that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You have read this entire waiver carefully</li>
                <li>You understand all terms and implications</li>
                <li>You have had opportunity to seek legal counsel</li>
                <li>You are signing voluntarily, knowingly, and intentionally</li>
                <li>You understand you are waiving significant legal rights</li>
                <li>You accept all risks with full awareness</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. ENFORCEMENT</h2>
              <p>
                This waiver is binding and enforceable to the maximum extent permitted by law. If any provision is unenforceable, remaining provisions remain in full force. This waiver supersedes all prior agreements and constitutes the entire liability agreement between you and Sober Stay.
              </p>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground bg-red-500/10 p-4 rounded">
              <p className="font-bold text-red-400 text-base">
                BY USING SOBER STAY, YOU ACKNOWLEDGE THAT YOU HAVE READ THIS ENTIRE COMPREHENSIVE LIABILITY RELEASE AND WAIVER, YOU UNDERSTAND ALL TERMS, AND YOU VOLUNTARILY AND KNOWINGLY RELEASE SOBER STAY FROM ALL LIABILITY FOR ANY AND ALL CLAIMS. IF YOU DO NOT ACCEPT THESE TERMS, DO NOT USE SOBER STAY.
              </p>
              <p className="mt-4">© 2024 Sober Stay, Inc. All rights reserved. This is a binding legal document.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
