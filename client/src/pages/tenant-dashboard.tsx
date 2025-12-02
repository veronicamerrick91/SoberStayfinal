import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getAuth, saveAuth } from "@/lib/auth";

export function EditProfile() {
  const [location, setLocation] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const user = getAuth() as any;
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    recoveryFocus: "",
    preferredLocation: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update auth with new profile data
    if (user?.id) {
      saveAuth({
        ...user,
        name: formData.name,
        email: formData.email,
      });
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setLocation("/tenant-dashboard");
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button 
            variant="ghost" 
            className="gap-2 mb-8 pl-0 text-muted-foreground hover:text-primary" 
            onClick={() => setLocation("/tenant-dashboard")}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
            <p className="text-muted-foreground">Update your personal information and preferences</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your full name"
                      className="bg-background/50 border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className="bg-background/50 border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">About You</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell providers about yourself, your recovery journey, and what matters to you..."
                    className="bg-background/50 border-border min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recovery Preferences */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Recovery Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Recovery Focus</Label>
                  <Select value={formData.recoveryFocus} onValueChange={(val) => handleChange("recoveryFocus", val)}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select your primary focus" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="aa-na">AA/NA Based</SelectItem>
                      <SelectItem value="faith">Faith-Based</SelectItem>
                      <SelectItem value="secular">Secular/SMART Recovery</SelectItem>
                      <SelectItem value="holistic">Holistic Wellness</SelectItem>
                      <SelectItem value="therapy">Therapy-Focused</SelectItem>
                      <SelectItem value="flexible">Flexible/Open</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Preferred Location</Label>
                  <Input
                    value={formData.preferredLocation}
                    onChange={(e) => handleChange("preferredLocation", e.target.value)}
                    placeholder="e.g., Boston, MA area"
                    className="bg-background/50 border-border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                data-testid="button-save-profile"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Profile"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLocation("/tenant-dashboard")} 
                className="flex-1 h-12"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Profile updated successfully!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
