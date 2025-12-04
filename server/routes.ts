import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Registration schema with validation
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["tenant", "provider"]),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0].message });
      }

      const { email, password, firstName, lastName, role } = parsed.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }

      // Create username from email
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
      const name = `${firstName} ${lastName}`;

      // Create the user (in production, hash the password!)
      const user = await storage.createUser({
        username,
        email,
        password, // Note: In production, this should be hashed!
        name,
        role,
      });

      // Log the user in automatically
      req.login(user, (err) => {
        if (err) {
          console.error("Auto-login after registration failed:", err);
          return res.status(201).json({ success: true, message: "Account created. Please log in." });
        }
        
        const { password: _, ...safeUser } = user;
        res.status(201).json({ success: true, user: safeUser });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to create account. Please try again." });
    }
  });

  // User Login (email/password)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check password (in production, compare hashed passwords!)
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Login failed. Please try again." });
        }
        
        const { password: _, ...safeUser } = user;
        res.json({ success: true, user: safeUser });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });

  // Listings
  app.post("/api/listings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const listing = await storage.createListing({
      ...parsed.data,
      providerId: (req.user as any).id,
    });
    res.status(201).json(listing);
  });

  app.get("/api/listings/provider", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const listings = await storage.getListingsByProvider((req.user as any).id);
    res.json(listings);
  });

  // Subscriptions & Payments
  app.post("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // In a real app, this is where we'd verify the Stripe/PayPal/ApplePay payment
    // For now, we'll simulate a successful payment processing
    
    const { paymentMethod } = req.body;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = await storage.createSubscription({
      providerId: (req.user as any).id,
      status: "active",
      paymentMethod: paymentMethod || "card",
      currentPeriodEnd: nextMonth,
    });

    res.status(201).json(subscription);
  });

  return httpServer;
}
