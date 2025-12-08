import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Check, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { TenantProfile } from "@shared/schema";

export function TenantProfile() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [hasCompletedApplication, setHasCompletedApplication] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<any>({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    currentAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    // Substance Use
    primarySubstance: "",
    ageOfFirstUse: "",
    lastDateOfUse: "",
    lengthOfSobriety: "",
    overdoseHistory: "",
    overdoseDate: "",
    matHistory: "",
    currentMat: "",
    // Medical & Mental Health
    medicalConditions: "",
    mentalHealthDiagnoses: "",
    currentMedications: "",
    allergies: "",
    mobilityIssues: "",
    seizureHistory: "",
    isPregnant: "",
    // Legal
    probationParole: "",
    probationParoleDetails: "",
    pendingCases: "",
    restrainingOrders: "",
    violentOffenses: "",
    // Employment
    employmentStatus: "",
    incomeSources: "",
    canPayRent: "",
    lookingForEmployment: "",
    employmentRequirements: "",
    // Housing Background
    reasonForLeaving: "",
    previousSoberLiving: "",
    previousEvictions: "",
    housingViolations: "",
    adaAccommodations: "",
    // Personal Preferences
    roomPreference: "",
    genderSpecificHousing: "",
    lgbtqAffirming: "",
    petFriendly: "",
    smokingStatus: "",
    transportationNeeds: "",
    emotionalSupportAnimal: "",
    moveInDate: "",
    // Agreements
    agreeNoDrugs: false,
    agreeUAandBreathalyzer: false,
    agreeNoViolence: false,
    agreeNoTheft: false,
    agreeNoGuests: false,
    agreeCurfew: false,
    agreeMeetings: false,
    agreeRespect: false,
    agreeDischarge: false,
    agreeShareInfo: false,
    agreeTerms: false,
  });

  const user = getAuth();

  useEffect(() => {
    if (!user || user.role !== "tenant") {
      setLocation("/for-tenants");
      return;
    }
    loadProfile();
  }, [user, setLocation]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/tenant/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setBio(data.bio || "");
        setProfilePhoto(data.profilePhotoUrl);
        setIdPhoto(data.idPhotoUrl);
        if (data.applicationData) {
          setFormData(data.applicationData);
          setHasCompletedApplication(true);
        }
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const handleFileUpload = async (file: File, type: "profile" | "id") => {
    if (!user?.id) return;

    console.log("🔵 Starting upload for:", type, file.name);
    setIsLoading(true);
    
    try {
      // Convert file to base64 using FileReader
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          console.log("📸 File converted to base64, length:", result.length);
          resolve(result);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Show preview immediately while uploading
      if (type === "profile") {
        setProfilePhoto(fileData);
      } else if (type === "id") {
        setIdPhoto(fileData);
      }

      // Send to server
      console.log("📤 Sending upload request to /api/tenant/upload");
      const response = await fetch("/api/tenant/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, fileUrl: fileData }),
      });

      console.log("✅ Upload response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
        console.error("❌ Upload error response:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      console.log("💾 Upload successful, saved URL:", result.url);

      toast({
        title: "Success",
        description: `${type === "profile" ? "Profile photo" : "ID photo"} uploaded successfully`,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [field]: checked }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/tenant/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, applicationData: formData }),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      setHasCompletedApplication(true);
      toast({
        title: "Success",
        description: "Profile and application saved successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadBox = ({ label, type, currentFile }: { label: string; type: "profile" | "id"; currentFile: string | null }) => {
    const inputRef = type === "profile" ? profileInputRef : idInputRef;
    
    return (
      <div className="space-y-3">
        <Label className="text-white">{label}</Label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            console.log("📂 Input onChange triggered for:", type);
            const file = e.target.files?.[0];
            console.log("📁 Selected file:", file?.name);
            if (file) handleFileUpload(file, type);
          }}
          className="hidden"
        />
        {currentFile ? (
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-300">File uploaded</span>
            </div>
            <button 
              onClick={() => {
                console.log("Replace button clicked");
                inputRef.current?.click();
              }}
              className="text-xs text-primary hover:underline"
            >
              Replace
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
              console.log("Bubble clicked for:", type);
              inputRef.current?.click();
            }}
            className="w-full flex justify-center cursor-pointer"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-dashed border-primary/50 hover:border-primary hover:from-primary/30 hover:to-primary/20 transition-all flex items-center justify-center"
            >
              <Upload className="w-8 h-8 text-primary" />
            </div>
          </button>
        )}
        {!currentFile && (
          <div className="text-center">
            <p className="text-sm text-white font-medium">Upload {type === "profile" ? "Photo" : "ID"}</p>
            <p className="text-xs text-muted-foreground">Click the bubble</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Complete your profile and application once, then reuse it for all listings.</p>
          </div>

          {/* Bio Section */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white">About You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Bio (Optional)</Label>
                <Textarea
                  placeholder="Tell providers about yourself, your recovery goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos Section */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadBox label="Profile Photo" type="profile" currentFile={profilePhoto} />
              <FileUploadBox label="Government ID Photo" type="id" currentFile={idPhoto} />
            </CardContent>
          </Card>

          {/* Full Application Form */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Application Form</span>
                {hasCompletedApplication && (
                  <span className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Completed
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">This is the same application you'll submit when applying to listings. Complete it once here.</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 1. Personal Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">1. Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input placeholder="John" className="bg-background/50 border-border" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input placeholder="Doe" className="bg-background/50 border-border" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" className="bg-background/50 border-border" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                  <Input type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" placeholder="john@example.com" className="bg-background/50 border-border" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Current Address *</Label>
                  <Input placeholder="Street address" className="bg-background/50 border-border" value={formData.currentAddress} onChange={(e) => handleInputChange("currentAddress", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input placeholder="Name" className="bg-background/50 border-border" value={formData.emergencyContactName} onChange={(e) => handleInputChange("emergencyContactName", e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Phone *</Label>
                    <Input type="tel" placeholder="(555) 123-4567" className="bg-background/50 border-border" value={formData.emergencyContactPhone} onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Input placeholder="e.g., Sister, Friend, Sponsor" className="bg-background/50 border-border" value={formData.emergencyContactRelationship} onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* 3. Substance Use Information */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">2. Substance Use Information</h3>
                <div className="space-y-2">
                  <Label>Primary Substance(s) Used *</Label>
                  <Input placeholder="e.g., Alcohol, Opioids, Both, Other" className="bg-background/50 border-border" value={formData.primarySubstance} onChange={(e) => handleInputChange("primarySubstance", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Age of First Use *</Label>
                  <Input type="number" min="0" max="120" placeholder="Age" className="bg-background/50 border-border" value={formData.ageOfFirstUse} onChange={(e) => handleInputChange("ageOfFirstUse", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Date of Use *</Label>
                  <Input type="date" className="bg-background/50 border-border" value={formData.lastDateOfUse} onChange={(e) => handleInputChange("lastDateOfUse", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Length of Sobriety *</Label>
                  <Input placeholder="e.g., 3 months, 1 year, 45 days" className="bg-background/50 border-border" value={formData.lengthOfSobriety} onChange={(e) => handleInputChange("lengthOfSobriety", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>History of Overdose?</Label>
                  <Select value={formData.overdoseHistory} onValueChange={(value) => handleInputChange("overdoseHistory", value)}>
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
                  <Input type="date" className="bg-background/50 border-border" value={formData.overdoseDate} onChange={(e) => handleInputChange("overdoseDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Have You Ever Been on MAT? *</Label>
                  <Select value={formData.matHistory} onValueChange={(value) => handleInputChange("matHistory", value)}>
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
                  <Input placeholder="e.g., Suboxone, Methadone, Vivitrol, None" className="bg-background/50 border-border" value={formData.currentMat} onChange={(e) => handleInputChange("currentMat", e.target.value)} />
                </div>
              </div>

              {/* 5. Medical & Mental Health */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">3. Medical & Mental Health</h3>
                <div className="space-y-2">
                  <Label>Current Medical Conditions</Label>
                  <Textarea placeholder="List any medical conditions..." className="bg-background/50 border-border min-h-20" value={formData.medicalConditions} onChange={(e) => handleInputChange("medicalConditions", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mental Health Diagnoses (optional)</Label>
                  <Textarea placeholder="e.g., Depression, Anxiety, BIPD..." className="bg-background/50 border-border min-h-20" value={formData.mentalHealthDiagnoses} onChange={(e) => handleInputChange("mentalHealthDiagnoses", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Current Medications (list all)</Label>
                  <Textarea placeholder="Include prescription and over-the-counter medications..." className="bg-background/50 border-border min-h-20" value={formData.currentMedications} onChange={(e) => handleInputChange("currentMedications", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Textarea placeholder="Food, medication, environmental allergies..." className="bg-background/50 border-border min-h-16" value={formData.allergies} onChange={(e) => handleInputChange("allergies", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Any Mobility Issues or Disabilities?</Label>
                  <Select value={formData.mobilityIssues} onValueChange={(value) => handleInputChange("mobilityIssues", value)}>
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
                  <Select value={formData.seizureHistory} onValueChange={(value) => handleInputChange("seizureHistory", value)}>
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
                  <Select value={formData.isPregnant} onValueChange={(value) => handleInputChange("isPregnant", value)}>
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
              </div>

              {/* 6. Legal Information */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">4. Legal Information</h3>
                <div className="space-y-2">
                  <Label>Are You on Probation or Parole? *</Label>
                  <Select value={formData.probationParole} onValueChange={(value) => handleInputChange("probationParole", value)}>
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
                  <Textarea placeholder="Type of supervision, officer contact..." className="bg-background/50 border-border min-h-16" value={formData.probationParoleDetails} onChange={(e) => handleInputChange("probationParoleDetails", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Any Pending Court Cases? *</Label>
                  <Select value={formData.pendingCases} onValueChange={(value) => handleInputChange("pendingCases", value)}>
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
                  <Select value={formData.restrainingOrders} onValueChange={(value) => handleInputChange("restrainingOrders", value)}>
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
                  <Select value={formData.violentOffenses} onValueChange={(value) => handleInputChange("violentOffenses", value)}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 7. Employment & Income */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">5. Employment & Income</h3>
                <div className="space-y-2">
                  <Label>Employment Status *</Label>
                  <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
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
                  <Textarea placeholder="e.g., Job, Family support, Disability benefits, Unemployment, Other..." className="bg-background/50 border-border min-h-16" value={formData.incomeSources} onChange={(e) => handleInputChange("incomeSources", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Can You Pay Monthly Rent on Time? *</Label>
                  <Select value={formData.canPayRent} onValueChange={(value) => handleInputChange("canPayRent", value)}>
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
                  <Select value={formData.lookingForEmployment} onValueChange={(value) => handleInputChange("lookingForEmployment", value)}>
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
                  <Select value={formData.employmentRequirements} onValueChange={(value) => handleInputChange("employmentRequirements", value)}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 8. Housing Background */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">6. Housing Background</h3>
                <div className="space-y-2">
                  <Label>Reason for Leaving Current Living Situation *</Label>
                  <Textarea placeholder="Describe your current situation and why you're seeking this home..." className="bg-background/50 border-border min-h-24" value={formData.reasonForLeaving} onChange={(e) => handleInputChange("reasonForLeaving", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Have You Lived in Sober Living Before? *</Label>
                  <Select value={formData.previousSoberLiving} onValueChange={(value) => handleInputChange("previousSoberLiving", value)}>
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
                  <Select value={formData.previousEvictions} onValueChange={(value) => handleInputChange("previousEvictions", value)}>
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
                  <Textarea placeholder="Describe any previous housing-related issues..." className="bg-background/50 border-border min-h-16" value={formData.housingViolations} onChange={(e) => handleInputChange("housingViolations", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Do You Need ADA Accommodations?</Label>
                  <Select value={formData.adaAccommodations} onValueChange={(value) => handleInputChange("adaAccommodations", value)}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 9. Personal Needs & Preferences */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">7. Personal Needs & Preferences</h3>
                <div className="space-y-2">
                  <Label>Room Preference</Label>
                  <Select value={formData.roomPreference} onValueChange={(value) => handleInputChange("roomPreference", value)}>
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
                  <Select value={formData.genderSpecificHousing} onValueChange={(value) => handleInputChange("genderSpecificHousing", value)}>
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
                  <Select value={formData.lgbtqAffirming} onValueChange={(value) => handleInputChange("lgbtqAffirming", value)}>
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
                  <Select value={formData.petFriendly} onValueChange={(value) => handleInputChange("petFriendly", value)}>
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
                  <Select value={formData.smokingStatus} onValueChange={(value) => handleInputChange("smokingStatus", value)}>
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
                  <Textarea placeholder="e.g., Reliable rides needed, Bus route access required, Own transportation..." className="bg-background/50 border-border min-h-16" value={formData.transportationNeeds} onChange={(e) => handleInputChange("transportationNeeds", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Emotional Support Animal (if applicable)</Label>
                  <Input placeholder="Type and breed if applicable" className="bg-background/50 border-border" value={formData.emotionalSupportAnimal} onChange={(e) => handleInputChange("emotionalSupportAnimal", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Desired Move-In Date *</Label>
                  <Input type="date" className="bg-background/50 border-border" value={formData.moveInDate} onChange={(e) => handleInputChange("moveInDate", e.target.value)} required />
                </div>
              </div>

              {/* 10. Behavioral Agreement */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">8. Behavioral Agreement</h3>
                <p className="text-sm text-gray-300 mb-4">I agree to abide by the following terms:</p>
                <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  {[
                    { id: "agreeNoDrugs", label: "No drugs, alcohol, or mind-altering substances" },
                    { id: "agreeUAandBreathalyzer", label: "Random UAs and breathalyzers" },
                    { id: "agreeNoViolence", label: "No violence, threats, or harassment" },
                    { id: "agreeNoTheft", label: "No theft" },
                    { id: "agreeNoGuests", label: "No overnight guests without approval" },
                    { id: "agreeCurfew", label: "Follow house curfew" },
                    { id: "agreeMeetings", label: "Attend required meetings and programs" },
                    { id: "agreeRespect", label: "Respect staff, housemates, and property" },
                    { id: "agreeDischarge", label: "Serious rule violations may result in immediate discharge" },
                  ].map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={formData[item.id] || false}
                        onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                        required
                      />
                      <label htmlFor={item.id} className="text-sm text-gray-300">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. Consent & Acknowledgments */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-white text-lg">9. Consent & Acknowledgments</h3>
                <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeShareInfo"
                      checked={formData.agreeShareInfo || false}
                      onChange={(e) => handleCheckboxChange("agreeShareInfo", e.target.checked)}
                      required
                    />
                    <label htmlFor="agreeShareInfo" className="text-sm text-gray-300">I consent to share my information with providers for review *</label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms || false}
                      onChange={(e) => handleCheckboxChange("agreeTerms", e.target.checked)}
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-300">I agree to the Sober Stay Terms of Use and Privacy Policy *</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              data-testid="button-save-profile"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Profile & Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
