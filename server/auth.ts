import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "replit_session_secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: app.get("env") === "production",
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables. Google OAuth will not work.");
  } else {
    // Get the domain for the callback URL
    const domain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS || "http://localhost:5000";
    const callbackURL = domain.startsWith("http") 
      ? `${domain}/api/auth/google/callback`
      : `https://${domain}/api/auth/google/callback`;

    passport.use(
      new GoogleStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(null, false, { message: "no-email" });
            }

            // First, check if user already has Google linked
            let user = await storage.getUserByGoogleId(googleId);

            if (user) {
              // User already has Google linked, sign them in
              return done(null, user);
            }

            // Check if user exists by email (registered but not linked to Google yet)
            user = await storage.getUserByEmail(email);

            if (user) {
              // Link their Google account to existing user
              await storage.updateUser(user.id, { googleId });
              user.googleId = googleId;
              return done(null, user);
            }

            // No account exists - reject authentication
            // User must register first before using Google sign-in
            return done(null, false, { message: "no-account" });
          } catch (err) {
            return done(err as Error);
          }
        }
      )
    );
  }

  app.get("/api/auth/google", (req, res, next) => {
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      prompt: "select_account"  // Always show account selection
    })(req, res, next);
  });

  app.get(
    "/api/auth/google/callback",
    (req, res, next) => {
      passport.authenticate("google", (err: Error | null, user: User | false, info: { message?: string } | undefined) => {
        if (err) {
          console.error("OAuth error:", err);
          return res.redirect("/login?error=oauth-failed");
        }
        
        if (!user) {
          // Authentication failed - user doesn't have an account
          const errorType = info?.message || "no-account";
          return res.redirect(`/login?error=${errorType}`);
        }
        
        // Log the user in
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("/login?error=login-failed");
          }
          // Redirect to auth callback page to sync session with client-side localStorage
          res.redirect("/auth/callback");
        });
      })(req, res, next);
    }
  );
  
  app.post("/api/user/role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { role } = req.body;
    const user = req.user as User;
    
    // Security: Only allow role changes under specific conditions
    // - Tenants can switch to provider (for listing properties)
    // - Providers can switch to tenant (for seeking housing)
    // - Admin role can ONLY be set via ADMIN_EMAIL env var during OAuth, never via API
    if (!role || !["tenant", "provider"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Only tenant or provider roles are allowed." });
    }
    
    // Prevent admins from losing their admin status
    if (user.role === "admin") {
      return res.status(403).json({ error: "Admin role cannot be changed" });
    }
    
    const updated = await storage.updateUser(user.id, { role });
    
    if (updated) {
      // Refresh the session with updated user data
      req.login(updated, (err) => {
        if (err) {
          console.error("Session refresh error:", err);
        }
        res.json(updated);
      });
    } else {
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  app.get("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}
