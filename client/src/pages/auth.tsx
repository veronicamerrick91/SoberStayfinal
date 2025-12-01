import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { saveAuth } from "@/lib/auth";

interface AuthPageProps {
  type: "login" | "signup";
  defaultRole?: "tenant" | "provider";
}

export function AuthPage({ type, defaultRole = "tenant" }: AuthPageProps) {
  const [location, setLocation] = useLocation();
  const [role, setRole] = useState<"tenant" | "provider">(defaultRole);
  const [email, setEmail] = useState("");

  const getReturnPath = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("returnPath") || (role === "tenant" ? "/tenant-dashboard" : "/provider-dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - save session to localStorage
    saveAuth({
      id: Math.random().toString(36).substr(2, 9),
      email: email || "user@example.com",
      role: role,
      name: role === "tenant" ? "Applicant" : "Provider"
    });
    // Redirect to return path or dashboard
    setLocation(getReturnPath());
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
            <Tabs defaultValue={role} onValueChange={(v) => setRole(v as any)} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-background/50">
                <TabsTrigger value="tenant">I'm a Tenant</TabsTrigger>
                <TabsTrigger value="provider">I'm a Provider</TabsTrigger>
              </TabsList>
            </Tabs>

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
                <Input id="password" type="password" className="bg-background/50" />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {type === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {type === "login" ? "Don't have an account? " : "Already have an account? "}
              <Link href={type === "login" ? "/signup" : "/login"}>
                <a className="text-primary hover:underline font-semibold">
                  {type === "login" ? "Sign up" : "Log in"}
                </a>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
