import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, UserCheck, Home } from "lucide-react";

export function RightsResponsibilities() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rights & Responsibilities</h1>
          <p className="text-xl text-muted-foreground">
            Mutual respect and clear expectations are the foundation of a safe recovery environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Resident Rights</h2>
            </div>
            <div className="space-y-4">
              {[
                "The right to a safe, drug-free environment",
                "The right to be treated with dignity and respect",
                "The right to fair and consistent application of rules",
                "The right to privacy (within safety guidelines)",
                "The right to file a grievance without retaliation",
                "The right to clear financial agreements"
              ].map((right, i) => (
                <Card key={i} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="font-medium">{right}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Home className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Resident Responsibilities</h2>
            </div>
            <div className="space-y-4">
              {[
                "Maintain sobriety and submit to drug testing",
                "Pay rent/fees on time",
                "Participate in house chores and meetings",
                "Respect the privacy and property of others",
                "Follow curfew and guest policies",
                "Support the recovery of housemates"
              ].map((resp, i) => (
                <Card key={i} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <p className="font-medium">{resp}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-muted/50 p-8 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-4">Need to report a violation?</h3>
          <p className="text-muted-foreground mb-6">
            If you believe your rights have been violated or you observe unsafe conditions, please use our safety reporting tool.
          </p>
          <a href="/safety-reporting" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Go to Safety Reporting
          </a>
        </div>
      </div>
    </Layout>
  );
}
