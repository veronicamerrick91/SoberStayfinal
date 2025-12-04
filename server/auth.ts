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
            const name = profile.displayName;

            if (!email) {
              return done(new Error("No email found in Google profile"));
            }

            let user = await storage.getUserByGoogleId(googleId);

            if (!user) {
              // Check if user exists by email to link account
              // For now, just create a new user
              // We need a username. We'll use the email prefix or random string
              const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
              
              // Determine role - check if this is the admin email
              let role = "tenant";
              if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
                role = "admin";
              }
              
              // Generate a random password for OAuth users (they won't use it)
              const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
              
              user = await storage.createUser({
                username,
                email,
                name,
                password: randomPassword,
                googleId,
                role, 
              });
            }

            return done(null, user);
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
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Redirect to auth callback page to sync session with client-side localStorage
      res.redirect("/auth/callback?redirect=" + encodeURIComponent("/tenant-dashboard"));
    }
  );
  
  app.post("/api/user/role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { role } = req.body;
    if (!role || !["tenant", "provider", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    const user = req.user as any;
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
