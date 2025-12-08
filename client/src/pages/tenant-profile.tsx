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

export function TenantProfile() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [applicationFile, setApplicationFile] = useState<string | null>(null);

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
        setApplicationFile(data.applicationUrl);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "profile" | "id" | "application"
  ) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Convert file to base64 URL for storage
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
        } else if (type === "application") {
          setApplicationFile(result.url);
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

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/tenant/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

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
    type: "profile" | "id" | "application";
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
              {type === "application" ? "PDF, DOC up to 10MB" : "JPG, PNG up to 5MB"}
            </span>
            <input
              type="file"
              accept={type === "application" ? ".pdf,.doc,.docx" : "image/*"}
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
              Upload your documents once and use them for all your applications.
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
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadBox
                label="Profile Photo"
                type="profile"
                currentFile={profilePhoto}
              />
              <FileUploadBox label="ID Photo" type="id" currentFile={idPhoto} />
              <FileUploadBox
                label="Completed Application (Pre-filled)"
                type="application"
                currentFile={applicationFile}
              />
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Once uploaded, you can quickly apply to properties by sharing these documents instead of filling out forms each time.
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
