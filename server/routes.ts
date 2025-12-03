import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

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
