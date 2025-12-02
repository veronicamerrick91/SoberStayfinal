import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { saveAuth } from "@/lib/auth";

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

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google?role=${role}`;
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-background">
        <Card className="w-full max-w-md bg-card border-border shadow-2xl">
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
                  onClick={handleGoogleLogin}
                  className="w-full bg-white text-black hover:bg-gray-100 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {type === "login" ? "Sign in with Gmail" : "Sign up with Gmail"}
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
    </Layout>
  );
}
