import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { saveAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSession = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          saveAuth({
            id: String(user.id),
            email: user.email,
            role: user.role,
            name: user.name || user.username || user.email,
          });

          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect") || "/";
          setLocation(redirect);
        } else {
          setError("Authentication failed. Please try again.");
          setTimeout(() => setLocation("/login"), 2000);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setTimeout(() => setLocation("/login"), 2000);
      }
    };

    syncSession();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}
