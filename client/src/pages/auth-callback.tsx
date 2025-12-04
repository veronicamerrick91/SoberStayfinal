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
          
          // Check if there's a pending role from OAuth
          const pendingRole = localStorage.getItem("pending_role");
          console.log("Auth callback - User role:", user.role, "Pending role:", pendingRole);
          let finalUser = user;
          
          if (pendingRole && pendingRole !== user.role) {
            console.log("Updating role to:", pendingRole);
            // Update user role via API
            const updateResponse = await fetch("/api/user/role", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: pendingRole })
            });
            
            console.log("Update response status:", updateResponse.status);
            if (updateResponse.ok) {
              finalUser = await updateResponse.json();
              console.log("Role updated successfully to:", finalUser.role);
            }
          }
          
          // Clear pending role
          localStorage.removeItem("pending_role");
          
          console.log("Saving auth with role:", finalUser.role);
          saveAuth({
            id: String(finalUser.id),
            email: finalUser.email,
            role: finalUser.role,
            name: finalUser.name || finalUser.username || finalUser.email,
          });

          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect") || (finalUser.role === "provider" ? "/provider-dashboard" : finalUser.role === "admin" ? "/admin-dashboard" : "/tenant-dashboard");
          console.log("Redirecting to:", redirect);
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
