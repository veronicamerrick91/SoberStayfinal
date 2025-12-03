import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, CheckCircle2, Sparkles, Building, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { saveAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRole(defaultRole as any);
  }, [defaultRole]);

  const getReturnPath = () => {
    const params = new URLSearchParams(window.location.search);
    if (role === "admin") return "/admin-dashboard";
    return params.get("returnPath") || (role === "tenant" ? "/tenant-dashboard" : "/provider-dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username: username || email.split("@")[0],
        password
      });
      const user = await response.json();
      
      saveAuth({
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      });
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
      
      setLocation(getReturnPath());
    } catch (error: any) {
      setLoginError(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        username: username || email.split("@")[0],
        email,
        password,
        name: name || "User",
        role
      });
      const user = await response.json();
      
      saveAuth({
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      });
      
      toast({
        title: "Account Created!",
        description: `Welcome to Sober Stay, ${user.name}`,
      });
      
      setLocation(getReturnPath());
    } catch (error: any) {
      setLoginError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
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
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{loginError}</p>
              </div>
            )}
            
            <form onSubmit={type === "login" ? handleLogin : handleSignup} className="space-y-4">
              {type === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="bg-background/50" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="johndoe" 
                      className="bg-background/50" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              
              {type === "login" && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="Enter your username" 
                    className="bg-background/50" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {type === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-background/50" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="bg-background/50" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {type === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  type === "login" ? "Sign In" : "Create Account"
                )}
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
