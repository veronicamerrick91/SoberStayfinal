import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentModal } from "@/components/payment-modal";
import { ArrowLeft, CheckCircle, AlertCircle, Upload, X, Check } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getAuth } from "@/lib/auth";

interface ListingDraft {
  propertyName: string;
  address: string;
  city: string;
  state: string;
  monthlyPrice: string;
  totalBeds: string;
  gender: string;
  roomType: string;
  description: string;
  amenities: string[];
  supervisionType: string;
  isMatFriendly: boolean;
  isPetFriendly: boolean;
  isLgbtqFriendly: boolean;
  isFaithBased: boolean;
  inclusions: string[];
  photos: string[];
}

export function CreateListing() {
  const [location, setLocation] = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [listingDraft, setListingDraft] = useState<ListingDraft>({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    monthlyPrice: "",
    totalBeds: "",
    gender: "Men",
    roomType: "Private Room",
    description: "",
    amenities: [],
    supervisionType: "Supervised",
    isMatFriendly: false,
    isPetFriendly: false,
    isLgbtqFriendly: false,
    isFaithBased: false,
    inclusions: [],
    photos: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const user = getAuth() as any;

  const handleInputChange = (field: keyof ListingDraft, value: any) => {
    setListingDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setListingDraft(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleInclusionChange = (item: string) => {
    setListingDraft(prev => ({
      ...prev,
      inclusions: prev.inclusions.includes(item)
        ? prev.inclusions.filter(i => i !== item)
        : [...prev.inclusions, item]
    }));
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setListingDraft(prev => ({ ...prev, [key]: checked }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      const totalPhotos = listingDraft.photos.length + newPhotos.length;
      if (totalPhotos <= 15) {
        setListingDraft(prev => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos]
        }));
      } else {
        alert(`You can upload a maximum of 15 photos. You currently have ${listingDraft.photos.length} photo(s).`);
      }
    }
  };

  const removePhoto = (index: number) => {
    setListingDraft(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const isStep1Complete = listingDraft.propertyName && listingDraft.city && listingDraft.state;
  const isStep2Complete = listingDraft.monthlyPrice && listingDraft.totalBeds;
  const isStep3Complete = listingDraft.description;

  const handlePublish = () => {
    if (user?.id && isStep1Complete && isStep2Complete && isStep3Complete) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setLocation("/provider-dashboard?tab=properties");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            className="gap-2 mb-8 pl-0 text-muted-foreground hover:text-primary"
            onClick={() => setLocation("/provider-dashboard")}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Property Listing</h1>
            <p className="text-muted-foreground">
              Complete this form to create a draft listing. You'll be asked to confirm payment before publishing.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                  step <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <form className="space-y-6">
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Property Name *</Label>
                    <Input
                      placeholder="e.g., Serenity House Boston"
                      value={listingDraft.propertyName}
                      onChange={(e) => handleInputChange("propertyName", e.target.value)}
                      className="bg-background/50 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Street Address</Label>
                    <Input
                      placeholder="123 Main Street"
                      value={listingDraft.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-background/50 border-border"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">City *</Label>
                      <Input
                        placeholder="Boston"
                        value={listingDraft.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">State *</Label>
                      <Input
                        placeholder="MA"
                        value={listingDraft.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Gender Preference *</Label>
                    <Select value={listingDraft.gender} onValueChange={(val) => handleInputChange("gender", val)}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Men">Men Only</SelectItem>
                        <SelectItem value="Women">Women Only</SelectItem>
                        <SelectItem value="Co-ed">Co-ed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <Label className="text-white">Property Photos {listingDraft.photos.length}/15</Label>
                    <p className="text-xs text-muted-foreground">Upload 5-15 high-quality photos of your property. First photo will be used as the listing cover.</p>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-primary" />
                        <span className="text-sm text-white font-medium">Click to upload photos</span>
                        <span className="text-xs text-muted-foreground">or drag and drop (Max 15 photos)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={listingDraft.photos.length >= 15}
                        />
                      </label>
                    </div>

                    {listingDraft.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        {listingDraft.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img src={photo} alt={`Property photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-border" />
                            {index === 0 && <span className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">Cover</span>}
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Capacity & Features */}
            {currentStep === 2 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    Capacity & Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Monthly Price (USD) *</Label>
                      <Input
                        type="number"
                        placeholder="1200"
                        value={listingDraft.monthlyPrice}
                        onChange={(e) => handleInputChange("monthlyPrice", e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Total Beds *</Label>
                      <Input
                        type="number"
                        placeholder="6"
                        value={listingDraft.totalBeds}
                        onChange={(e) => handleInputChange("totalBeds", e.target.value)}
                        className="bg-background/50 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Room Type *</Label>
                    <Select value={listingDraft.roomType} onValueChange={(val) => handleInputChange("roomType", val)}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Private Room">Private Room</SelectItem>
                        <SelectItem value="Shared Room">Shared Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Supervision Type *</Label>
                    <Select value={listingDraft.supervisionType} onValueChange={(val) => handleInputChange("supervisionType", val)}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Peer Ran">Peer Ran</SelectItem>
                        <SelectItem value="Supervised">Supervised</SelectItem>
                        <SelectItem value="Monitored">Monitored</SelectItem>
                        <SelectItem value="Integrated Treatment">Integrated Treatment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Label className="text-white text-sm font-semibold">What's Included in Monthly Price</Label>
                    <p className="text-xs text-muted-foreground mb-2">Select everything that is covered by the resident's monthly payment.</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "Food / Meals",
                        "Transportation",
                        "Drug Testing",
                        "Utilities (All)",
                        "WiFi / Internet",
                        "Cable / Streaming",
                        "Linens & Bedding",
                        "Toiletries",
                        "Gym Access",
                        "Case Management",
                        "Peer Support",
                        "Therapy Sessions"
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox
                            checked={listingDraft.inclusions.includes(item)}
                            onCheckedChange={() => handleInclusionChange(item)}
                          />
                          <label className="text-sm text-gray-300 cursor-pointer">{item}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Label className="text-white text-sm font-semibold">Property Features</Label>
                    <div className="space-y-2">
                      {[
                        { key: "isMatFriendly", label: "MAT (Medication-Assisted Treatment) Friendly" },
                        { key: "isPetFriendly", label: "Pet Friendly" },
                        { key: "isLgbtqFriendly", label: "LGBTQ+ Friendly" },
                        { key: "isFaithBased", label: "Faith-Based Program" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            checked={listingDraft[key as keyof ListingDraft] as boolean}
                            onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
                            data-testid={`checkbox-${key}`}
                          />
                          <label className="text-sm text-gray-300 cursor-pointer">{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: Description & Amenities */}
            {currentStep === 3 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    Description & Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Property Description *</Label>
                    <Textarea
                      placeholder="Describe your property, house culture, recovery approach, and what makes it special..."
                      value={listingDraft.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-background/50 border-border min-h-24"
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <Label className="text-white text-sm font-semibold">Amenities & Services</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "Washer/Dryer",
                        "Kitchen Access",
                        "On-site Gym",
                        "Parking",
                        "Garden/Outdoor Space",
                        "Swimming Pool",
                        "Common Area / Lounge",
                        "Designated Smoking Area"
                      ].map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Checkbox
                            checked={listingDraft.amenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityChange(amenity)}
                          />
                          <label className="text-sm text-gray-300 cursor-pointer">{amenity}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-white font-semibold mb-1">Next: Review Your Listing</p>
                        <p className="text-muted-foreground">
                          Click "Review Listing" to see how your property will appear to tenants before confirming payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 4: Review & Preview */}
            {currentStep === 4 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                      4
                    </span>
                    Review Your Listing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{listingDraft.propertyName}</h2>
                        <p className="text-sm text-muted-foreground">{listingDraft.address}, {listingDraft.city}, {listingDraft.state}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${listingDraft.monthlyPrice}</div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">{listingDraft.gender}</div>
                      <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">{listingDraft.totalBeds} Beds</div>
                      <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">{listingDraft.supervisionType}</div>
                      <div className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded">{listingDraft.roomType}</div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-white mb-2 text-sm">Description</h3>
                      <p className="text-sm text-gray-300">{listingDraft.description}</p>
                    </div>

                    {listingDraft.inclusions.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-white mb-2 text-sm">Included in Price</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {listingDraft.inclusions.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <Check className="w-3 h-3 text-primary" /> {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {listingDraft.amenities.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-white mb-2 text-sm">Amenities</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {listingDraft.amenities.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <Check className="w-3 h-3 text-primary" /> {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {listingDraft.photos.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-white mb-3 text-sm">Photos ({listingDraft.photos.length})</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {listingDraft.photos.slice(0, 3).map((photo, i) => (
                            <img key={i} src={photo} alt={`Preview ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-border" />
                          ))}
                        </div>
                        {listingDraft.photos.length > 3 && (
                          <p className="text-xs text-muted-foreground mt-2">+{listingDraft.photos.length - 3} more photos</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-white font-semibold mb-1">Ready to Publish</p>
                        <p className="text-muted-foreground">
                          Click "Publish & Pay" to complete your $49/month subscription and publish this listing.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation & Action Buttons */}
            <div className="flex gap-3 justify-between pt-4">
              <Button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                variant="outline"
                className="border-border"
                disabled={currentStep === 1}
              >
                Back
              </Button>

              <div className="flex gap-3">
                {currentStep < 4 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={
                      (currentStep === 1 && !isStep1Complete) ||
                      (currentStep === 2 && !isStep2Complete) ||
                      (currentStep === 3 && !isStep3Complete)
                    }
                    data-testid="button-next-step"
                  >
                    {currentStep === 3 ? "Review Listing" : "Next"}
                  </Button>
                )}
                {currentStep === 4 && (
                  <Button
                    onClick={handlePublish}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    disabled={!isStep1Complete || !isStep2Complete || !isStep3Complete}
                    data-testid="button-publish-listing"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Publish & Pay
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {user?.id && (
        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          providerId={user.id}
          listingCount={1}
        />
      )}
    </Layout>
  );
}
