import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/apply/:id" component={ApplicationForm} />
      <Route path="/tenant-dashboard" component={TenantDashboard} />
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/login">
        <AuthPage type="login" />
      </Route>
      <Route path="/signup">
        <AuthPage type="signup" />
      </Route>
      {/* For demo purposes, linking "For Tenants" to login/dashboard flow */}
      <Route path="/for-tenants">
        <AuthPage type="signup" defaultRole="tenant" />
      </Route>
      <Route path="/for-providers">
        <AuthPage type="signup" defaultRole="provider" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
