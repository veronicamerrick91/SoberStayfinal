import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2, Upload, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { isAuthenticated, getAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ApplicationForm() {
  const [match, params] = useRoute("/apply/:id");
  const [location, setLocation] = useLocation();
  const [idUploaded, setIdUploaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const user = getAuth();
  
  const isPreview = params?.id === "preview";
  const property = isPreview 
    ? { 
        id: "preview", 
        name: "Example Sober Living Home", 
        address: "123 Recovery Way", 
        city: "Cityville", 
        state: "ST" 
      } 
    : MOCK_PROPERTIES.find(p => p.id === params?.id);

  useEffect(() => {
    // Redirect to login if not authenticated (skip for preview)
    if (!isAuthenticated() && !isPreview) {
      setLocation(`/login?returnPath=/apply/${params?.id}`);
    }
  }, [params?.id, setLocation, isPreview]);

  if (!property) return <Layout><div className="text-center py-12">Property not found</div></Layout>;

  const submitApplication = async (status: "draft" | "submitted") => {
    if (isPreview) {
      alert(`This is a preview. Application would be ${status}.`);
      return;
    }

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      // Since we don't have a real listing ID in mock data that matches DB, 
      // we'll mock the listingId for now or use 1 if it parses.
      // In real app, params.id would be the listing ID.
      const listingId = parseInt(params?.id || "0") || 1;

      await apiRequest("POST", "/api/applications", {
        listingId,
        tenantId: (user as any)?.id,
        status,
        data
      });

      if (status === "draft") {
        toast({
          title: "Draft Saved",
          description: "Your application has been saved as a draft.",
        });
      } else {
        toast({
          title: "Application Submitted",
          description: "Your application has been sent to the provider.",
        });
        setLocation(`/tenant-dashboard`);
      }
    } catch (error) {
      console.error(`Failed to save application as ${status}`, error);
      toast({
        title: "Error",
        description: `Failed to ${status === "draft" ? "save draft" : "submit application"}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication("submitted");
  };

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    submitApplication("draft");
  };

  const handleBack = () => {
    if (isPreview) {
      window.history.back();
    } else {
      setLocation(`/property/${property.id}`);
    }
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
            {isPreview && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Provider Preview Mode</h3>
                  <p className="text-sm text-muted-foreground">This is a preview of the application form your tenants will see.</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Apply to {property.name}</h1>
                <p className="text-muted-foreground">Complete this comprehensive application. All fields marked * are required.</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSaveDraft}
                className="border-border gap-2 hidden sm:flex"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">1. Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input name="firstName" placeholder="John" className="bg-background/50 border-border" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input name="lastName" placeholder="Doe" className="bg-background/50 border-border" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input name="dob" type="date" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select name="gender">
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
                  <Input name="phone" type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input name="email" type="email" placeholder="john@example.com" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Current Address *</Label>
                  <Input name="address" placeholder="Street address" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input name="emergencyName" placeholder="Name" className="bg-background/50 border-border" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Phone *</Label>
                    <Input name="emergencyPhone" type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Input name="emergencyRel" placeholder="e.g., Sister, Friend, Sponsor" className="bg-background/50 border-border" required />
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
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="id-upload" name="idDocument" />
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
                  <Input name="substances" placeholder="e.g., Alcohol, Opioids, Both, Other" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Age of First Use *</Label>
                  <Input name="ageFirstUse" type="number" min="0" max="120" placeholder="Age" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Last Date of Use *</Label>
                  <Input name="lastUseDate" type="date" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>Length of Sobriety *</Label>
                  <Input name="sobrietyLength" placeholder="e.g., 3 months, 1 year, 45 days" className="bg-background/50 border-border" required />
                </div>
                <div className="space-y-2">
                  <Label>History of Overdose?</Label>
                  <Select name="overdoseHistory">
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
                  <Input name="overdoseDate" type="date" className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Have You Ever Been on MAT? *</Label>
                  <Select name="matHistory">
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
                  <Input name="matMedications" placeholder="e.g., Suboxone, Methadone, Vivitrol, None" className="bg-background/50 border-border" />
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
                    <input type="checkbox" id="meetings" name="agreeMeetings" className="mt-1" required />
                    <label htmlFor="meetings" className="text-sm text-gray-300">
                      I will attend required meetings *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="house-rules" name="agreeRules" className="mt-1" required />
                    <label htmlFor="house-rules" className="text-sm text-gray-300">
                      I will follow house rules *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="drug-testing" name="agreeTesting" className="mt-1" required />
                    <label htmlFor="drug-testing" className="text-sm text-gray-300">
                      I will submit to random drug testing *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="curfew" name="agreeCurfew" className="mt-1" required />
                    <label htmlFor="curfew" className="text-sm text-gray-300">
                      I agree to follow curfew *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="chores" name="agreeChores" className="mt-1" required />
                    <label htmlFor="chores" className="text-sm text-gray-300">
                      I will complete weekly chores *
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Do you currently have a sponsor?</Label>
                  <Select name="hasSponsor">
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
                  <Textarea name="medicalConditions" placeholder="List any medical conditions (e.g., diabetes, hypertension)..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Mental Health Diagnoses (optional)</Label>
                  <Textarea name="mentalHealth" placeholder="e.g., Depression, Anxiety, BIPD..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Current Medications (list all)</Label>
                  <Textarea name="medications" placeholder="Include prescription and over-the-counter medications..." className="bg-background/50 border-border min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Textarea name="allergies" placeholder="Food, medication, environmental allergies..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Any Mobility Issues or Disabilities?</Label>
                  <Select name="mobilityIssues">
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
                  <Select name="seizureHistory">
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
                  <Select name="isPregnant">
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
                  <Select name="probation">
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
                  <Textarea name="probationDetails" placeholder="Type of supervision, officer contact..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Any Pending Court Cases? *</Label>
                  <Select name="pendingCases">
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
                  <Select name="restrainingOrders">
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
                  <Select name="violentOffenses">
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
                  <Select name="employmentStatus">
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
                  <Textarea name="incomeSource" placeholder="e.g., Job, Family support, Disability benefits, Unemployment, Other..." className="bg-background/50 border-border min-h-16" />
                </div>
                <div className="space-y-2">
                  <Label>Can You Pay Monthly Rent on Time? *</Label>
                  <Select name="canPayRent">
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
                  <Select name="lookingForJob">
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
                  <Select name="willingToWork">
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
                  <Textarea name="reasonLeaving" placeholder="Describe your current situation and why you're seeking this home..." className="bg-background/50 border-border min-h-24" required />
                </div>
                <div className="space-y-2">
                  <Label>Have You Ever Been Evicted? *</Label>
                  <Select name="evictionHistory">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSaveDraft}
                className="border-border flex-1 gap-2 order-2 sm:order-1"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 h-11 order-1 sm:order-2"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
