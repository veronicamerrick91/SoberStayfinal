import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, FileText, CreditCard } from "lucide-react";

export function InsuranceInfo() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Insurance & Financial Information</h1>
          <p className="text-xl text-muted-foreground">
            Understanding how to pay for sober living and what insurance might cover.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Insurance Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                While traditional health insurance often covers treatment (detox, rehab), it rarely covers sober living rent. However, some policies may cover IOP (Intensive Outpatient Programs) which are often paired with housing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Scholarships & Grants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Many non-profits and foundations offer scholarships for recovery housing. We recommend checking with local recovery community organizations (RCOs) for available funding.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CreditCard className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Self-Pay Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Most sober living homes are private pay. Costs vary widely by location and amenities. Always ask about what is included in the weekly or monthly fee (utilities, food, drug testing, etc.).
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Does Medicaid cover sober living?</AccordionTrigger>
                <AccordionContent>
                  Typically, Medicaid does not cover room and board for sober living homes. It may cover clinical services (therapy, medical visits) that you receive while living there.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I use FSA/HSA funds?</AccordionTrigger>
                <AccordionContent>
                  In some cases, if a doctor deems sober living medically necessary, you might be able to use Health Savings Account (HSA) or Flexible Spending Account (FSA) funds. Always check with your plan administrator.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What if I can't afford rent?</AccordionTrigger>
                <AccordionContent>
                  Look for "Oxford House" models which are often more affordable, or state-funded recovery residences. Some homes offer "scholarship beds" or work exchange programs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
