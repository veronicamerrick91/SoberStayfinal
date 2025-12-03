import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { User } from "@shared/schema";

export function setupAuth(app: Express) {
  // Always trust proxy in Replit environment
  app.set("trust proxy", 1);

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "replit_session_secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

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

  // Local Strategy for username/password login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, name, role } = req.body;
      
      if (!username || !email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        name,
        role: role || "tenant",
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Error logging in" });
        }
        return res.json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        });
      });
    })(req, res, next);
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
              
              // Determine role - check if this is the admin email
              let role = "tenant";
              if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
                role = "admin";
              }
              
              user = await storage.createUser({
                username,
                email,
                name,
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
