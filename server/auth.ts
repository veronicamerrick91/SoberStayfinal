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
            } else if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL && user.role !== "admin") {
              // Upgrade existing user to admin if they match the admin email
              // We need a way to update user, but for now we'll rely on manual DB update or initial creation
              // Adding a TODO for future: implement updateUser(id, { role: 'admin' })
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
    // Store the intended role in the session if passed as query param
    if (req.query.role) {
      // @ts-ignore
      req.session.role = req.query.role;
    }
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect to auth callback page to sync session
      // @ts-ignore
      const role = req.session.role || req.user?.role || "tenant";
      // Determine redirect path based on role
      let redirectPath = "/tenant-dashboard";
      if (role === "provider") {
        redirectPath = "/provider-dashboard";
      } else if (role === "admin") {
        redirectPath = "/admin-dashboard";
      }
      // Redirect to auth callback page which will sync localStorage and then redirect
      res.redirect(`/auth/callback?redirect=${encodeURIComponent(redirectPath)}`);
    }
  );

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
