import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { saveAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  defaultRole?: "tenant" | "provider" | "admin";
}

export function LoginModal({ open, onClose, onLogin, defaultRole = "tenant" }: LoginModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    name: "",
    role: defaultRole
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", loginData);
      const user = await response.json();
      
      saveAuth({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      });
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
      
      onLogin();
      onClose();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      const user = await response.json();
      
      saveAuth({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      });
      
      toast({
        title: "Account Created!",
        description: `Welcome to Sober Stay, ${user.name}`,
      });
      
      onLogin();
      onClose();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Welcome to Sober Stay</DialogTitle>
          <DialogDescription className="text-center">
            {tab === "login" ? "Sign in to your account" : "Create a new account"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Choose a username"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a password"
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={registerData.role === "tenant" ? "default" : "outline"}
                    onClick={() => setRegisterData(prev => ({ ...prev, role: "tenant" }))}
                    className="w-full"
                  >
                    Tenant
                  </Button>
                  <Button
                    type="button"
                    variant={registerData.role === "provider" ? "default" : "outline"}
                    onClick={() => setRegisterData(prev => ({ ...prev, role: "provider" }))}
                    className="w-full"
                  >
                    Provider
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
