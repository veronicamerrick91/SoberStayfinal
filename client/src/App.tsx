import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import { TenantDashboard } from "@/pages/tenant-dashboard";
import { ProviderDashboard } from "@/pages/provider-dashboard";
import { AdminDashboard } from "@/pages/admin-dashboard";
import { AuthPage } from "@/pages/auth";
import PropertyDetails from "@/pages/property-details";
import ApplicationForm from "@/pages/application-form";
import Chat from "@/pages/chat";
import { PrivacyPolicy } from "@/pages/privacy-policy";
import { TermsOfUse } from "@/pages/terms-of-use";
import { Disclaimer } from "@/pages/disclaimer";
import { LiabilityWaiver } from "@/pages/liability-waiver";
import { HelpCenter } from "@/pages/help-center";
import { CrisisResources } from "@/pages/crisis-resources";
import { SafetyReporting } from "@/pages/safety-reporting";
import { Blog } from "@/pages/blog";
import { Mission } from "@/pages/mission";
import { Resources } from "@/pages/resources";
import { Contact } from "@/pages/contact";
import { HowToChoose } from "@/pages/how-to-choose";
import { InsuranceInfo } from "@/pages/insurance-info";
import { RightsResponsibilities } from "@/pages/rights-responsibilities";
import { CreateListing } from "@/pages/create-listing";
import { ProviderSupport } from "@/pages/provider-support";
import { AuthCallback } from "@/pages/auth-callback";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { ResetPasswordPage } from "@/pages/reset-password";
import Quiz from "@/pages/quiz";
import { Analytics } from "@/pages/analytics";
import { SEOTools } from "@/pages/seo-tools";
import { TenantProfile } from "@/pages/tenant-profile";
import { ProviderProfilePage } from "@/pages/provider-profile";
import { SoberLivingNearMe } from "@/pages/sober-living-near-me";
import { WhatIsSoberLiving } from "@/pages/what-is-sober-living";
import { ApplyForSoberLiving } from "@/pages/apply-for-sober-living";
import { SoberLivingCalifornia } from "@/pages/sober-living-california";
import { LocationLanding } from "@/pages/location-landing";
import { SoberLivingLocation } from "@/pages/sober-living-location";
import { ForProviders } from "@/pages/for-providers";
import { ResourceCenter } from "@/pages/resource-center";
import { BlogHub } from "@/pages/blog-hub";
import { PartnersDirectory } from "@/pages/partners-directory";
import { LinkToUs } from "@/pages/link-to-us";
import { useEffect, useState } from "react";
import { isAuthenticated, getAuth } from "./lib/auth";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function SessionRestorer() {
  const [location, setLocation] = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user has valid session on app load
    const user = getAuth();
    if (user && !isAuthenticated()) {
      // Session data corrupted, redirect to login
      setLocation("/login");
    }
    setIsReady(true);
  }, [setLocation]);

  if (!isReady) return null;
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <SessionRestorer />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={Browse} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/property/:id" component={PropertyDetails} />
        <Route path="/apply/:id" component={ApplicationForm} />
        <Route path="/chat/:propertyId" component={Chat} />
        <Route path="/tenant-dashboard" component={TenantDashboard} />
        <Route path="/tenant-profile" component={TenantProfile} />
        <Route path="/provider-profile" component={ProviderProfilePage} />
        <Route path="/provider-dashboard" component={ProviderDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/login">
          <AuthPage type="login" />
        </Route>
        <Route path="/signup">
          <AuthPage type="signup" />
        </Route>
        <Route path="/for-tenants">
          <AuthPage type="signup" defaultRole="tenant" />
        </Route>
        <Route path="/for-providers" component={ForProviders} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/liability-waiver" component={LiabilityWaiver} />
        <Route path="/help-center" component={HelpCenter} />
        <Route path="/crisis-resources" component={CrisisResources} />
        <Route path="/safety-reporting" component={SafetyReporting} />
        <Route path="/blog" component={Blog} />
        <Route path="/mission" component={Mission} />
        <Route path="/resources" component={Resources} />
        <Route path="/how-to-choose" component={HowToChoose} />
        <Route path="/insurance-info" component={InsuranceInfo} />
        <Route path="/rights-responsibilities" component={RightsResponsibilities} />
        <Route path="/contact" component={Contact} />
        <Route path="/create-listing" component={CreateListing} />
        <Route path="/edit-listing/:id" component={CreateListing} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/seo-tools" component={SEOTools} />
        <Route path="/provider-support" component={ProviderSupport} />
        <Route path="/sober-living-near-me" component={SoberLivingNearMe} />
        <Route path="/what-is-sober-living" component={WhatIsSoberLiving} />
        <Route path="/apply-for-sober-living" component={ApplyForSoberLiving} />
        <Route path="/california-sober-living" component={SoberLivingCalifornia} />
        <Route path="/partners" component={PartnersDirectory} />
        <Route path="/link-to-us" component={LinkToUs} />
        <Route path="/resource-center" component={ResourceCenter} />
        <Route path="/sober-living/:slug" component={SoberLivingLocation} />
        <Route path="/:slug-sober-living" component={LocationLanding} />
        <Route path="/locations" component={LocationLanding} />
        <Route path="/blog/:slug" component={BlogHub} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
