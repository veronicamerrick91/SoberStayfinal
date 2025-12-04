import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, Mail, CheckCircle2, Sparkles, Building } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { saveAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const VALID_CREDENTIALS = {
  tenant: {
    email: "contact@soberstay.com",
    password: "contact@soberstay.com"
  },
  provider: {
    email: "contact@soberstay.com",
    password: "contact@soberstay.com"
  },
  admin: {
    email: "contact@soberstay.com",
    password: "contact@soberstay.com"
  }
};

interface AuthPageProps {
  type: "login" | "signup";
  defaultRole?: "tenant" | "provider" | "admin";
}

export function AuthPage({ type, defaultRole = "tenant" }: AuthPageProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [role, setRole] = useState<"tenant" | "provider" | "admin">(defaultRole as any);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setRole(defaultRole as any);
  }, [defaultRole]);

  const getReturnPath = () => {
    const params = new URLSearchParams(window.location.search);
    if (role === "admin") return "/admin-dashboard";
    return params.get("returnPath") || (role === "tenant" ? "/tenant-dashboard" : "/provider-dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const creds = VALID_CREDENTIALS[role as keyof typeof VALID_CREDENTIALS];
    
    if (type === "login") {
      // Validate credentials for login
      if (email !== creds.email || password !== creds.password) {
        setLoginError("Invalid email or password");
        return;
      }
    }
    
    // Save session and redirect
    saveAuth({
      id: Math.random().toString(36).substr(2, 9),
      email: email || creds.email,
      role: role,
      name: role === "tenant" ? "Test Tenant" : role === "provider" ? "Test Provider" : "Test Administrator"
    });
    setLocation(getReturnPath());
  };

  const handleGoogleLoginClick = () => {
    // Redirect to real Google OAuth endpoint with role
    window.location.href = `/api/auth/google?role=${role}`;
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-background">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Benefits Section - Only visible on desktop/large screens */}
          <div className="hidden lg:block space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              {role === "provider" ? <Building className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {role === "provider" ? "For Housing Providers" : "For Recovery Seekers"}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {role === "provider" 
                ? "Grow Your Community With Confidence" 
                : "Find Your Safe Haven Today"}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {role === "provider"
                ? "Join the largest network of verified sober living homes. Streamline your admissions and connect with qualified residents."
                : "Connect with supportive environments that understand your journey. We make finding recovery housing simple and secure."}
            </p>

            <div className="space-y-4">
              {(role === "provider" ? [
                "Fill vacancies faster with qualified applicants",
                "Streamlined application management tools",
                "Digital resident files and document storage",
                "Secure messaging and tour scheduling"
              ] : [
                "Browse hundreds of verified sober living homes",
                "One application for multiple listings",
                "Chat directly with housing providers",
                "Secure your spot with online payments"
              ]).map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-lg text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full max-w-md bg-card border-border shadow-2xl mx-auto lg:mx-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/20 p-3 rounded-lg w-fit mb-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {type === "login" 
                ? "Enter your credentials to access your account" 
                : "Join our community of safe, supportive homes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full mb-6">
              <TabsList className={`grid w-full ${type === "login" ? "grid-cols-3" : "grid-cols-2"} bg-background/50`}>
                <TabsTrigger value="tenant">I'm a Tenant</TabsTrigger>
                <TabsTrigger value="provider">I'm a Provider</TabsTrigger>
                {type === "login" && <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>}
              </TabsList>
            </Tabs>

            
            {/* Admin login removed for security - use Google Auth or real credentials */}
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{loginError}</p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              {type === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" className="bg-background/50" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" className="bg-background/50" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="bg-background/50" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {type === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {(role === "tenant" || role === "provider" || role === "admin") && (
              <div className="mt-4">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button 
                  type="button"
                  onClick={handleGoogleLoginClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 gap-2 border-0 shadow-lg shadow-blue-500/30 transition-all duration-200"
                  data-testid="button-google-signin"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {type === "login" ? "Continue with Google" : "Sign up with Google"}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {type === "login" ? "Don't have an account? " : "Already have an account? "}
              <Link href={type === "login" ? "/signup" : "/login"}>
                <span className="text-primary hover:underline font-semibold cursor-pointer">
                  {type === "login" ? "Sign up" : "Log in"}
                </span>
              </Link>
            </p>
          </CardFooter>
        </Card>
        </div>
      </div>
    </Layout>
  );
}
