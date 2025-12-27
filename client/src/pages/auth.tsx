import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, Mail, CheckCircle2, Sparkles, Building, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { saveAuth, clearAuth, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";


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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [accountExists, setAccountExists] = useState(false);

  useEffect(() => {
    setRole(defaultRole as any);
  }, [defaultRole]);

  // Clear any stale auth state when landing on signup page
  useEffect(() => {
    if (type === "signup") {
      // Clear local storage auth to prevent confusion
      clearAuth();
    }
  }, [type]);


  const getReturnPath = (userRole: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnPath = urlParams.get('returnPath');
    if (returnPath && returnPath.startsWith('/')) {
      return returnPath;
    }
    if (userRole === "admin") return "/admin-dashboard";
    if (userRole === "provider") return "/provider-dashboard";
    return "/tenant-dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    
    try {
      if (type === "signup") {
        // Registration flow
        if (!firstName.trim() || !lastName.trim()) {
          setLoginError("Please enter your first and last name");
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || !password.trim()) {
          setLoginError("Please enter your email and password");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setLoginError("Password must be at least 6 characters");
          setIsSubmitting(false);
          return;
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            role: role === "admin" ? "tenant" : role, // Admins register as tenants
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Check if it's an "account exists" error
          if (data.error && data.error.toLowerCase().includes("already exists")) {
            setAccountExists(true);
            setLoginError("An account with this email already exists.");
          } else {
            setLoginError(data.error || "Registration failed");
          }
          setIsSubmitting(false);
          return;
        }

        // Registration successful - save auth and redirect
        saveAuth({
          id: String(data.user.id),
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
        });
        
        toast({
          title: "Account created!",
          description: "Welcome to Sober Stay. Your account has been created successfully.",
        });
        
        setLocation(getReturnPath(data.user.role));
      } else {
        // Login flow
        if (!email.trim() || !password.trim()) {
          setLoginError("Please enter your email and password");
          setIsSubmitting(false);
          return;
        }

        // If 2FA is required and we don't have a token yet, validate token
        if (requires2FA && !twoFactorToken.trim()) {
          setLoginError("Please enter your 2FA code");
          setIsSubmitting(false);
          return;
        }

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            email, 
            password, 
            rememberMe,
            ...(requires2FA && twoFactorToken ? { twoFactorToken } : {})
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          setLoginError(data.error || "Login failed");
          setIsSubmitting(false);
          return;
        }

        // Check if 2FA is required
        if (data.requires2FA) {
          setRequires2FA(true);
          setIsSubmitting(false);
          return;
        }

        // Check if user role matches the portal they're trying to log into
        const userRole = data.user.role;
        if (role !== userRole) {
          // Role mismatch - show appropriate error
          const portalName = role === "admin" ? "Admin" : role === "provider" ? "Provider" : "Tenant";
          const correctPortal = userRole === "admin" ? "Admin" : userRole === "provider" ? "Provider" : "Tenant";
          setLoginError(`This account is registered as a ${correctPortal}. Please use the ${correctPortal} portal to log in.`);
          // Log them out from the server session
          await fetch("/api/auth/logout", { credentials: "include" });
          setIsSubmitting(false);
          return;
        }

        // Login successful - save auth and redirect
        saveAuth({
          id: String(data.user.id),
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
        });
        
        setLocation(getReturnPath(data.user.role));
      }
    } catch (error) {
      console.error("Auth error:", error);
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-background relative">
        <button 
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setLocation("/");
            }
          }} 
          className="absolute top-6 left-4 md:left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
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
                ? "Join a growing network of sober living homes. Streamline your admissions and connect with qualified residents."
                : "Connect with supportive environments that understand your journey. We make finding recovery housing simple and secure."}
            </p>

            <div className="space-y-4">
              {(role === "provider" ? [
                "Fill vacancies faster with qualified applicants",
                "Streamlined application management tools",
                "Digital resident files and document storage",
                "Secure messaging and tour scheduling"
              ] : [
                "Browse sober living homes nationwide",
                "Secure applications, fast responses",
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
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p>{loginError}</p>
                  {accountExists && (
                    <Link href={`/auth/login/${role}`}>
                      <span className="text-primary hover:underline cursor-pointer font-medium">
                        Click here to log in instead →
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} method="POST" action="/api/auth/login" className="space-y-4">
              {type === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="username" placeholder="m@example.com" className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary" value={email} onChange={(e) => { setEmail(e.target.value); setAccountExists(false); setLoginError(""); }} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {type === "login" && (
                    <Link href="/forgot-password">
                      <span className="text-xs text-primary hover:underline cursor-pointer" data-testid="link-forgot-password">
                        Forgot Password?
                      </span>
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete="current-password" 
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary pr-10" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {type === "login" && !requires2FA && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-primary/40 bg-background/60 text-primary focus:ring-primary/50 cursor-pointer"
                    data-testid="checkbox-remember-me"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
              )}

              {requires2FA && (
                <div className="space-y-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Two-Factor Authentication Required</span>
                  </div>
                  <Label htmlFor="2fa-code" className="text-sm">
                    Enter the 6-digit code from your authenticator app
                  </Label>
                  <Input 
                    id="2fa-code" 
                    name="2fa-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary text-center text-lg tracking-widest" 
                    value={twoFactorToken} 
                    onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                    data-testid="input-2fa-code"
                    autoFocus
                  />
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {isSubmitting ? "Please wait..." : (type === "login" ? "Sign In" : "Create Account")}
              </Button>
            </form>

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
