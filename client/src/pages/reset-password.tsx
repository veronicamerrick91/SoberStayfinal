import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { KeyRound, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";

export function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    
    if (!tokenParam) {
      setIsValidating(false);
      setError("No reset token provided");
      return;
    }

    setToken(tokenParam);
    validateToken(tokenParam);
  }, []);

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${tokenValue}`);
      const data = await response.json();
      
      setIsValid(data.valid);
      if (!data.valid) {
        setError(data.error || "Invalid or expired reset link");
      }
    } catch (err) {
      setError("Failed to validate reset link");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Validating your reset link...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isValid && !success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-red-500/20 p-3 rounded-lg w-fit mb-2">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Link Expired</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Password reset links expire after 30 minutes for security reasons. Please request a new one.
              </p>
              <Link href="/forgot-password">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request New Reset Link
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-6">
              <Link href="/login">
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                  Back to Login
                </span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-green-500/20 p-3 rounded-lg w-fit mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Password Reset!</CardTitle>
              <CardDescription>
                Your password has been successfully updated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center mb-4">
                You can now log in with your new password.
              </p>
              <Link href="/login">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-card border-border shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/20 p-3 rounded-lg w-fit mb-2">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Create New Password</CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                  required
                  minLength={6}
                  data-testid="input-new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary"
                  required
                  minLength={6}
                  data-testid="input-confirm-password"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long.
              </p>

              <Button 
                type="submit" 
                disabled={isSubmitting || !newPassword || !confirmPassword}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                data-testid="button-reset-password"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <Link href="/login">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                Back to Login
              </span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
