import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function ApplicationForm() {
  const [match, params] = useRoute("/apply/:id");
  const [location, setLocation] = useLocation();
  const [idUploaded, setIdUploaded] = useState(false);
  const property = MOCK_PROPERTIES.find(p => p.id === params?.id);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      setLocation(`/login?returnPath=/apply/${params?.id}`);
    }
  }, [params?.id, setLocation]);

  if (!property) return <Layout><div className="text-center py-12">Property not found</div></Layout>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/tenant-dashboard`);
  };

  const handleBack = () => {
    setLocation(`/property/${property.id}`);
  };

  const handleFileUpload = () => {
    setIdUploaded(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" className="gap-2 mb-8 pl-0 text-muted-foreground hover:text-primary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Apply to {property.name}</h1>
            <p className="text-muted-foreground">Complete this comprehensive application. All fields marked * are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">1. Personal Information</CardTitle>
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
                  <Label>Date of Birth *</Label>
                  <Input type="date" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" placeholder="john@example.com" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Current Address *</Label>
                  <Input placeholder="Street address" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input placeholder="Name" className="bg-background/50 border-border" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Phone *</Label>
                    <Input type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Input placeholder="e.g., Sister, Friend, Sponsor" className="bg-background/50 border-border" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Identification Upload */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">2. Identification Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-primary/60" />
                    <p className="text-sm text-gray-300 mb-4">Upload a government-issued photo ID</p>
                    <p className="text-xs text-muted-foreground mb-4">Accepted: Driver's License, State ID, Passport</p>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="id-upload" />
                    <label htmlFor="id-upload">
                      <Button type="button" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => document.getElementById('id-upload')?.click()}>
                        <Upload className="w-4 h-4 mr-2" /> Choose File
                      </Button>
                    </label>
                    {idUploaded && <p className="text-xs text-primary mt-2">✓ File selected</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Substance Use Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">3. Substance Use Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Substance(s) Used *</Label>
                  <Input placeholder="e.g., Alcohol, Opioids, Both, Other" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Age of First Use *</Label>
                  <Input type="number" min="0" max="120" placeholder="Age" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Last Date of Use *</Label>
                  <Input type="date" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Length of Sobriety *</Label>
                  <Input placeholder="e.g., 3 months, 1 year, 45 days" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>History of Overdose?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>If Yes, Date (if comfortable sharing)</Label>
                  <Input type="date" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Have You Ever Been on MAT? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current MAT Medications (if applicable)</Label>
                  <Input placeholder="e.g., Suboxone, Methadone, Vivitrol, None" className="bg-background/50 border-border" />
                </div>
              </CardContent>
            </Card>

            {/* 4. Recovery Program Requirements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">4. Recovery Program Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="meetings" className="mt-1" required />
                    <label htmlFor="meetings" className="text-sm text-gray-300">
                      I will attend required meetings *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="house-rules" className="mt-1" required />
                    <label htmlFor="house-rules" className="text-sm text-gray-300">
                      I will follow house rules *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="drug-testing" className="mt-1" required />
                    <label htmlFor="drug-testing" className="text-sm text-gray-300">
                      I will submit to random drug testing *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="curfew" className="mt-1" required />
                    <label htmlFor="curfew" className="text-sm text-gray-300">
                      I agree to follow curfew *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="chores" className="mt-1" required />
                    <label htmlFor="chores" className="text-sm text-gray-300">
                      I will complete weekly chores *
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Do you currently have a sponsor?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 5. Medical & Mental Health */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">5. Medical & Mental Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Medical Conditions</Label>
                  <Textarea placeholder="List any medical conditions (e.g., diabetes, hypertension)..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Mental Health Diagnoses (optional)</Label>
                  <Textarea placeholder="e.g., Depression, Anxiety, BIPD..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Current Medications (list all)</Label>
                  <Textarea placeholder="Include prescription and over-the-counter medications..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Textarea placeholder="Food, medication, environmental allergies..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Any Mobility Issues or Disabilities?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>History of Seizures or Medical Emergencies?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Are You Pregnant?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="not-applicable">Not applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 6. Legal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">6. Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Are You on Probation or Parole? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>If Yes, Details</Label>
                  <Textarea placeholder="Type of supervision, officer contact..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Any Pending Court Cases? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Any Restraining Orders? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Any Violent or Sexual Offenses? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 7. Employment & Income */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">7. Employment & Income</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Employment Status *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="employed-full">Employed Full-Time</SelectItem>
                      <SelectItem value="employed-part">Employed Part-Time</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="disabled">Disability</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Income Source(s) *</Label>
                  <Textarea placeholder="e.g., Job, Family support, Disability benefits, Unemployment, Other..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Can You Pay Monthly Rent on Time? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="uncertain">Uncertain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Are You Looking for Employment?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Willing to Follow Home's Employment Requirements?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 8. Housing Background */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">8. Housing Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason for Leaving Current Living Situation *</Label>
                  <Textarea placeholder="Describe your current situation and why you're seeking this home..." className="bg-background/50 border-border min-h-24" required />
                </div>
                <div className="space-y-2">
                  <Label>Have You Lived in Sober Living Before? *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Previous Evictions from Sober Living?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Any Housing Violations?</Label>
                  <Textarea placeholder="Describe any previous housing-related issues..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Do You Need ADA Accommodations?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 9. Personal Needs & Preferences */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">9. Personal Needs & Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Room Preference</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender-Specific Housing Needed?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>LGBTQ+ Affirming Housing Required?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">Not required</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pet-Friendly Housing Needed?</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Smoking/Vaping Status</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="non-smoker">Non-smoker/Vaper</SelectItem>
                      <SelectItem value="smoker">Smoker</SelectItem>
                      <SelectItem value="vaper">Vaper</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transportation Needs</Label>
                  <Textarea placeholder="e.g., Reliable rides needed, Bus route access required, Own transportation..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Emotional Support Animal (if applicable)</Label>
                  <Input placeholder="Type and breed if applicable" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Desired Move-In Date *</Label>
                  <Input type="date" className="bg-background/50 border-border" required />
                </div>
              </CardContent>
            </Card>

            {/* 10. Behavioral Agreement */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">10. Behavioral Agreement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300 mb-4">I agree to abide by the following terms:</p>
                <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior1" className="mt-1" required />
                    <label htmlFor="behavior1" className="text-sm text-gray-300">
                      No drugs, alcohol, or mind-altering substances
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior2" className="mt-1" required />
                    <label htmlFor="behavior2" className="text-sm text-gray-300">
                      Random UAs and breathalyzers
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior3" className="mt-1" required />
                    <label htmlFor="behavior3" className="text-sm text-gray-300">
                      No violence, threats, or harassment
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior4" className="mt-1" required />
                    <label htmlFor="behavior4" className="text-sm text-gray-300">
                      No theft
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior5" className="mt-1" required />
                    <label htmlFor="behavior5" className="text-sm text-gray-300">
                      No overnight guests without approval
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior6" className="mt-1" required />
                    <label htmlFor="behavior6" className="text-sm text-gray-300">
                      Follow house curfew
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior7" className="mt-1" required />
                    <label htmlFor="behavior7" className="text-sm text-gray-300">
                      Attend required meetings and programs
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior8" className="mt-1" required />
                    <label htmlFor="behavior8" className="text-sm text-gray-300">
                      Respect staff, housemates, and property
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="behavior9" className="mt-1" required />
                    <label htmlFor="behavior9" className="text-sm text-gray-300">
                      Serious rule violations may result in immediate discharge
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 11. Consent & Acknowledgments */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">11. Consent & Acknowledgments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent7" className="mt-1" required />
                    <label htmlFor="consent7" className="text-sm text-gray-300">
                      I consent to share my information with this provider for review *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent8" className="mt-1" required />
                    <label htmlFor="consent8" className="text-sm text-gray-300">
                      I agree to the Sober Stay Terms of Use and Privacy Policy *
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 sticky bottom-4 bg-background p-4 rounded-lg border border-border">
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
