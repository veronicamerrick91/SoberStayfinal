import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Check, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { TenantProfile } from "@shared/schema";

interface ApplicationData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  sobrietyStartDate: string;
  employmentStatus: string;
  monthlyIncome: string;
  references: string;
  reasonForApplying: string;
  specialNeeds: string;
}

export function TenantProfile() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    emergencyContactName: "",
    emergencyContactPhone: "",
    sobrietyStartDate: "",
    employmentStatus: "",
    monthlyIncome: "",
    references: "",
    reasonForApplying: "",
    specialNeeds: "",
  });
  const [hasCompletedApplication, setHasCompletedApplication] = useState(false);

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
          setApplicationData(data.applicationData);
          setHasCompletedApplication(true);
        }
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "profile" | "id"
  ) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileUrl = reader.result as string;
        
        const response = await fetch("/api/tenant/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, fileUrl }),
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        
        if (type === "profile") {
          setProfilePhoto(result.url);
        } else if (type === "id") {
          setIdPhoto(result.url);
        }

        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleApplicationChange = (field: keyof ApplicationData, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tenant/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bio,
          applicationData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setHasCompletedApplication(true);
      toast({
        title: "Success",
        description: "Profile updated successfully",
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

  const FileUploadBox = ({
    label,
    type,
    currentFile,
  }: {
    label: string;
    type: "profile" | "id";
    currentFile: string | null;
  }) => (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      {currentFile ? (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-gray-300">File uploaded</span>
          <button
            onClick={async () => {
              const input = document.createElement("input");
              input.type = "file";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleFileUpload(file, type);
                }
              };
              input.click();
            }}
            className="ml-auto text-xs text-primary hover:underline"
          >
            Replace
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            <span className="text-sm text-white font-medium">Click to upload</span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG up to 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, type);
                }
              }}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile once and reuse it for all your applications.
            </p>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                About You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Bio (Optional)</Label>
                <Textarea
                  placeholder="Tell providers a bit about yourself, your recovery goals, or what you're looking for in a sober living home..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-24"
                  data-testid="textarea-bio"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadBox
                label="Profile Photo"
                type="profile"
                currentFile={profilePhoto}
              />
              <FileUploadBox label="Government ID Photo" type="id" currentFile={idPhoto} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Application
              </CardTitle>
              {hasCompletedApplication && (
                <p className="text-sm text-emerald-400 font-medium mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Application saved
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName" className="text-white">
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContactName"
                    placeholder="Full name"
                    value={applicationData.emergencyContactName}
                    onChange={(e) => handleApplicationChange("emergencyContactName", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-emergency-contact-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone" className="text-white">
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    placeholder="Phone number"
                    value={applicationData.emergencyContactPhone}
                    onChange={(e) => handleApplicationChange("emergencyContactPhone", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-emergency-contact-phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sobrietyStartDate" className="text-white">
                    Sobriety Start Date
                  </Label>
                  <Input
                    id="sobrietyStartDate"
                    type="date"
                    value={applicationData.sobrietyStartDate}
                    onChange={(e) => handleApplicationChange("sobrietyStartDate", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-sobriety-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus" className="text-white">
                    Employment Status
                  </Label>
                  <Input
                    id="employmentStatus"
                    placeholder="e.g., Employed, Unemployed, Student"
                    value={applicationData.employmentStatus}
                    onChange={(e) => handleApplicationChange("employmentStatus", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-employment-status"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome" className="text-white">
                  Monthly Income (Optional)
                </Label>
                <Input
                  id="monthlyIncome"
                  placeholder="e.g., $2,000"
                  value={applicationData.monthlyIncome}
                  onChange={(e) => handleApplicationChange("monthlyIncome", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                  data-testid="input-monthly-income"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="references" className="text-white">
                  References
                </Label>
                <Textarea
                  id="references"
                  placeholder="Provide 2-3 references (name, relationship, phone number)"
                  value={applicationData.references}
                  onChange={(e) => handleApplicationChange("references", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-20"
                  data-testid="textarea-references"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonForApplying" className="text-white">
                  Why are you interested in this housing?
                </Label>
                <Textarea
                  id="reasonForApplying"
                  placeholder="Tell providers about your motivation and goals..."
                  value={applicationData.reasonForApplying}
                  onChange={(e) => handleApplicationChange("reasonForApplying", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-20"
                  data-testid="textarea-reason-for-applying"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialNeeds" className="text-white">
                  Any Special Needs or Considerations? (Optional)
                </Label>
                <Textarea
                  id="specialNeeds"
                  placeholder="e.g., Mobility needs, service animal, medical accommodations, etc."
                  value={applicationData.specialNeeds}
                  onChange={(e) => handleApplicationChange("specialNeeds", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-20"
                  data-testid="textarea-special-needs"
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Once you complete your application, you can quickly apply to properties without having to fill it out again.
                </p>
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
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
