import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema, insertApplicationSchema } from "@shared/schema";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

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

  // Applications
  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const application = await storage.createApplication({
      ...parsed.data,
      tenantId: (req.user as any).id,
    });
    res.status(201).json(application);
  });

  app.get("/api/applications/tenant", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const applications = await storage.getApplicationsByTenant((req.user as any).id);
    res.json(applications);
  });

  app.get("/api/applications/provider", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const applications = await storage.getApplicationsByProvider((req.user as any).id);
    res.json(applications);
  });

  app.put("/api/applications/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const parsed = insertApplicationSchema.partial().safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    // In a real app, verify ownership before update
    const application = await storage.updateApplication(id, parsed.data);
    if (!application) return res.sendStatus(404);
    
    res.json(application);
  });

  // Stripe Integration - Get publishable key for frontend
  app.get("/api/stripe/config", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error('Error getting Stripe config:', error);
      res.status(500).json({ error: 'Failed to get Stripe configuration' });
    }
  });

  // Stripe Checkout - Create checkout session for subscription
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const user = req.user as any;
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'priceId is required' });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripeService.createCustomer(
          user.email,
          user.name,
          user.id
        );
        await storage.updateUserStripeInfo(user.id, { 
          stripeCustomerId: customer.id 
        });
        stripeCustomerId = customer.id;
      }

      // Create checkout session
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCheckoutSession(
        stripeCustomerId,
        priceId,
        `${baseUrl}/provider-dashboard?payment=success`,
        `${baseUrl}/provider-dashboard?payment=cancelled`
      );

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Checkout session error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's subscription status
  app.get("/api/subscription/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const user = req.user as any;
      
      if (!user.stripeSubscriptionId) {
        return res.json({ subscription: null, hasActiveSubscription: false });
      }

      const subscription = await stripeService.getSubscription(user.stripeSubscriptionId);
      
      res.json({ 
        subscription,
        hasActiveSubscription: subscription?.status === 'active' 
      });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  });

  // Legacy subscription endpoint (for backward compatibility during migration)
  app.post("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { paymentMethod } = req.body;
    
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
