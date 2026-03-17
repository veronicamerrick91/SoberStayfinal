import passport from "passport";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET;
  
  if ((app.get("env") === "production" || !!process.env.APP_URL) && !sessionSecret) {
    console.warn("WARNING: SESSION_SECRET not set. Using default secret - sessions will not persist across restarts.");
  }

  const isProduction = app.get("env") === "production" || !!process.env.APP_URL;
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret || "replit_dev_session_secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? 'lax' : undefined,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };

  if (isProduction) {
    app.set("trust proxy", 1);
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
