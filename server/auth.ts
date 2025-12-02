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

  passport.deserializeUser(async (id: string, done) => {
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
    passport.use(
      new GoogleStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: "/api/auth/google/callback",
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
              
              user = await storage.createUser({
                username,
                email,
                name,
                googleId,
                role: "tenant", // Default role, logic might be needed to persist role selection
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
      // Successful authentication, redirect home.
      // @ts-ignore
      const role = req.session.role || req.user?.role || "tenant";
      // Redirect based on role
      if (role === "provider") {
        res.redirect("/provider-dashboard");
      } else if (role === "admin") {
        res.redirect("/admin-dashboard");
      } else {
        res.redirect("/tenant-dashboard");
      }
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
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}
