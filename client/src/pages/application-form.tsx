import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2, Upload, Loader2, PartyPopper } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticated, getAuth } from "@/lib/auth";
import { incrementStat } from "@/lib/tenant-engagement";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@shared/schema";

async function fetchListing(id: string): Promise<Listing> {
  const response = await fetch(`/api/listings/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }
  return response.json();
}

export default function ApplicationForm() {
  const [match, params] = useRoute("/apply/:id");
  const [location, setLocation] = useLocation();
  const [idUploaded, setIdUploaded] = useState(false);
  const [employmentRequirement, setEmploymentRequirement] = useState("");
  const [section8Confirmed, setSection8Confirmed] = useState(false);
  const [section9Confirmed, setSection9Confirmed] = useState(false);
  const [consentShareInfo, setConsentShareInfo] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Pre-filled form data from tenant profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const isPreview = params?.id === "preview";
  
  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", params?.id],
    queryFn: () => fetchListing(params?.id || ""),
    enabled: !!params?.id && !isPreview,
  });

  const property = isPreview 
    ? { 
        id: "preview", 
        propertyName: "Example Sober Living Home", 
        address: "123 Recovery Way", 
        city: "Cityville", 
        state: "ST" 
      } 
    : listing;

  useEffect(() => {
    // Redirect to login if not authenticated (skip for preview)
    if (!isAuthenticated() && !isPreview) {
      setLocation(`/login?returnPath=/apply/${params?.id}`);
      return;
    }
    // Only tenants can submit applications - providers should go to their dashboard
    const user = getAuth();
    if (user && user.role === "provider" && !isPreview) {
      setLocation("/provider-dashboard");
      return;
    }
    if (user && user.role === "admin" && !isPreview) {
      setLocation("/admin-dashboard");
      return;
    }
  }, [params?.id, setLocation, isPreview]);
  
  // Pre-fill form from tenant profile applicationData (with fallback to top-level fields and user account)
  useEffect(() => {
    const fetchTenantProfile = async () => {
      if (isPreview) return;
      setProfileLoading(true);
      try {
        // Get current user info for fallback data (email, name)
        const user = getAuth() as any;
        
        const res = await fetch('/api/tenant/profile', { credentials: 'include' });
        if (res.ok) {
          const profile = await res.json();
          const appData = profile.applicationData || {};
          // Check applicationData first, then fall back to top-level profile fields, then user account
          // Note: phoneNumber in applicationData maps to phone field
          const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : '');
          const userLastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');
          
          if (appData.firstName || profile.firstName || userFirstName) setFirstName(appData.firstName || profile.firstName || userFirstName);
          if (appData.lastName || profile.lastName || userLastName) setLastName(appData.lastName || profile.lastName || userLastName);
          if (appData.email || profile.email || user?.email) setEmail(appData.email || profile.email || user?.email || '');
          if (appData.phoneNumber || appData.phone || profile.phone) setPhone(appData.phoneNumber || appData.phone || profile.phone || '');
          if (appData.currentAddress || profile.currentAddress) setCurrentAddress(appData.currentAddress || profile.currentAddress || '');
          if (appData.emergencyContactName || profile.emergencyContactName) setEmergencyContactName(appData.emergencyContactName || profile.emergencyContactName || '');
          if (appData.emergencyContactPhone || profile.emergencyContactPhone) setEmergencyContactPhone(appData.emergencyContactPhone || profile.emergencyContactPhone || '');
          if (appData.emergencyContactRelationship || profile.emergencyContactRelationship) setEmergencyContactRelationship(appData.emergencyContactRelationship || profile.emergencyContactRelationship || '');
        } else if (user) {
          // If no profile exists, still use user account data
          const userFirstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
          const userLastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');
          if (userFirstName) setFirstName(userFirstName);
          if (userLastName) setLastName(userLastName);
          if (user.email) setEmail(user.email);
        }
      } catch (err) {
        console.error("Error fetching tenant profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchTenantProfile();
  }, [isPreview]);

  if (isLoading && !isPreview) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading application form...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) return <Layout><div className="text-center py-12">Property not found</div></Layout>;

  const propertyName = "propertyName" in property ? property.propertyName : "Property";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (isPreview) {
      alert("This is a preview. In the real form, this would submit the application.");
      return;
    }
    
    // Validate required checkboxes and employment requirement
    if (!idUploaded) {
      setFormError("Please upload a valid government-issued ID to submit this application.");
      return;
    }
    if (employmentRequirement !== "yes") {
      setFormError("You must agree to follow the home's employment requirements to submit this application.");
      return;
    }
    if (!section8Confirmed) {
      setFormError("Please confirm that you have read and completed Section 8 (Housing Background).");
      return;
    }
    if (!section9Confirmed) {
      setFormError("Please confirm that you have read and completed Section 9 (Personal Needs & Preferences).");
      return;
    }
    if (!consentShareInfo) {
      setFormError("Please consent to sharing your information with the provider.");
      return;
    }
    if (!consentTerms) {
      setFormError("Please agree to the Sober Stay Terms of Use and Privacy Policy.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: property.id,
          applicationData: {
            firstName,
            lastName,
            email,
            phone,
            currentAddress,
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactRelationship
          }
        })
      });
      
      if (res.ok) {
        incrementStat("applicationsSubmitted");
        setShowConfirmation(true);
      } else {
        const error = await res.json();
        setFormError(error.error || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setFormError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">Apply to {propertyName}</h1>
            <p className="text-muted-foreground">Complete this comprehensive application. All fields marked * are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  1. Personal Information
                  {profileLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input 
                      placeholder="John" 
                      className="bg-background/50 border-border" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input 
                      placeholder="Doe" 
                      className="bg-background/50 border-border" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" className="bg-background/50 border-border" required data-testid="input-dob" />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 border-border" data-testid="select-gender">
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
                  <Input 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    className="bg-background/50 border-border" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-background/50 border-border" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Address *</Label>
                  <Input 
                    placeholder="Street address" 
                    className="bg-background/50 border-border" 
                    required 
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    data-testid="input-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input 
                    placeholder="Name" 
                    className="bg-background/50 border-border" 
                    required 
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    data-testid="input-emergency-name"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Phone *</Label>
                    <Input 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      className="bg-background/50 border-border" 
                      required 
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      data-testid="input-emergency-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Input 
                      placeholder="e.g., Sister, Friend, Sponsor" 
                      className="bg-background/50 border-border" 
                      required 
                      value={emergencyContactRelationship}
                      onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                      data-testid="input-emergency-relationship"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Identification Upload */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">2. Identification Upload *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`bg-primary/5 border rounded-lg p-6 ${idUploaded ? 'border-primary/20' : 'border-destructive/30'}`}>
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-primary/60" />
                    <p className="text-sm text-gray-300 mb-4">Upload a government-issued photo ID <span className="text-destructive">*</span></p>
                    <p className="text-xs text-muted-foreground mb-4">Accepted: Driver's License, State ID, Passport</p>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="id-upload" data-testid="input-id-upload" />
                    <label htmlFor="id-upload">
                      <Button type="button" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => document.getElementById('id-upload')?.click()} data-testid="button-upload-id">
                        <Upload className="w-4 h-4 mr-2" /> Choose File
                      </Button>
                    </label>
                    {idUploaded ? (
                      <p className="text-xs text-primary mt-2">✓ File selected</p>
                    ) : (
                      <p className="text-xs text-destructive/70 mt-2">Required for application submission</p>
                    )}
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
                  <Label>Willing to Follow Home's Employment Requirements? *</Label>
                  <Select value={employmentRequirement} onValueChange={setEmploymentRequirement}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer (Yes required)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-amber-400">* You must select "Yes" to submit this application</p>
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
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <input 
                      type="checkbox" 
                      id="section8-confirm" 
                      checked={section8Confirmed}
                      onChange={(e) => setSection8Confirmed(e.target.checked)}
                      className="mt-1" 
                      required 
                    />
                    <label htmlFor="section8-confirm" className="text-sm text-gray-300">
                      I confirm that I have read and accurately completed all questions in this Housing Background section. *
                    </label>
                  </div>
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
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <input 
                      type="checkbox" 
                      id="section9-confirm" 
                      checked={section9Confirmed}
                      onChange={(e) => setSection9Confirmed(e.target.checked)}
                      className="mt-1" 
                      required 
                    />
                    <label htmlFor="section9-confirm" className="text-sm text-gray-300">
                      I confirm that I have read and accurately completed all questions in this Personal Needs & Preferences section. *
                    </label>
                  </div>
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
                    <input 
                      type="checkbox" 
                      id="consent7" 
                      checked={consentShareInfo}
                      onChange={(e) => setConsentShareInfo(e.target.checked)}
                      className="mt-1" 
                      required 
                    />
                    <label htmlFor="consent7" className="text-sm text-gray-300">
                      I consent to share my information with this provider for review *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="consent8" 
                      checked={consentTerms}
                      onChange={(e) => setConsentTerms(e.target.checked)}
                      className="mt-1" 
                      required 
                    />
                    <label htmlFor="consent8" className="text-sm text-gray-300">
                      I agree to the Sober Stay Terms of Use and Privacy Policy *
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            {formError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
                {formError}
              </div>
            )}
            <div className="flex gap-4 sticky bottom-4 bg-background p-4 rounded-lg border border-border">
              <Button 
                type="submit" 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
                disabled={isSubmitting}
                data-testid="button-submit-application"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Submit Application
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12" data-testid="button-cancel-application">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Application Submitted Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Your application to <span className="text-white font-medium">{propertyName}</span> has been submitted successfully.
              </p>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-white text-sm mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  The provider will review your application
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  You'll receive an email when they respond
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Track your application status in your dashboard
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/80"
              onClick={() => setLocation('/tenant-dashboard')}
              data-testid="button-go-to-dashboard"
            >
              Go to My Dashboard
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
