import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ApplicationForm() {
  const [match, params] = useRoute("/apply/:id");
  const [location, setLocation] = useLocation();
  const property = MOCK_PROPERTIES.find(p => p.id === params?.id);

  if (!property) return <Layout><div className="text-center py-12">Property not found</div></Layout>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to tenant dashboard - application would be saved in real app
    setLocation(`/tenant-dashboard`);
  };

  const handleBack = () => {
    setLocation(`/property/${property.id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" className="gap-2 mb-8 pl-0 text-muted-foreground hover:text-primary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Apply to {property.name}</h1>
            <p className="text-muted-foreground">Complete this application to express your interest in this home.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input placeholder="John" className="bg-background/50 border-border" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input placeholder="Doe" className="bg-background/50 border-border" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="john@example.com" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" className="bg-background/50 border-border" required />
                </div>
              </CardContent>
            </Card>

            {/* Recovery Background */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Recovery & Treatment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Substance(s)</Label>
                  <Input placeholder="e.g., Alcohol, Opioids, Both" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Last Use</Label>
                  <Input type="date" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Current Level of Care</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select level of care" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="detox">Detox</SelectItem>
                      <SelectItem value="inpatient">Inpatient</SelectItem>
                      <SelectItem value="outpatient">Outpatient</SelectItem>
                      <SelectItem value="none">None - Aftercare Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>MAT Medications (if applicable)</Label>
                  <Input placeholder="e.g., Suboxone, Methadone" className="bg-background/50 border-border" />
                </div>
              </CardContent>
            </Card>

            {/* Housing Preferences */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Housing Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="text-sm text-gray-300">
                    <span className="font-bold text-primary">Selected Home:</span> {property.name} • {property.city}, {property.state}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Desired Move-In Date</Label>
                  <Input type="date" className="bg-background/50 border-border" required />
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Why are you interested in this home?</Label>
                  <Textarea placeholder="Tell us about your recovery goals and what you're looking for..." className="bg-background/50 border-border min-h-24" />
                </div>
                <div className="space-y-2">
                  <Label>Employment Status</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="employed">Employed Full-Time</SelectItem>
                      <SelectItem value="part-time">Employed Part-Time</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="disabled">Disability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Agreements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Agreements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" className="mt-1" required />
                  <label htmlFor="consent" className="text-sm text-gray-300">
                    I consent to share my information with this provider for review.
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the Sober Stay Terms of Use and Privacy Policy.
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Submit Application
              </Button>
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
