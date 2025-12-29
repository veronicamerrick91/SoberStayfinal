import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "@/components/content-editor";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, MessageSquare, AlertCircle, 
  Plus, Check, X, MoreHorizontal, Search, ChevronRight,
  Bed, FileText, Settings, Lock, Mail, Phone, Upload, Shield, ToggleRight,
  Zap, BarChart3, FileArchive, Folder, Share2, TrendingUp, Calendar, Clock, MapPin, Video, Eye, CreditCard,
  ShieldCheck, Loader2, RotateCcw, CheckCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { SUPERVISION_DEFINITIONS } from "@/lib/mock-data";
import type { Listing } from "@shared/schema";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PaymentModal } from "@/components/payment-modal";
import { getAuth } from "@/lib/auth";
import { TourRequest } from "@/components/tour-schedule-modal";
import { ApplicationDetailsModal, ApplicationData } from "@/components/application-details-modal";

interface ChatMessage {
  sender: "tenant" | "provider";
  text: string;
  timestamp: Date;
}

interface AnalyticsSummary {
  totals: {
    views: number;
    clicks: number;
    inquiries: number;
    tourRequests: number;
    applications: number;
  };
  dailyData: Array<{
    eventDate: string;
    views: number;
    clicks: number;
    inquiries: number;
    tourRequests: number;
    applications: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

interface LocationData {
  city: string;
  state: string;
  count: number;
}

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [summaryRes, locationsRes] = await Promise.all([
          fetch(`/api/provider/analytics/summary?days=${timeframe}`, { credentials: 'include' }),
          fetch(`/api/provider/analytics/locations?days=${timeframe}`, { credentials: 'include' })
        ]);
        
        if (summaryRes.ok) {
          const data = await summaryRes.json();
          setAnalytics(data);
        }
        
        if (locationsRes.ok) {
          const data = await locationsRes.json();
          setLocations(data.locations || []);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totals = analytics?.totals || { views: 0, clicks: 0, inquiries: 0, tourRequests: 0, applications: 0 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Performance Analytics
        </h2>
        <div className="flex gap-2">
          {[7, 30, 90].map(days => (
            <Button
              key={days}
              variant={timeframe === days ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(days)}
              data-testid={`button-timeframe-${days}`}
            >
              {days}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Views</p>
                <h3 className="text-2xl font-bold text-white">{totals.views.toLocaleString()}</h3>
              </div>
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clicks</p>
                <h3 className="text-2xl font-bold text-white">{totals.clicks.toLocaleString()}</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                <h3 className="text-2xl font-bold text-white">{totals.inquiries.toLocaleString()}</h3>
              </div>
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tour Requests</p>
                <h3 className="text-2xl font-bold text-white">{totals.tourRequests.toLocaleString()}</h3>
              </div>
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h3 className="text-2xl font-bold text-white">{totals.applications.toLocaleString()}</h3>
              </div>
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.dailyData && analytics.dailyData.length > 0 ? (
              <div className="space-y-2">
                {analytics.dailyData.slice(0, 7).map((day, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">
                      {new Date(day.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-400">{day.views} views</span>
                      <span className="text-green-400">{day.clicks} clicks</span>
                      <span className="text-primary">{day.applications} apps</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No data yet for this period</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Analytics will appear as visitors interact with your listings</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Top Visitor Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locations.length > 0 ? (
              <div className="space-y-2">
                {locations.slice(0, 10).map((loc, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-white">{loc.city}, {loc.state}</span>
                    <Badge variant="secondary">{loc.count} visits</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No location data yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Location tracking requires visitor interactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-card border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Real-Time Tracking Active</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your listings are being tracked for views, clicks, inquiries, tour requests, and applications. 
                Data updates automatically as visitors interact with your properties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface Conversation {
  propertyId: string;
  propertyName: string;
  tenantName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Add authentication check component
function ProviderDashboardWrapper(props: any) {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const user = getAuth();
    if (!user || user.role !== "provider") {
      setLocation("/for-providers");
    }
  }, [setLocation]);
  
  const user = getAuth();
  if (!user || user.role !== "provider") {
    return null;
  }
  
  return <ProviderDashboardContent {...props} />;
}

// Applications will be fetched from the database - no test data

function ProviderDashboardContent() {
  const [location, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  
  // Application Review State
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  
  // Beds Management State - initialized from real listings
  const [bedsAvailable, setBedsAvailable] = useState<Record<string, number>>({});

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Featured Listings state
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedListingToBoost, setSelectedListingToBoost] = useState<Listing | null>(null);
  const [boostLevel, setBoostLevel] = useState(2);
  const [boostDuration, setBoostDuration] = useState(7);
  const [isBoostLoading, setIsBoostLoading] = useState(false);
  
  // Provider verification state
  const [isDocumentsVerified, setIsDocumentsVerified] = useState(false);
  
  // Two-Factor Authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetupModal, setShow2FASetupModal] = useState(false);
  const [twoFactorQRCode, setTwoFactorQRCode] = useState<string>("");
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState<"app" | "sms">("app");
  const [smsPhoneNumber, setSmsPhoneNumber] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  
  
  // Provider listings from API
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Provider settings state
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Notification preferences with localStorage persistence
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = localStorage.getItem("provider_notification_prefs");
    if (saved) return JSON.parse(saved);
    return {
      newInquiries: true,
      applicationUpdates: true,
      marketingEmails: false,
      securityAlerts: true
    };
  });
  
  // Verification document uploads
  const [verificationDocs, setVerificationDocs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("provider_verification_docs");
    if (saved) return JSON.parse(saved);
    return {};
  });

  const user = getAuth();

  const handleViewApplication = (app: ApplicationData) => {
    setSelectedApplication(app);
    setIsAppDetailsOpen(true);
  };
  
  // Handle provider settings update
  const handleUpdateSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/provider/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactEmail: settingsEmail,
          contactPhone: settingsPhone
        })
      });
      if (res.ok) {
        alert("Settings updated successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update settings");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Failed to update settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleApproveApplication = async (id: string, moveInDate?: string) => {
    try {
      const res = await fetch(`/api/provider/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', moveInDate })
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: "Approved" } : app
        ));
      } else {
        const error = await res.json();
        alert(error.error || "Failed to approve application");
      }
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application");
    }
  };

  const handleDenyApplication = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/provider/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason })
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: "Denied" } : app
        ));
      } else {
        const error = await res.json();
        alert(error.error || "Failed to deny application");
      }
    } catch (err) {
      console.error("Error denying application:", err);
      alert("Failed to deny application");
    }
  };

  // Two-Factor Authentication handlers
  const handleSetup2FA = async () => {
    setTwoFactorLoading(true);
    setTwoFactorError("");
    try {
      const res = await fetch('/api/provider/2fa/setup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setTwoFactorQRCode(data.qrCode);
        setTwoFactorSecret(data.secret);
        setShow2FASetupModal(true);
      } else {
        const error = await res.json();
        setTwoFactorError(error.error || "Failed to setup 2FA");
      }
    } catch (err) {
      console.error("Error setting up 2FA:", err);
      setTwoFactorError("Failed to setup 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorToken || twoFactorToken.length !== 6) {
      setTwoFactorError("Please enter a 6-digit code");
      return;
    }
    setTwoFactorLoading(true);
    setTwoFactorError("");
    try {
      const res = await fetch('/api/provider/2fa/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: twoFactorToken })
      });
      if (res.ok) {
        setTwoFactorEnabled(true);
        setShow2FASetupModal(false);
        setTwoFactorToken("");
        setTwoFactorQRCode("");
        setTwoFactorSecret("");
      } else {
        const error = await res.json();
        setTwoFactorError(error.error || "Invalid verification code");
      }
    } catch (err) {
      console.error("Error verifying 2FA:", err);
      setTwoFactorError("Failed to verify code");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const token = prompt("Enter your current 6-digit authenticator code to disable 2FA:");
    if (!token || token.length !== 6) {
      return;
    }
    setTwoFactorLoading(true);
    try {
      const res = await fetch('/api/provider/2fa/disable', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        setTwoFactorEnabled(false);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to disable 2FA");
      }
    } catch (err) {
      console.error("Error disabling 2FA:", err);
      alert("Failed to disable 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleBoostListing = async () => {
    if (!selectedListingToBoost) return;
    setIsBoostLoading(true);
    try {
      const res = await fetch('/api/provider/featured-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingId: selectedListingToBoost.id,
          boostLevel,
          durationDays: boostDuration
        })
      });
      if (res.ok) {
        const newFeatured = await res.json();
        setFeaturedListings(prev => [...prev, newFeatured]);
        setShowBoostModal(false);
        setSelectedListingToBoost(null);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to boost listing');
      }
    } catch (err) {
      console.error("Error boosting listing:", err);
      alert('Failed to boost listing');
    } finally {
      setIsBoostLoading(false);
    }
  };

  const isListingFeatured = (listingId: number) => {
    return featuredListings.some(f => f.listingId === listingId && f.isActive && new Date(f.endDate) > new Date());
  };

  const getBoostPrice = () => {
    if (boostLevel === 5) return 200;
    if (boostLevel === 3) return 150;
    return 100;
  };

  useEffect(() => {
    // Fetch provider's listings from API (includes drafts)
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings/provider', { credentials: 'include' });
        if (res.ok) {
          const providerListings = await res.json();
          setListings(providerListings);
          
          // Load conversations based on real listings
          const allConversations: Conversation[] = [];
          providerListings.forEach((property: Listing) => {
            const key = `chat_${property.id}`;
            const stored = localStorage.getItem(key);
            if (stored) {
              try {
                const messages = JSON.parse(stored) as ChatMessage[];
                if (messages.length > 0) {
                  const lastMsg = messages[messages.length - 1];
                  const unreadFromTenant = messages.filter(m => m.sender === "tenant" && m.text).length;
                  allConversations.push({
                    propertyId: String(property.id),
                    propertyName: property.propertyName,
                    tenantName: "Interested Tenant",
                    lastMessage: lastMsg.text.substring(0, 60),
                    lastMessageTime: new Date(lastMsg.timestamp),
                    unreadCount: unreadFromTenant,
                  });
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          });
          setConversations(allConversations.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()));
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    // Load tour requests from localStorage
    const storedTours = localStorage.getItem("tour_requests");
    if (storedTours) {
      try {
        const tours = JSON.parse(storedTours) as TourRequest[];
        setTourRequests(tours);
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Check subscription status from real Stripe data via API (includes fee waivers)
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/stripe/subscription', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.subscription && (data.subscription.status === 'active' || data.subscription.status === 'trialing')) {
            setHasActiveSubscription(true);
            setSubscriptionStatus({
              subscriptionStatus: 'active',
              monthlyFee: data.subscription.hasFeeWaiver ? 0 : 49,
              stripeSubscriptionId: data.subscription.id,
              hasFeeWaiver: data.subscription.hasFeeWaiver || false
            });
          } else {
            setHasActiveSubscription(false);
            setSubscriptionStatus(null);
          }
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setHasActiveSubscription(false);
      }
    };
    
    // Fetch featured listings
    const fetchFeaturedListings = async () => {
      try {
        const res = await fetch('/api/provider/featured-listings', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFeaturedListings(data);
        }
      } catch (err) {
        console.error("Error fetching featured listings:", err);
      }
    };
    
    // Fetch provider verification status and profile data
    const fetchVerificationStatus = async () => {
      try {
        const res = await fetch('/api/provider/profile', { credentials: 'include' });
        if (res.ok) {
          const profile = await res.json();
          setIsDocumentsVerified(profile.documentsVerified === true);
          setTwoFactorEnabled(profile.twoFactorEnabled === true);
          // Pre-fill settings from profile
          if (profile.phone) setSettingsPhone(profile.phone);
          if (profile.contactPhone) setSettingsPhone(profile.contactPhone);
        }
      } catch (err) {
        console.error("Error fetching verification status:", err);
      }
      // Also try to get email from user if not in profile
      const user = getAuth();
      if (user?.email && !settingsEmail) {
        setSettingsEmail(user.email);
      }
    };
    
    // Also fetch 2FA status from dedicated endpoint
    const fetch2FAStatus = async () => {
      try {
        const res = await fetch('/api/provider/2fa/status', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setTwoFactorEnabled(data.enabled === true);
        }
      } catch (err) {
        console.error("Error fetching 2FA status:", err);
      }
    };
    
    // Fetch real applications from API
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/provider/applications', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          // Handle both array and object wrapper response formats
          const apps = Array.isArray(data) ? data : (data.applications || []);
          // Map API response to ApplicationData format
          const mappedApplications: ApplicationData[] = apps.map((app: any) => {
            const appData = app.applicationData || {};
            return {
              id: String(app.id),
              applicantName: app.tenantName || 'Unknown Applicant',
              email: app.tenantEmail || '',
              phone: appData.phone || appData.emergencyPhone || 'Not provided',
              property: app.propertyName || 'Unknown Property',
              submittedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown',
              status: app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Denied' : app.status === 'pending' ? 'New' : 'Screening',
              avatar: app.profilePhotoUrl || undefined,
              idPhotoUrl: app.idPhotoUrl || undefined,
              dob: appData.dateOfBirth || 'Not provided',
              gender: appData.gender || 'Not provided',
              currentAddress: appData.currentAddress || 'Not provided',
              primarySubstance: appData.primarySubstance || 'Not disclosed',
              soberDate: appData.sobrietyDate || 'Not provided',
              soberLength: appData.sobrietyLength || 'Not provided',
              matStatus: appData.matProgram === 'yes' || appData.matStatus === true,
              matMeds: appData.matMedications || undefined,
              probation: appData.legalStatus === 'probation' || appData.probation === true,
              pendingCases: appData.pendingCases === true || appData.pendingLegalCases === 'yes',
              medicalConditions: appData.medicalConditions || 'None',
              medications: appData.currentMedications || 'None',
              employmentStatus: appData.employmentStatus || 'Not provided',
              incomeSource: appData.incomeSource || 'Not provided',
              evictionHistory: appData.evictionHistory === true || appData.priorEvictions === 'yes',
              reasonForLeaving: appData.reasonForLeaving || appData.whySeekingSoberLiving || 'Not provided',
            };
          });
          setApplications(mappedApplications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    // Load all data in parallel and set loading to false when done
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchListings(),
          fetchSubscription(),
          fetchFeaturedListings(),
          fetchVerificationStatus(),
          fetch2FAStatus(),
          fetchApplications()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, [user?.id]);

  // Handle return from Stripe checkout - refetch subscription status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      // User returned from successful Stripe checkout - refetch subscription with retry
      const checkSubscription = async (attempts = 0) => {
        try {
          const res = await fetch('/api/stripe/subscription', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data.subscription && (data.subscription.status === 'active' || data.subscription.status === 'trialing')) {
              setHasActiveSubscription(true);
              setSubscriptionStatus({
                subscriptionStatus: 'active',
                monthlyFee: data.subscription.hasFeeWaiver ? 0 : 49,
                stripeSubscriptionId: data.subscription.id,
                hasFeeWaiver: data.subscription.hasFeeWaiver || false
              });
              // Clear the query param
              window.history.replaceState({}, '', '/provider-dashboard');
              return;
            }
          }
          // Subscription not active yet - webhook may still be processing
          if (attempts < 5) {
            setTimeout(() => checkSubscription(attempts + 1), 2000);
          } else {
            // Clear param after max attempts
            window.history.replaceState({}, '', '/provider-dashboard');
          }
        } catch (err) {
          console.error("Error checking subscription:", err);
        }
      };
      
      // Start checking after a short delay to allow webhook processing
      setTimeout(() => checkSubscription(0), 1000);
    }
  }, []);

  const handleTourResponse = (tourId: string, status: "approved" | "denied" | "rescheduled" | "pending", notes?: string) => {
    const updatedTours = tourRequests.map(tour =>
      tour.id === tourId ? { 
        ...tour, 
        status, 
        providerNotes: notes
      } : tour
    );
    setTourRequests(updatedTours);
    localStorage.setItem("tour_requests", JSON.stringify(updatedTours));
  };

  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [suggestedDate, setSuggestedDate] = useState("");
  const [suggestedTime, setSuggestedTime] = useState("");
  const [rescheduleNotes, setRescheduleNotes] = useState("");

  const handleSuggestDifferentTime = (tourId: string) => {
    setRescheduleTarget(tourId);
    setSuggestedDate("");
    setSuggestedTime("");
    setRescheduleNotes("");
    setShowRescheduleDialog(true);
  };

  const confirmReschedule = () => {
    if (rescheduleTarget && suggestedDate && suggestedTime) {
      const notes = `Suggested alternative: ${suggestedDate} at ${suggestedTime}${rescheduleNotes ? `. ${rescheduleNotes}` : ""}`;
      handleTourResponse(rescheduleTarget, "rescheduled", notes);
      setShowRescheduleDialog(false);
      setRescheduleTarget(null);
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Provider Portal</h1>
            <p className="text-muted-foreground">Manage your properties and connect with tenants.</p>
            {subscriptionStatus && (
              <div className="mt-2 text-sm">
                <Badge className={subscriptionStatus.subscriptionStatus === "active" ? "bg-green-500/80" : "bg-amber-500/80"}>
                  {subscriptionStatus.subscriptionStatus === "active" 
                    ? (subscriptionStatus.hasFeeWaiver 
                        ? `✓ Fee Waiver Active until ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()} · Unlimited Listings` 
                        : `✓ Subscription Active · $${subscriptionStatus.monthlyFee}/month per listing`)
                    : "No Active Subscription"}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setLocation("/provider-profile")}
              variant="outline"
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              data-testid="button-company-profile"
            >
              <Building className="w-4 h-4" /> Company Profile
            </Button>
            <Button 
              onClick={() => setLocation("/analytics")}
              variant="outline"
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              data-testid="button-analytics"
            >
              <TrendingUp className="w-4 h-4" /> Analytics
            </Button>
            <Button 
              onClick={() => setLocation("/create-listing")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              data-testid="button-list-property"
            >
              <Plus className="w-4 h-4" /> List New Property
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex flex-wrap gap-2 h-auto justify-start rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Overview</TabsTrigger>
            <TabsTrigger value="properties" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Listings</TabsTrigger>
            <TabsTrigger value="messages" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Messages</TabsTrigger>
            <TabsTrigger value="inbox" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Applications</TabsTrigger>
            <TabsTrigger value="beds" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Bed className="w-4 h-4" /> Beds</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><BarChart3 className="w-4 h-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Zap className="w-4 h-4" /> Marketing</TabsTrigger>
            <TabsTrigger value="files" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><FileArchive className="w-4 h-4" /> Files</TabsTrigger>
            <TabsTrigger value="verification" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Shield className="w-4 h-4" /> Verify</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
            <TabsTrigger value="tours" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><Calendar className="w-4 h-4" /> Tour Requests</TabsTrigger>
            <TabsTrigger value="billing" className="gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all"><CreditCard className="w-4 h-4" /> Billing</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <h3 className="text-3xl font-bold text-white">{applications.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {applications.length > 0 ? `${applications.filter(a => a.status === "New").length} new` : "No applications yet"}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  {(() => {
                    const totalBeds = listings.reduce((sum, l) => sum + (l.totalBeds || 0), 0);
                    const totalAvailable = listings.reduce((sum, l) => sum + (bedsAvailable[l.id] ?? l.totalBeds ?? 0), 0);
                    const filledBeds = totalBeds - totalAvailable;
                    const occupancyRate = totalBeds > 0 ? Math.round((filledBeds / totalBeds) * 100) : 0;
                    return (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Beds Filled</p>
                            <h3 className="text-3xl font-bold text-white">{filledBeds}/{totalBeds}</h3>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {totalBeds > 0 ? `${occupancyRate}% occupancy rate` : "No listings yet"}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                      <h3 className="text-3xl font-bold text-white">{conversations.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-primary font-bold">
                    {conversations.length > 0 ? `${conversations.filter(c => c.unreadCount > 0).length} active` : "Start connecting"}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                      <h3 className="text-3xl font-bold text-white">{applications.filter(a => a.status === "New" || a.status === "Screening").length}</h3>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="text-xs text-amber-500 font-bold">
                    Requires attention
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {!hasActiveSubscription && (
              <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-card border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Subscribe to List Properties</h3>
                      <p className="text-sm text-muted-foreground">Get access to unlimited listings, tenant messaging, and more.</p>
                    </div>
                    <Button 
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      data-testid="button-subscribe"
                    >
                      <CreditCard className="w-4 h-4" /> Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                      <Eye className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Preview Tenant Applications</h3>
                      <p className="text-sm text-muted-foreground">See exactly what tenants fill out when applying to your listings. Preview the full application form to understand the information you'll receive.</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/apply/preview', '_blank')}
                    className="gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 whitespace-nowrap"
                    data-testid="button-preview-application"
                  >
                    <Eye className="w-4 h-4" /> Preview Application Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Recent Messages</h3>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.slice(0, 5).map((conv) => (
                      <div key={conv.propertyId} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-white text-sm">{conv.propertyName}</h4>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-white text-xs">{conv.unreadCount}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">{conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">No active conversations yet. Wait for tenants to chat!</p>
                )}
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Recent Applications</h3>
            <Card className="bg-card border-border overflow-hidden">
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-4 font-medium">Applicant</th>
                      <th className="p-4 font-medium">Property</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">{app.applicantName}</td>
                        <td className="p-4 text-gray-300">{app.property}</td>
                        <td className="p-4 text-muted-foreground">{app.submittedDate}</td>
                        <td className="p-4">
                          <Badge variant={app.status === "New" ? "default" : app.status === "Approved" ? "secondary" : "outline"}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => handleViewApplication(app)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties">
            <div className="grid md:grid-cols-3 gap-6">
              {listings.length === 0 ? (
                <Card className="bg-card border-border col-span-3">
                  <CardContent className="p-8 text-center">
                    <Building className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Listings Yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first sober living property to get started</p>
                    <Button onClick={() => setLocation("/create-listing")} className="bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" /> Add Property
                    </Button>
                  </CardContent>
                </Card>
              ) : listings.map((home) => (
                <Card key={home.id} className="bg-card border-border group overflow-hidden">
                   <div className="relative h-40 overflow-hidden bg-primary/20 flex items-center justify-center">
                      {home.photos && home.photos.length > 0 ? (
                        <img src={home.photos[0]} loading="lazy" alt={home.propertyName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <Building className="w-12 h-12 text-primary/50" />
                      )}
                      <div className="absolute top-2 left-2">
                        {home.status === "draft" && (
                          <Badge className="bg-amber-500 text-black">Draft</Badge>
                        )}
                        {home.status === "pending" && (
                          <Badge className="bg-blue-500">Pending Review</Badge>
                        )}
                        {home.status === "active" && (
                          <Badge className="bg-green-500">Active</Badge>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className={home.totalBeds > 0 ? "bg-green-500" : "bg-red-500"}>
                          {home.totalBeds} Beds
                        </Badge>
                      </div>
                   </div>
                   <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-1">{home.propertyName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{home.address || "No address yet"}</p>
                      <div className="flex gap-2">
                        {home.status === "draft" ? (
                          <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black" onClick={() => setLocation(`/edit-listing/${home.id}`)} data-testid={`button-continue-${home.id}`}>Continue Editing</Button>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => setLocation(`/edit-listing/${home.id}`)} data-testid={`button-edit-${home.id}`}>Edit</Button>
                            <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={() => setLocation(`/edit-listing/${home.id}`)} data-testid={`button-manage-${home.id}`}>Manage</Button>
                          </>
                        )}
                      </div>
                   </CardContent>
                </Card>
              ))}
              
              <Card className="bg-card border-border border-dashed flex flex-col items-center justify-center h-full min-h-[250px] cursor-pointer hover:bg-white/5 transition-colors p-6">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-1">Add Property</h3>
                <p className="text-sm text-muted-foreground mb-6">List a new home</p>
                
                {/* Mock Form Preview (Visual only for prototype) */}
                <div className="w-full text-left space-y-4 border-t border-white/10 pt-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">New Listing Options</div>
                  
                  {/* Supervision Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-white flex items-center gap-1">
                      Supervision Type 
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </Label>
                    <RadioGroup defaultValue="Supported">
                      <div className="grid grid-cols-1 gap-2">
                         {Object.keys(SUPERVISION_DEFINITIONS).map(type => (
                           <div key={type} className="flex items-center space-x-2">
                             <RadioGroupItem value={type} id={`new-${type}`} className="h-3 w-3" />
                             <Label htmlFor={`new-${type}`} className="text-xs font-normal text-muted-foreground">{type}</Label>
                           </div>
                         ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Filters Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-white">Features</Label>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-mat" className="h-3 w-3" />
                         <Label htmlFor="new-mat" className="text-xs font-normal text-muted-foreground">MAT Friendly</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-pet" className="h-3 w-3" />
                         <Label htmlFor="new-pet" className="text-xs font-normal text-muted-foreground">Pet Friendly</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Checkbox id="new-insurance" className="h-3 w-3" />
                         <Label htmlFor="new-insurance" className="text-xs font-normal text-muted-foreground">Accepts Insurance</Label>
                       </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Tenant Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((conv) => (
                      <div key={conv.propertyId} className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer" onClick={() => setLocation(`/chat/${conv.propertyId}`)}>
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                          <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white text-lg">{conv.propertyName}</h4>
                              <p className="text-sm text-muted-foreground">{conv.tenantName}</p>
                              <p className="text-xs text-muted-foreground mt-1">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-white">{conv.unreadCount} new</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last message {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No active conversations yet. Tenants will start chatting when they're interested!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPLICATIONS & INBOX TAB */}
          <TabsContent value="inbox">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Applications & Inbox</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
                  onClick={() => window.open('/apply/preview', '_blank')}
                >
                  <Eye className="w-4 h-4" /> Preview Application
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                   <div className="p-0 overflow-hidden rounded-md border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-muted-foreground border-b border-border">
                        <tr>
                          <th className="p-4 font-medium">Applicant</th>
                          <th className="p-4 font-medium">Property</th>
                          <th className="p-4 font-medium">Date</th>
                          <th className="p-4 font-medium">Risk Factors</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{app.applicantName}</td>
                            <td className="p-4 text-gray-300">{app.property}</td>
                            <td className="p-4 text-muted-foreground">{app.submittedDate}</td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                {app.probation && <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">Legal</Badge>}
                                {app.evictionHistory && <Badge variant="outline" className="text-red-500 border-red-500/30 text-[10px]">Eviction</Badge>}
                                {app.matStatus && <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-[10px]">MAT</Badge>}
                                {!app.probation && !app.evictionHistory && !app.matStatus && <span className="text-muted-foreground text-xs">-</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={app.status === "New" ? "default" : app.status === "Approved" ? "secondary" : app.status === "Denied" ? "destructive" : "outline"}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => handleViewApplication(app)}>Review</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BED MANAGER TAB */}
          <TabsContent value="beds" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {listings.length === 0 ? (
                <Card className="bg-card border-border col-span-4">
                  <CardContent className="p-8 text-center">
                    <Bed className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Properties to Manage</h3>
                    <p className="text-muted-foreground mb-4">Add properties to start managing bed availability</p>
                    <Button onClick={() => setLocation("/create-listing")} className="bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" /> Add Property
                    </Button>
                  </CardContent>
                </Card>
              ) : listings.map((property) => {
                const currentAvailable = bedsAvailable[property.id] ?? property.totalBeds;
                const occupancy = property.totalBeds > 0 ? ((property.totalBeds - currentAvailable) / property.totalBeds) * 100 : 0;
                return (
                  <Card key={property.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{property.propertyName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Occupancy</span>
                          <span>{Math.round(occupancy)}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Available Beds</p>
                          <p className="text-3xl font-bold text-primary">{currentAvailable}</p>
                          <p className="text-xs text-muted-foreground">of {property.totalBeds}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (currentAvailable > 0) {
                                setBedsAvailable(prev => ({
                                  ...prev,
                                  [property.id]: currentAvailable - 1
                                }));
                              }
                            }}
                            data-testid={`button-decrease-beds-${property.id}`}
                          >
                            -
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (currentAvailable < property.totalBeds) {
                                setBedsAvailable(prev => ({
                                  ...prev,
                                  [property.id]: currentAvailable + 1
                                }));
                              }
                            }}
                            data-testid={`button-increase-beds-${property.id}`}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* MARKETING & SEO TAB */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> SEO & Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Your listings are automatically optimized for search engines.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">SEO-Optimized Pages</h4>
                          <p className="text-xs text-muted-foreground mt-1">Your listings appear on SEO-optimized pages targeting search terms like "sober living homes" and "recovery housing".</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded text-primary">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Location-Based Search</h4>
                          <p className="text-xs text-muted-foreground mt-1">Tenants can search and filter by city and state to find your listings in their area.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs text-emerald-400 font-medium">SEO features are included with your subscription</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Boost Your Listings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Get premium placement and reach more potential tenants.</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-500/20 p-2 rounded text-purple-400">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Featured Placement</h4>
                          <p className="text-xs text-muted-foreground mt-1">Boosted listings appear at the top of search results with a special badge.</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-500/20 p-2 rounded text-purple-400">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Increased Visibility</h4>
                          <p className="text-xs text-muted-foreground mt-1">Get 2x, 3x, or 5x more views on your listings.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Starting at $100/month. Scroll down to boost a listing.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Marketing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">2,847</div>
                    <p className="text-xs text-muted-foreground">Total Views This Month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">342</div>
                    <p className="text-xs text-muted-foreground">New Clicks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">24</div>
                    <p className="text-xs text-muted-foreground">Applications Generated</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-1">8.4%</div>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Listings - Boost Your Properties */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" /> Featured Listings - Boost Your Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get your listings seen by more potential tenants. Featured listings appear at the top of search results with a special badge.
                </p>
                
                {/* Verification Required Notice */}
                {!isDocumentsVerified && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500/20 p-2 rounded text-amber-500">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-400 text-sm">Verification Required</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your documents must be verified by our team before you can purchase featured listings. 
                          Please submit your business license and other required documents for review.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => setLocation("/provider-profile")}
                          data-testid="button-submit-verification"
                        >
                          Go to Profile & Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Active Featured Listings */}
                {featuredListings.filter(f => f.isActive && new Date(f.endDate) > new Date()).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white">Active Boosts</h4>
                    {featuredListings.filter(f => f.isActive && new Date(f.endDate) > new Date()).map((featured) => {
                      const listing = listings.find(l => l.id === featured.listingId);
                      const daysLeft = Math.ceil((new Date(featured.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={featured.id} className="p-3 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">{listing?.propertyName || 'Unknown Listing'}</p>
                            <p className="text-xs text-muted-foreground">{featured.boostLevel}x visibility • {daysLeft} days remaining</p>
                          </div>
                          <Badge className="bg-purple-500/80">{featured.boostLevel}x Boost</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Listings Available to Boost - Only show if verified */}
                {isDocumentsVerified && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white">Boost a Listing</h4>
                    {listings.filter(l => l.status === 'approved' && !isListingFeatured(l.id)).length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        {listings.filter(l => l.status === 'approved').length === 0 
                          ? "No approved listings available to boost. Get your listings approved first."
                          : "All your listings are already boosted!"}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {listings.filter(l => l.status === 'approved' && !isListingFeatured(l.id)).map((listing) => (
                          <div key={listing.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">{listing.propertyName}</p>
                              <p className="text-xs text-muted-foreground">{listing.city}, {listing.state}</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-purple-500 hover:bg-purple-600 text-white gap-1"
                              onClick={() => {
                                setSelectedListingToBoost(listing);
                                setBoostLevel(2);
                                setBoostDuration(7);
                                setShowBoostModal(true);
                              }}
                              data-testid={`button-boost-listing-${listing.id}`}
                            >
                              <Zap className="w-3 h-3" /> Boost
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Pricing Info */}
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-medium text-purple-300 mb-2">Boost Pricing (Monthly)</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-white font-bold">2x Visibility</p>
                      <p className="text-muted-foreground">$100/month</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">3x Visibility</p>
                      <p className="text-muted-foreground">$150/month</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">5x Visibility</p>
                      <p className="text-muted-foreground">$200/month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How Marketing Works */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-500" /> How Marketing Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sober Stay automatically helps you reach more potential tenants through our built-in marketing features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-medium text-white text-sm">Automatic Notifications</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tenants receive automatic email notifications when they apply, get approved, or are denied.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-medium text-white text-sm">SEO Optimized Listings</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your listings are automatically optimized for search engines to help tenants find you.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-medium text-white text-sm">Featured Placement</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Boost your listings for premium placement at the top of search results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DIGITAL RESIDENT FILES TAB */}
          <TabsContent value="files" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><FileArchive className="w-5 h-5 text-primary" /> Digital Resident Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">Securely store and manage all resident documents in one place. All files are encrypted and compliant with privacy regulations.</p>
                
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Upload New Files</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload applications, background checks, references, and more.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Recent Resident Files</h3>
                  {[
                    { name: "John Doe - Application + Background Check", size: "2.4 MB", date: "Today" },
                    { name: "Sarah Jones - Reference Letters", size: "1.1 MB", date: "Yesterday" },
                    { name: "Michael Smith - Employment Verification", size: "0.8 MB", date: "2 days ago" },
                    { name: "Emma Wilson - Financial Records", size: "3.2 MB", date: "1 week ago" },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary hover:bg-primary/10"
                          onClick={() => window.open(`data:text/plain;base64,${btoa(file.name)}`, '_blank')}
                          data-testid={`button-view-file-${i}`}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:bg-white/10"
                          onClick={() => {
                            const element = document.createElement("a");
                            element.setAttribute("href", `data:text/plain;base64,${btoa(file.name)}`);
                            element.setAttribute("download", file.name);
                            element.style.display = "none";
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          data-testid={`button-download-file-${i}`}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy & Security</h4>
                  <ul className="text-sm text-emerald-100/80 space-y-1">
                    <li>✓ All files encrypted at rest and in transit</li>
                    <li>✓ HIPAA-compliant storage</li>
                    <li>✓ Audit logs for all file access</li>
                    <li>✓ Automatic backup and recovery</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VERIFICATION TAB */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Verification Status</CardTitle>
                  <Badge className="bg-amber-500/80">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground">Submit the following documents to get verified on Sober Stay and unlock featured listing benefits.</p>
                  
                  <div className="space-y-3">
                    {[
                      { key: "businessLicense", name: "Business License", icon: "📄" },
                      { key: "insuranceCert", name: "Insurance Certificate", icon: "📋" },
                      { key: "propertyPhotos", name: "Property Photos", icon: "📸" },
                      { key: "safetyCerts", name: "Safety Certifications", icon: "✓" }
                    ].map((doc) => {
                      const isUploaded = verificationDocs[doc.key];
                      return (
                        <div key={doc.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{doc.icon}</span>
                            <div>
                              <p className="text-white font-medium">{doc.name}</p>
                              <p className={`text-xs ${isUploaded ? 'text-primary' : 'text-muted-foreground'}`}>
                                {isUploaded ? '✓ Uploaded' : 'Pending'}
                              </p>
                            </div>
                          </div>
                          <div className="relative">
                            <input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const newDocs = { ...verificationDocs, [doc.key]: true };
                                  setVerificationDocs(newDocs);
                                  localStorage.setItem("provider_verification_docs", JSON.stringify(newDocs));
                                }
                              }}
                              data-testid={`input-upload-${doc.key}`}
                            />
                            <Button size="sm" className="gap-2" variant={isUploaded ? "outline" : "default"}>
                              <Upload className="w-4 h-4" /> {isUploaded ? "Update" : "Upload"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold text-white mb-3">Verification Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Featured listing placement</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Verified badge on all properties</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Priority support</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary" /> Higher tenant trust</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Email Address</Label>
                    <Input 
                      placeholder="provider@example.com" 
                      className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" 
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      data-testid="input-settings-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Phone Number</Label>
                    <Input 
                      placeholder="+1 (555) 000-0000" 
                      className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      data-testid="input-settings-phone"
                    />
                  </div>
                  <Button 
                    className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                    onClick={handleUpdateSettings}
                    disabled={settingsLoading}
                    data-testid="button-update-settings"
                  >
                    {settingsLoading ? "Saving..." : "Update Information"}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <ToggleRight className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-white font-medium text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                      </div>
                    </div>
                    {twoFactorEnabled ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/80 text-white">Enabled</Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs text-red-400 border-red-400/50 hover:bg-red-500/10"
                          onClick={handleDisable2FA}
                          disabled={twoFactorLoading}
                          data-testid="button-disable-2fa"
                        >
                          Disable
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/80"
                        onClick={handleSetup2FA}
                        disabled={twoFactorLoading}
                        data-testid="button-enable-2fa"
                      >
                        {twoFactorLoading ? "Loading..." : "Enable"}
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Change Password</Label>
                    <Input type="password" placeholder="Current password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Input type="password" placeholder="New password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Input type="password" placeholder="Confirm password" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" />
                    <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notifications are sent to your registered email address and appear in your dashboard inbox.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: "newInquiries", label: "New tenant inquiries", desc: "Email + dashboard notification when tenants message you" },
                      { key: "applicationUpdates", label: "Application updates", desc: "Email alert when tenants submit or update applications" },
                      { key: "marketingEmails", label: "Marketing emails", desc: "Email updates about new features and platform news" },
                      { key: "securityAlerts", label: "Security alerts", desc: "Email notifications for login attempts and account changes" }
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                        <div>
                          <p className="text-white text-sm font-medium">{notif.label}</p>
                          <p className="text-xs text-muted-foreground">{notif.desc}</p>
                        </div>
                        <Checkbox 
                          className="h-5 w-5 border-primary/50" 
                          checked={notificationPrefs[notif.key as keyof typeof notificationPrefs]}
                          onCheckedChange={(checked) => {
                            const newPrefs = { ...notificationPrefs, [notif.key]: checked };
                            setNotificationPrefs(newPrefs);
                            localStorage.setItem("provider_notification_prefs", JSON.stringify(newPrefs));
                          }}
                          data-testid={`checkbox-notif-${notif.key}`}
                        />
                      </div>
                    ))}
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div>
                          <p className="text-white text-sm font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-400" /> SMS Text Notifications
                          </p>
                          <p className="text-xs text-muted-foreground">Receive text message alerts for new applications and urgent updates</p>
                          {settingsPhone && (
                            <p className="text-xs text-blue-400 mt-1">Messages will be sent to: {settingsPhone}</p>
                          )}
                        </div>
                        <Checkbox 
                          className="h-5 w-5 border-blue-500/50" 
                          checked={notificationPrefs.smsNotifications || false}
                          onCheckedChange={async (checked) => {
                            if (checked && !settingsPhone) {
                              alert("Please add a phone number in your profile settings to enable SMS notifications.");
                              return;
                            }
                            const newPrefs = { ...notificationPrefs, smsNotifications: checked };
                            setNotificationPrefs(newPrefs);
                            localStorage.setItem("provider_notification_prefs", JSON.stringify(newPrefs));
                            
                            try {
                              await fetch('/api/provider/profile', {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ smsOptIn: checked })
                              });
                            } catch (err) {
                              console.error("Failed to update SMS preference:", err);
                            }
                          }}
                          data-testid="checkbox-notif-sms"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        By enabling SMS, you agree to our <a href="/privacy-policy" className="text-blue-400 underline">SMS notification policy</a>. Standard message rates may apply.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TOUR REQUESTS */}
          <TabsContent value="tours" className="space-y-6">
            <h3 className="text-xl font-bold text-white">Tour Scheduling Requests</h3>
            {tourRequests.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tour requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tourRequests.map((tour) => (
                  <Card key={tour.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-white text-lg mb-2">{tour.propertyName}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 text-primary" />
                              {tour.tenantName} ({tour.tenantEmail})
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {tour.tourType === "virtual" ? (
                                <><Video className="w-4 h-4 text-primary" /> Virtual Tour</>
                              ) : (
                                <><MapPin className="w-4 h-4 text-primary" /> In-Person Tour</>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-primary" />
                              {new Date(tour.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              {tour.time}
                            </div>
                          </div>
                        </div>
                        <div className="md:text-right">
                          <Badge 
                            className={`mb-2 ${
                              tour.status === "approved" ? "bg-green-500/80" :
                              tour.status === "denied" ? "bg-red-500/80" :
                              tour.status === "rescheduled" ? "bg-amber-500/80" :
                              "bg-blue-500/80"
                            }`}
                          >
                            {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {tour.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                          <Button
                            onClick={() => handleTourResponse(tour.id, "approved")}
                            className="flex-1 bg-green-600/80 hover:bg-green-600 text-white gap-2"
                            data-testid={`button-approve-tour-${tour.id}`}
                          >
                            <Check className="w-4 h-4" /> Approve
                          </Button>
                          <Button
                            onClick={() => handleSuggestDifferentTime(tour.id)}
                            className="flex-1 bg-amber-600/80 hover:bg-amber-600 text-white gap-2"
                            data-testid={`button-reschedule-tour-${tour.id}`}
                          >
                            <Clock className="w-4 h-4" /> Suggest Different Time
                          </Button>
                          <Button
                            onClick={() => handleTourResponse(tour.id, "denied")}
                            variant="outline"
                            className="flex-1 border-red-500/50 hover:bg-red-500/10 gap-2"
                            data-testid={`button-deny-tour-${tour.id}`}
                          >
                            <X className="w-4 h-4" /> Deny
                          </Button>
                        </div>
                      )}

                      {tour.status === "approved" && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                          <Button
                            onClick={() => handleTourResponse(tour.id, "pending", undefined)}
                            variant="outline"
                            className="flex-1 border-amber-500/50 hover:bg-amber-500/10 gap-2"
                            data-testid={`button-unapprove-tour-${tour.id}`}
                          >
                            <RotateCcw className="w-4 h-4" /> Unapprove
                          </Button>
                          <Button
                            onClick={() => handleSuggestDifferentTime(tour.id)}
                            className="flex-1 bg-amber-600/80 hover:bg-amber-600 text-white gap-2"
                            data-testid={`button-reschedule-approved-tour-${tour.id}`}
                          >
                            <Clock className="w-4 h-4" /> Suggest Different Time
                          </Button>
                        </div>
                      )}

                      {tour.status === "rescheduled" && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                          <Button
                            onClick={() => handleTourResponse(tour.id, "approved")}
                            className="flex-1 bg-green-600/80 hover:bg-green-600 text-white gap-2"
                            data-testid={`button-approve-rescheduled-tour-${tour.id}`}
                          >
                            <Check className="w-4 h-4" /> Approve Original Time
                          </Button>
                          <Button
                            onClick={() => handleSuggestDifferentTime(tour.id)}
                            variant="outline"
                            className="flex-1 border-amber-500/50 hover:bg-amber-500/10 gap-2"
                            data-testid={`button-new-time-tour-${tour.id}`}
                          >
                            <Clock className="w-4 h-4" /> Suggest New Time
                          </Button>
                        </div>
                      )}
                      
                      {tour.providerNotes && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Your Response:</p>
                          <p className="text-sm text-gray-300">{tour.providerNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* BILLING TAB */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscriptionStatus?.subscriptionStatus === "active" ? (
                  <>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-full">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {subscriptionStatus.hasFeeWaiver ? "Fee Waiver Active" : "Active Subscription"}
                          </h3>
                          <p className="text-sm text-green-300">
                            {subscriptionStatus.hasFeeWaiver 
                              ? "Unlimited listings at no charge" 
                              : `$${subscriptionStatus.monthlyFee}/month per listing`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {subscriptionStatus.hasFeeWaiver 
                          ? "Your account has been granted a fee waiver by an administrator. You can create unlimited listings at no charge."
                          : "Your subscription is active. Each property listing is billed at $49/month."}
                      </p>
                    </div>

                    {!subscriptionStatus.hasFeeWaiver && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="bg-background/50 border-border">
                            <CardContent className="pt-6">
                              <h4 className="font-semibold text-white mb-2">Payment Method</h4>
                              <p className="text-sm text-muted-foreground mb-4">Update your credit card or payment method</p>
                              <Button
                                onClick={async () => {
                                  try {
                                    const res = await fetch('/api/stripe/portal', {
                                      method: 'POST',
                                      credentials: 'include'
                                    });
                                    const data = await res.json();
                                    if (data.url) {
                                      window.location.href = data.url;
                                    }
                                  } catch (err) {
                                    console.error("Error opening billing portal:", err);
                                  }
                                }}
                                className="w-full bg-primary hover:bg-primary/90"
                                data-testid="button-update-payment"
                              >
                                Update Payment Method
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="bg-background/50 border-border">
                            <CardContent className="pt-6">
                              <h4 className="font-semibold text-white mb-2">Billing History</h4>
                              <p className="text-sm text-muted-foreground mb-4">View invoices and past payments</p>
                              <Button
                                onClick={async () => {
                                  try {
                                    const res = await fetch('/api/stripe/portal', {
                                      method: 'POST',
                                      credentials: 'include'
                                    });
                                    const data = await res.json();
                                    if (data.url) {
                                      window.location.href = data.url;
                                    }
                                  } catch (err) {
                                    console.error("Error opening billing portal:", err);
                                  }
                                }}
                                variant="outline"
                                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                                data-testid="button-view-invoices"
                              >
                                View Invoices
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        <Card className="bg-background/50 border-border">
                          <CardContent className="pt-6">
                            <h4 className="font-semibold text-white mb-2">Manage Subscription</h4>
                            <p className="text-sm text-muted-foreground mb-4">Change your plan, update billing details, or cancel your subscription</p>
                            <Button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/stripe/portal', {
                                    method: 'POST',
                                    credentials: 'include'
                                  });
                                  const data = await res.json();
                                  if (data.url) {
                                    window.location.href = data.url;
                                  }
                                } catch (err) {
                                  console.error("Error opening billing portal:", err);
                                }
                              }}
                              variant="outline"
                              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                              data-testid="button-manage-subscription"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Manage Subscription
                            </Button>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg inline-block mb-4">
                      <CreditCard className="w-12 h-12 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Subscribe to list your properties on Sober Stay Homes and connect with tenants looking for recovery housing.
                    </p>
                    <Button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-primary hover:bg-primary/90 gap-2"
                      data-testid="button-subscribe-now"
                    >
                      <CreditCard className="w-4 h-4" />
                      Subscribe Now - $49/month per listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ApplicationDetailsModal 
          open={isAppDetailsOpen}
          onClose={() => setIsAppDetailsOpen(false)}
          application={selectedApplication}
          onApprove={handleApproveApplication}
          onDeny={handleDenyApplication}
        />

        {/* Boost Listing Modal */}
        {showBoostModal && selectedListingToBoost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-purple-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/5 border-b border-purple-500/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" /> Boost Your Listing
                </h2>
                <p className="text-xs text-muted-foreground mt-1">{selectedListingToBoost.propertyName}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-white mb-2 block">Visibility Boost Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setBoostLevel(level)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          boostLevel === level 
                            ? 'bg-purple-500/20 border-purple-500 text-white' 
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:border-purple-500/50'
                        }`}
                        data-testid={`button-boost-level-${level}`}
                      >
                        <p className="text-lg font-bold">{level}x</p>
                        <p className="text-xs">${level === 5 ? 200 : level === 3 ? 150 : 100}/mo</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-white mb-2 block">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[7, 14, 30].map((days) => (
                      <button
                        key={days}
                        onClick={() => setBoostDuration(days)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          boostDuration === days 
                            ? 'bg-purple-500/20 border-purple-500 text-white' 
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:border-purple-500/50'
                        }`}
                        data-testid={`button-boost-duration-${days}`}
                      >
                        <p className="text-lg font-bold">{days}</p>
                        <p className="text-xs">days</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Monthly Cost</span>
                    <span className="text-2xl font-bold text-purple-400">${getBoostPrice()}/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {boostLevel}x visibility boost for your listing
                  </p>
                </div>
              </div>
              <div className="bg-background border-t border-purple-500/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={handleBoostListing}
                  disabled={isBoostLoading}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white gap-2"
                  data-testid="button-confirm-boost"
                >
                  {isBoostLoading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Boost Now - ${getBoostPrice()}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    setShowBoostModal(false);
                    setSelectedListingToBoost(null);
                  }} 
                  variant="outline"
                  data-testid="button-cancel-boost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Setup Modal */}
        {show2FASetupModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Set Up Two-Factor Authentication</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShow2FASetupModal(false);
                    setTwoFactorToken("");
                    setTwoFactorError("");
                    setSmsSent(false);
                    setTwoFactorMethod("app");
                  }}
                  data-testid="button-close-2fa-modal"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={twoFactorMethod === "app" ? "default" : "outline"}
                    className={twoFactorMethod === "app" ? "bg-primary" : ""}
                    onClick={() => setTwoFactorMethod("app")}
                    data-testid="button-2fa-method-app"
                  >
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Authenticator App
                  </Button>
                  <Button
                    variant={twoFactorMethod === "sms" ? "default" : "outline"}
                    className={twoFactorMethod === "sms" ? "bg-primary" : ""}
                    onClick={() => setTwoFactorMethod("sms")}
                    data-testid="button-2fa-method-sms"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Text Message (SMS)
                  </Button>
                </div>

                {twoFactorMethod === "app" ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
                    </p>
                    
                    {twoFactorQRCode && (
                      <div className="flex justify-center p-4 bg-white rounded-lg">
                        <img src={twoFactorQRCode} alt="2FA QR Code" className="w-48 h-48" data-testid="img-2fa-qrcode" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Or enter this code manually:</p>
                      <code className="text-sm bg-background px-2 py-1 rounded font-mono text-primary" data-testid="text-2fa-secret">
                        {twoFactorSecret}
                      </code>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Enter the 6-digit code from your app:</Label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={twoFactorToken}
                        onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                        className="bg-background/60 border-2 border-primary/40 text-center text-xl tracking-widest font-mono"
                        data-testid="input-2fa-token"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      We'll send a verification code to your mobile phone via text message.
                    </p>
                    
                    {!smsSent ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Mobile Phone Number</Label>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={smsPhoneNumber}
                            onChange={(e) => setSmsPhoneNumber(e.target.value)}
                            className="bg-background/60 border-2 border-primary/40"
                            data-testid="input-2fa-phone"
                          />
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-primary/80"
                          onClick={async () => {
                            if (smsPhoneNumber.length >= 10) {
                              setTwoFactorLoading(true);
                              setTwoFactorError("");
                              try {
                                const res = await fetch('/api/provider/2fa/sms/send', {
                                  method: 'POST',
                                  credentials: 'include',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ phone: smsPhoneNumber })
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  setSmsSent(true);
                                } else {
                                  setTwoFactorError(data.error || "Failed to send code");
                                }
                              } catch (err) {
                                setTwoFactorError("Failed to send verification code");
                              } finally {
                                setTwoFactorLoading(false);
                              }
                            } else {
                              setTwoFactorError("Please enter a valid phone number");
                            }
                          }}
                          disabled={smsPhoneNumber.length < 10 || twoFactorLoading}
                          data-testid="button-send-sms-code"
                        >
                          {twoFactorLoading ? "Sending..." : "Send Verification Code"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-center">
                          <p className="text-sm text-primary">Code sent to {smsPhoneNumber}</p>
                          <button 
                            className="text-xs text-muted-foreground underline mt-1"
                            onClick={() => setSmsSent(false)}
                          >
                            Change number
                          </button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Enter the 6-digit code:</Label>
                          <Input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={twoFactorToken}
                            onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                            className="bg-background/60 border-2 border-primary/40 text-center text-xl tracking-widest font-mono"
                            data-testid="input-2fa-sms-token"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {twoFactorError && (
                  <p className="text-sm text-red-400 text-center" data-testid="text-2fa-error">{twoFactorError}</p>
                )}
                
                {(twoFactorMethod === "app" || smsSent) && (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/80"
                    onClick={twoFactorMethod === "sms" ? async () => {
                      setTwoFactorLoading(true);
                      setTwoFactorError("");
                      try {
                        const res = await fetch('/api/provider/2fa/sms/verify', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ token: twoFactorToken })
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setShow2FASetupModal(false);
                          setTwoFactorToken("");
                          setSmsSent(false);
                          alert("Two-factor authentication enabled successfully!");
                        } else {
                          setTwoFactorError(data.error || "Failed to verify code");
                        }
                      } catch (err) {
                        setTwoFactorError("Failed to verify code");
                      } finally {
                        setTwoFactorLoading(false);
                      }
                    } : handleVerify2FA}
                    disabled={twoFactorLoading || twoFactorToken.length !== 6}
                    data-testid="button-verify-2fa"
                  >
                    {twoFactorLoading ? "Verifying..." : "Verify and Enable 2FA"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">Suggest Different Time</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Propose an alternative date and time for this tour.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="suggested-date" className="text-white">Suggested Date</Label>
                <Input
                  id="suggested-date"
                  type="date"
                  value={suggestedDate}
                  onChange={(e) => setSuggestedDate(e.target.value)}
                  className="bg-background border-border text-white"
                  data-testid="input-suggested-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suggested-time" className="text-white">Suggested Time</Label>
                <Input
                  id="suggested-time"
                  type="time"
                  value={suggestedTime}
                  onChange={(e) => setSuggestedTime(e.target.value)}
                  className="bg-background border-border text-white"
                  data-testid="input-suggested-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reschedule-notes" className="text-white">Additional Notes (optional)</Label>
                <Input
                  id="reschedule-notes"
                  placeholder="E.g., I have availability in the mornings..."
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="bg-background border-border text-white"
                  data-testid="input-reschedule-notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
                className="border-border"
                data-testid="button-cancel-reschedule"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReschedule}
                disabled={!suggestedDate || !suggestedTime}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-confirm-reschedule"
              >
                Send Suggestion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PaymentModal 
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            try {
              const res = await fetch('/api/stripe/subscription', { credentials: 'include' });
              if (res.ok) {
                const data = await res.json();
                if (data.subscription && (data.subscription.status === 'active' || data.subscription.status === 'trialing')) {
                  setHasActiveSubscription(true);
                  setSubscriptionStatus({
                    subscriptionStatus: 'active',
                    monthlyFee: data.subscription.hasFeeWaiver ? 0 : 49,
                    stripeSubscriptionId: data.subscription.id,
                    hasFeeWaiver: data.subscription.hasFeeWaiver || false
                  });
                }
              }
            } catch (err) {
              console.error("Error refreshing subscription status:", err);
            }
          }}
          providerId={String(user?.id || "")}
        />
      </div>
    </Layout>
  );
}

export function ProviderDashboard() {
  return <ProviderDashboardWrapper />;
}
