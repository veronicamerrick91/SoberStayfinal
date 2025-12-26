import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Check, Loader2, Building, MapPin, Phone, Globe, Calendar, Bed } from "lucide-react";
import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { ProviderProfile } from "@shared/schema";

export function ProviderProfilePage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    phone: "",
    smsOptIn: false,
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    foundedYear: "",
    totalBeds: "",
  });

  const user = getAuth();

  useEffect(() => {
    if (!user || user.role !== "provider") {
      setLocation("/for-providers");
      return;
    }
    loadProfile();
  }, [user, setLocation]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/provider/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setLogoUrl(data.logoUrl);
        setFormData({
          companyName: data.companyName || "",
          website: data.website || "",
          phone: data.phone || "",
          smsOptIn: data.smsOptIn || false,
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
          foundedYear: data.foundedYear ? String(data.foundedYear) : "",
          totalBeds: data.totalBeds ? String(data.totalBeds) : "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileUrl = reader.result as string;
          setLogoUrl(fileUrl);

          const response = await fetch("/api/provider/upload-logo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logoUrl: fileUrl }),
          });

          if (!response.ok) throw new Error("Upload failed");

          toast({
            title: "Success",
            description: "Logo uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload logo",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/provider/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      toast({
        title: "Success",
        description: "Company profile saved successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-page-title">Company Profile</h1>
            <p className="text-muted-foreground">Manage your company information and branding.</p>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                {logoUrl ? (
                  <div className="relative">
                    <img 
                      src={logoUrl} 
                      alt="Company Logo" 
                      className="w-32 h-32 rounded-lg object-contain border-2 border-primary/30 bg-white p-2"
                      data-testid="img-company-logo"
                    />
                    <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-3 cursor-pointer" data-testid="button-upload-logo">
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-dashed border-primary/50 hover:border-primary hover:from-primary/30 hover:to-primary/20 transition-all flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your company logo. This will appear on your listings and communications.
                  </p>
                  {logoUrl && (
                    <label className="text-sm text-primary hover:underline cursor-pointer" data-testid="button-replace-logo">
                      Replace logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Company Name</Label>
                <Input
                  placeholder="Your Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                  data-testid="input-company-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  placeholder="Tell prospective tenants about your company, mission, and what makes your sober living homes special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary min-h-32"
                  data-testid="input-description"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    placeholder="https://www.yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-website"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-phone"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="smsOptIn"
                      checked={formData.smsOptIn}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smsOptIn: checked === true }))}
                      data-testid="checkbox-sms-opt-in"
                    />
                    <Label htmlFor="smsOptIn" className="text-sm text-muted-foreground cursor-pointer">
                      Receive SMS notifications for new applications and inquiries
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Year Founded
                  </Label>
                  <Input
                    type="number"
                    placeholder="2010"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-founded-year"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Total Beds (All Properties)
                  </Label>
                  <Input
                    type="number"
                    placeholder="50"
                    min="0"
                    value={formData.totalBeds}
                    onChange={(e) => handleInputChange("totalBeds", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-total-beds"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Headquarters Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Street Address</Label>
                <Input
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                  data-testid="input-address"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">City</Label>
                  <Input
                    placeholder="Los Angeles"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-city"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">State</Label>
                  <Input
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-state"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">ZIP Code</Label>
                  <Input
                    placeholder="90001"
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                    data-testid="input-zip"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/provider-dashboard")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-save"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
