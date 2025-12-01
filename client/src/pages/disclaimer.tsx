import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Disclaimer() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-white mb-2">Disclaimer</CardTitle>
            <p className="text-muted-foreground">Last Updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm text-gray-300">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Platform Nature and Function</h2>
              <p>
                Sober Stay ("Platform") is a technology-enabled marketplace that facilitates introductions between individuals seeking recovery housing and property providers. Sober Stay does not provide housing, operate facilities, or deliver treatment or medical services. We are not a healthcare provider, property manager, landlord, or recovery service provider.
              </p>
              <p>
                Sober Stay is solely a connection platform. All housing arrangements, lease agreements, payment terms, and service provisions are direct transactions between individual users. Sober Stay is not a party to these arrangements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. No Health or Treatment Services</h2>
              <p>
                <strong className="text-white">SOBER STAY IS NOT A MEDICAL PROVIDER OR TREATMENT FACILITY.</strong>
              </p>
              <p>
                We do not provide, facilitate, or endorse medical, psychological, psychiatric, or addiction treatment services. Information on our Platform regarding recovery, sobriety, or treatment is for informational purposes only and should not be considered medical advice.
              </p>
              <p>
                If you require medical or mental health services, please consult qualified healthcare professionals. In case of emergency, call 911 or your local emergency services.
              </p>
              <p className="text-white font-bold">
                CRISIS RESOURCES:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7)</li>
                <li>National Suicide Prevention Lifeline: 988 (call or text)</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. No Responsibility for User Conduct or Identity</h2>
              <p>
                <strong className="text-white">SOBER STAY ASSUMES NO RESPONSIBILITY FOR THE CONDUCT, IDENTITY, OR AUTHENTICITY OF PLATFORM USERS.</strong>
              </p>
              <p>
                While we implement verification procedures, we do not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Verify the true identity of users</li>
                <li>Conduct background checks or criminal investigations</li>
                <li>Perform medical or psychological evaluations</li>
                <li>Guarantee user sobriety, reliability, or trustworthiness</li>
                <li>Monitor user conduct or communications</li>
                <li>Screen for predatory behavior, fraud, or abuse</li>
              </ul>
              <p>
                Users assume all risk for interactions with other users. Sober Stay is not responsible for physical harm, financial loss, emotional distress, or any other injury resulting from interactions with other users.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. No Responsibility for Housing Conditions or Property Safety</h2>
              <p>
                <strong className="text-white">SOBER STAY ASSUMES NO RESPONSIBILITY FOR PROPERTY CONDITIONS, SAFETY, OR COMPLIANCE WITH HOUSING CODES.</strong>
              </p>
              <p>
                We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Verify that properties meet safety standards</li>
                <li>Inspect properties for habitability</li>
                <li>Ensure compliance with local housing codes</li>
                <li>Guarantee property maintenance or repairs</li>
                <li>Monitor cleanliness, safety, or accessibility</li>
                <li>Enforce house rules or facility policies</li>
              </ul>
              <p>
                Tenants are responsible for conducting inspections, reviewing agreements, and verifying that properties meet their needs and legal requirements. Sober Stay is not liable for any property defects, unsafe conditions, pest infestations, or structural issues.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">5. No Responsibility for Financial Transactions</h2>
              <p>
                <strong className="text-white">SOBER STAY ASSUMES NO RESPONSIBILITY FOR FINANCIAL TRANSACTIONS BETWEEN USERS.</strong>
              </p>
              <p>
                All rent payments, deposits, fees, and other financial arrangements are direct transactions between Tenants and Providers. Sober Stay:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Does not collect, hold, or transfer user funds</li>
                <li>Is not responsible for financial disputes or fraud</li>
                <li>Does not guarantee payment processing or security</li>
                <li>Is not responsible for lost deposits or financial losses</li>
                <li>Does not provide escrow or payment protection services</li>
              </ul>
              <p>
                Users assume full responsibility for negotiating financial terms and protecting themselves against fraud.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">6. No Verification of Provider Legitimacy or Licensing</h2>
              <p>
                <strong className="text-white">SOBER STAY DOES NOT VERIFY THAT PROVIDERS ARE LICENSED, LEGITIMATE, OR QUALIFIED TO OPERATE RECOVERY HOUSING.</strong>
              </p>
              <p>
                We do not confirm that Providers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hold necessary business licenses or certifications</li>
                <li>Comply with local zoning or housing regulations</li>
                <li>Have appropriate insurance</li>
                <li>Are qualified to manage recovery housing</li>
                <li>Have financial stability or legitimacy</li>
              </ul>
              <p>
                Tenants must independently verify Provider credentials and compliance with applicable laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">7. No Guarantee of Platform Availability</h2>
              <p>
                <strong className="text-WHITE">SOBER STAY MAKES NO GUARANTEE REGARDING PLATFORM AVAILABILITY, UPTIME, OR FUNCTIONALITY.</strong>
              </p>
              <p>
                The Platform is provided "as-is" and may be subject to interruptions, downtime, errors, or security incidents. Sober Stay is not responsible for any losses or damages resulting from platform unavailability.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">8. Liability Release and Waiver</h2>
              <p className="text-white font-bold">
                BY USING SOBER STAY, YOU ACKNOWLEDGE AND AGREE THAT:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>YOU ASSUME ALL RISK FOR YOUR USE OF THE PLATFORM</li>
                <li>YOU ASSUME ALL RISK FOR INTERACTIONS WITH OTHER USERS</li>
                <li>YOU ASSUME ALL RISK FOR HOUSING ARRANGEMENTS</li>
                <li>YOU RELEASE SOBER STAY FROM ALL CLAIMS, DAMAGES, AND LIABILITY</li>
              </ul>
              <p>
                To the maximum extent permitted by law, you waive any right to hold Sober Stay liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal injury or death</li>
                <li>Property damage or theft</li>
                <li>Financial losses or fraud</li>
                <li>Emotional distress or trauma</li>
                <li>Housing discrimination or violation of fair housing laws</li>
                <li>Violation of tenant rights or housing codes</li>
                <li>Any conduct of other users</li>
                <li>Any errors, omissions, or inaccuracies on the Platform</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">9. No Recommendation or Endorsement</h2>
              <p>
                Sober Stay does not recommend, endorse, or verify any Provider, property, or housing arrangement. Listings are user-generated content and do not reflect Sober Stay's opinions or endorsements. Any testimonials, reviews, or ratings are from users and should not be considered verified or guaranteed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">10. Fair Housing Notice</h2>
              <p>
                Sober Stay complies with all applicable fair housing laws. However, we do not monitor or enforce fair housing compliance by users. If you believe you have experienced housing discrimination, please report it to:
              </p>
              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                <p className="text-white">HUD Fair Housing Hotline</p>
                <p>1-800-669-9777</p>
                <p>TTY: 1-800-927-9275</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">11. Information Accuracy Disclaimer</h2>
              <p>
                Information on Sober Stay is provided by users and is not verified by Sober Stay for accuracy, completeness, or legality. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Property information is accurate or current</li>
                <li>Descriptions match actual conditions</li>
                <li>Pricing is correct or binding</li>
                <li>Availability is current</li>
                <li>Photos or descriptions are authentic</li>
              </ul>
              <p>
                Users should independently verify all information before making housing decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">12. Limitation of Remedies</h2>
              <p>
                Your exclusive remedy for any dispute shall be limited to a refund of Sober Stay subscription fees paid within the preceding 30 days, not to exceed $49. This represents the maximum liability of Sober Stay under any circumstance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">13. Acknowledgment</h2>
              <p>
                By using Sober Stay, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You have read and understood this Disclaimer</li>
                <li>You have read and understood our Terms of Use and Privacy Policy</li>
                <li>You accept all risks associated with using the Platform</li>
                <li>You release Sober Stay from all liability</li>
                <li>You understand that housing arrangements carry substantial risks</li>
                <li>You will conduct independent due diligence</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">14. Questions</h2>
              <p>
                For questions about this Disclaimer:
              </p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-white">Sober Stay Legal Department</p>
                <p>Email: legal@soberstay.com</p>
              </div>
            </section>

            <div className="border-t border-border pt-8 text-xs text-muted-foreground bg-red-500/10 p-4 rounded">
              <p className="font-bold text-red-400">
                THIS DISCLAIMER IS BINDING AND ENFORCEABLE TO THE MAXIMUM EXTENT PERMITTED BY LAW. IF YOU DO NOT ACCEPT THESE TERMS, DO NOT USE SOBER STAY.
              </p>
              <p className="mt-2">© 2024 Sober Stay, Inc. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
