import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export function HowToChoose() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How to Choose a Sober Living Home</h1>
          <p className="text-xl text-muted-foreground">
            Finding the right environment is crucial for your recovery. Here's what to look for.
          </p>
        </div>

        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> Green Flags (What to Look For)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Written policies and house rules",
                "Required drug/alcohol testing",
                "Curfews and guest policies",
                "Peer accountability structure",
                "Clean and well-maintained facilities",
                "Transparent pricing and refund policies"
              ].map((item, i) => (
                <Card key={i} className="bg-green-50/50 border-green-100">
                  <CardContent className="p-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="text-red-500" /> Red Flags (What to Avoid)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No written agreements or rules",
                "Overcrowded sleeping arrangements",
                "Unsafe or dilapidated conditions",
                "Demanding large upfront cash payments",
                "Discouraging outside support or treatment",
                "No staff or house manager presence"
              ].map((item, i) => (
                <Card key={i} className="bg-red-50/50 border-red-100">
                  <CardContent className="p-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-blue-500" /> Questions to Ask
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                  <li>What are the house rules regarding curfew, guests, and chores?</li>
                  <li>How is conflict resolution handled between residents?</li>
                  <li>What happens if a resident relapses?</li>
                  <li>Is there a minimum length of stay requirement?</li>
                  <li>Are there required house meetings or support group attendance?</li>
                  <li>What is the policy on medication management?</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
}
