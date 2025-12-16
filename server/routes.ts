import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail, sendEmail, sendBulkEmails, createMarketingEmailHtml, sendApplicationReceivedEmail, sendNewApplicationNotification, sendApplicationApprovedEmail, sendApplicationDeniedEmail } from "./email";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";
import { sql } from "drizzle-orm";
import { db } from "./db";

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

  // Sitemap.xml for SEO
  app.get("/sitemap.xml", async (req, res) => {
    const baseUrl = "https://soberstay.com";
    
    // Get all approved listings for dynamic sitemap entries
    const listings = await storage.getAllListings();
    const approvedListings = listings.filter((l: any) => l.status === "approved");
    
    const staticPages = [
      "", "/browse", "/quiz", "/mission", "/resources", "/how-to-choose",
      "/insurance-info", "/crisis-resources", "/blog", "/contact",
      "/for-tenants", "/for-providers", "/resource-center", "/locations",
      "/sober-living-near-me", "/what-is-sober-living", "/apply-for-sober-living",
      "/sober-living-california", "/sober-living-los-angeles", "/sober-living-san-diego",
      "/sober-living-florida", "/sober-living-texas", "/sober-living-arizona",
      "/sober-living-new-york", "/sober-living-denver", "/sober-living-chicago",
      "/sober-living-miami", "/sober-living-seattle", "/sober-living-portland",
      "/sober-living-austin", "/sober-living-nashville", "/sober-living-atlanta",
      "/privacy-policy", "/terms-of-use", "/disclaimer", "/help-center"
    ];
    
    const blogPosts = [
      "/blog/what-to-expect-first-month-sober-living",
      "/blog/how-to-choose-right-sober-living-home",
      "/blog/building-healthy-relationships-recovery",
      "/blog/sober-living-vs-halfway-house-differences",
      "/blog/employment-tips-sober-living"
    ];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    
    // Add static pages
    for (const page of staticPages) {
      sitemap += `  <url><loc>${baseUrl}${page}</loc><changefreq>weekly</changefreq></url>\n`;
    }
    
    // Add blog posts
    for (const post of blogPosts) {
      sitemap += `  <url><loc>${baseUrl}${post}</loc><changefreq>monthly</changefreq></url>\n`;
    }
    
    // Add dynamic property pages
    for (const listing of approvedListings) {
      sitemap += `  <url><loc>${baseUrl}/property/${listing.id}</loc><changefreq>daily</changefreq></url>\n`;
    }
    
    sitemap += `</urlset>`;
    
    res.setHeader("Content-Type", "application/xml");
    res.send(sitemap);
  });

  // Robots.txt for SEO
  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /

Sitemap: https://soberstay.com/sitemap.xml

# Block admin and user-specific pages
Disallow: /admin-dashboard
Disallow: /provider-dashboard
Disallow: /tenant-dashboard
Disallow: /tenant-profile
Disallow: /create-listing
Disallow: /edit-listing
Disallow: /analytics
Disallow: /seo-tools
Disallow: /chat/
Disallow: /apply/
Disallow: /auth/
`);
  });

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

      // Hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user with hashed password
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
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
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password against hash
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Set session maxAge based on rememberMe
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
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

  // Forgot Password - Request password reset email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: "No account found with that email address. Please check the email or sign up for a new account." });
      }

      await storage.invalidateUserPasswordResetTokens(user.id);
      
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      
      await storage.createPasswordResetToken(user.id, token, expiresAt);
      
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : process.env.APP_URL || "http://localhost:5000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;
      
      const emailSent = await sendPasswordResetEmail(email, token, resetUrl);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send reset email. Please try again later." });
      }
      
      res.json({ success: true, message: "Password reset link has been sent to your email." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process request. Please try again." });
    }
  });

  // Validate reset token
  app.get("/api/auth/validate-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== "string") {
        return res.status(400).json({ valid: false, error: "Token is required" });
      }

      const resetToken = await storage.getValidPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ valid: false, error: "Invalid or expired reset link" });
      }

      res.json({ valid: true });
    } catch (error) {
      console.error("Validate token error:", error);
      res.status(500).json({ valid: false, error: "Failed to validate token" });
    }
  });

  // Reset Password - Set new password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const resetToken = await storage.getValidPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      
      await storage.markPasswordResetTokenUsed(resetToken.id);
      
      res.json({ success: true, message: "Password has been reset successfully. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
  });

  // Listings
  app.post("/api/listings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Your session has expired. Please log in again." });
    }
    
    const providerId = (req.user as any).id;
    const user = await storage.getUser(providerId);
    
    // Only providers can create listings
    if (user?.role !== 'provider') {
      return res.status(403).json({ error: "Only providers can create listings" });
    }
    
    const isDraft = req.body.status === 'draft';
    
    // Drafts can be saved without subscription - only check subscription for publishing
    if (!isDraft) {
      // Check if provider has active subscription
      const subscription = await storage.getSubscriptionByProvider(providerId);
      
      // Skip all payment checks if provider has a fee waiver
      if (!subscription?.hasFeeWaiver) {
        if (!subscription || subscription.status !== 'active') {
          return res.status(402).json({ 
            error: "You need an active subscription to publish listings",
            requiresSubscription: true 
          });
        }
        
        // Check if provider has listing allowance available (metered billing: $49 = 1 listing slot)
        const currentListingCount = await storage.getActiveListingCount(providerId);
        const allowance = subscription.listingAllowance || 0;
        
        if (currentListingCount >= allowance) {
          return res.status(402).json({ 
            error: `You can create ${allowance} listing(s). Pay $49 to add another listing slot.`,
            currentListings: currentListingCount,
            allowance,
            requiresPayment: true 
          });
        }
      }
    }
    
    const parsed = insertListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const listing = await storage.createListing({
      ...parsed.data,
      providerId,
    });
    res.status(201).json(listing);
  });

  app.get("/api/listings/provider", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const listings = await storage.getListingsByProvider((req.user as any).id);
    res.json(listings);
  });

  // Public listings endpoint - returns approved and visible listings only
  app.get("/api/listings", async (req, res) => {
    try {
      const listings = await storage.getVisibleApprovedListings();
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  // Get single listing by ID (public - only shows visible approved listings)
  app.get("/api/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid listing ID" });
      }
      const listing = await storage.getListing(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      // Only show if approved and visible (or if user is the provider/admin)
      if (listing.status !== 'approved' || !listing.isVisible) {
        const user = req.user as any;
        const isOwner = user && listing.providerId === user.id;
        const isAdmin = user && user.role === 'admin';
        if (!isOwner && !isAdmin) {
          return res.status(404).json({ error: "Listing not found" });
        }
      }
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  // Update listing (PUT)
  app.put("/api/listings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Your session has expired. Please log in again." });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }
    
    const user = req.user as any;
    const existingListing = await storage.getListing(id);
    
    if (!existingListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Only allow owner or admin to update
    if (existingListing.providerId !== user.id && user.role !== "admin") {
      return res.status(403).json({ error: "You don't have permission to edit this listing" });
    }
    
    // Check subscription for publishing (not for drafts)
    const isDraft = req.body.status === "draft";
    if (!isDraft) {
      const subscription = await storage.getSubscriptionByProvider(existingListing.providerId);
      // Skip payment check if provider has fee waiver
      if (!subscription?.hasFeeWaiver) {
        if (!subscription || subscription.status !== "active") {
          return res.status(402).json({ error: "Active subscription required to publish listings" });
        }
      }
    }
    
    const parsed = insertListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    
    const updatedListing = await storage.updateListing(id, parsed.data);
    res.json(updatedListing);
  });

  // Admin endpoints
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const users = await storage.getAllUsers();
    
    // Fetch provider profiles and subscription info for providers
    const usersWithExtendedInfo = await Promise.all(users.map(async (u) => {
      const { password, ...safe } = u;
      if (u.role === 'provider') {
        const profile = await storage.getProviderProfile(u.id);
        const subscription = await storage.getSubscriptionByProvider(u.id);
        return { 
          ...safe, 
          documentsVerified: profile?.documentsVerified || false,
          hasFeeWaiver: subscription?.hasFeeWaiver || false
        };
      }
      return safe;
    }));
    
    res.json(usersWithExtendedInfo);
  });

  app.get("/api/admin/listings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const listings = await storage.getAllListings();
    res.json(listings);
  });

  app.patch("/api/admin/listings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }
    
    const { status, isVisible } = req.body;
    const validStatuses = ["pending", "approved", "rejected", "draft"];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    const listing = await storage.getListing(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    
    const updated = await storage.updateListingStatus(id, updateData);
    res.json(updated);
  });

  app.delete("/api/admin/listings/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }
    
    await storage.deleteListing(id);
    res.json({ success: true });
  });

  // Admin: Toggle fee waiver for a provider
  app.patch("/api/admin/providers/:id/fee-waiver", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const providerId = parseInt(req.params.id);
    if (isNaN(providerId)) {
      return res.status(400).json({ error: "Invalid provider ID" });
    }
    
    const { hasFeeWaiver } = req.body;
    if (typeof hasFeeWaiver !== "boolean") {
      return res.status(400).json({ error: "hasFeeWaiver must be a boolean" });
    }
    
    // Check if provider exists
    const provider = await storage.getUser(providerId);
    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ error: "Provider not found" });
    }
    
    // Check if subscription exists
    let subscription = await storage.getSubscriptionByProvider(providerId);
    
    if (!subscription) {
      // Create a new subscription with fee waiver if one doesn't exist
      subscription = await storage.createSubscription({
        providerId,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years from now
        paymentMethod: "fee_waiver",
        listingAllowance: 999, // Unlimited listings for fee waiver accounts
        hasFeeWaiver: true,
      });
    } else {
      // Update existing subscription
      subscription = await storage.updateSubscription(providerId, {
        hasFeeWaiver,
        ...(hasFeeWaiver ? { 
          status: "active", 
          listingAllowance: 999,
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
        } : {})
      });
    }
    
    res.json({ success: true, subscription });
  });

  // Admin: Get subscription info for a provider
  app.get("/api/admin/providers/:id/subscription", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const providerId = parseInt(req.params.id);
    if (isNaN(providerId)) {
      return res.status(400).json({ error: "Invalid provider ID" });
    }
    
    const subscription = await storage.getSubscriptionByProvider(providerId);
    res.json({ subscription: subscription || null });
  });

  // Stripe Configuration
  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Failed to get Stripe configuration" });
    }
  });

  // Get available subscription products/prices from Stripe
  app.get("/api/stripe/products", async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY pr.unit_amount
      `);
      res.json({ products: result.rows });
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create Stripe Checkout Session for provider subscription
  app.post("/api/stripe/checkout", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const sessionUser = req.user as any;
      
      // Only providers can create checkout sessions
      if (sessionUser.role !== 'provider') {
        return res.status(403).json({ error: "Only providers can subscribe" });
      }
      
      // Fetch fresh user data from database to get latest stripeCustomerId
      const user = await storage.getUser(sessionUser.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { billingPeriod, priceId: directPriceId } = req.body;

      let priceId = directPriceId;

      // If billingPeriod is provided, look up the price from the database or Stripe API
      if (!priceId && billingPeriod) {
        const interval = billingPeriod === 'annual' ? 'year' : 'month';
        
        // Try database first
        const result = await db.execute(sql`
          SELECT pr.id as price_id
          FROM stripe.prices pr
          JOIN stripe.products p ON pr.product = p.id
          WHERE (p.name ILIKE '%Provider%Subscription%' OR p.metadata->>'type' = 'provider_subscription')
          AND pr.active = true
          AND pr.recurring->>'interval' = ${interval}
          LIMIT 1
        `);
        
        if (result.rows.length > 0) {
          priceId = (result.rows[0] as any).price_id;
        }
        
        // If not in database, try Stripe API directly
        if (!priceId) {
          const { getUncachableStripeClient } = await import('./stripeClient');
          const stripe = await getUncachableStripeClient();
          
          // Search for provider subscription products
          const products = await stripe.products.search({ 
            query: "name~'Provider' AND active:'true'" 
          });
          
          for (const product of products.data) {
            const prices = await stripe.prices.list({ 
              product: product.id, 
              active: true 
            });
            const matchingPrice = prices.data.find(p => p.recurring?.interval === interval);
            if (matchingPrice) {
              priceId = matchingPrice.id;
              break;
            }
          }
        }
      }

      if (!priceId) {
        return res.status(400).json({ error: "Price not found for the selected billing period" });
      }

      // Get or create Stripe customer for this user
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email, user.id);
        await storage.updateUserStripeCustomerId(user.id, customer.id);
        customerId = customer.id;
      }

      // Create checkout session
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/provider-dashboard`,
        `${baseUrl}/provider-dashboard`,
        { providerId: String(user.id) }
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Get user's subscription status
  app.get("/api/stripe/subscription", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const sessionUser = req.user as any;
      
      // Only providers can check their subscription status
      if (sessionUser.role !== 'provider') {
        return res.status(403).json({ error: "Only providers have subscriptions" });
      }
      
      // Fetch fresh user data from database to get latest stripeCustomerId
      const user = await storage.getUser(sessionUser.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (!user.stripeCustomerId) {
        return res.json({ subscription: null });
      }

      // Query subscription from Stripe synced data
      const result = await db.execute(sql`
        SELECT * FROM stripe.subscriptions 
        WHERE customer = ${user.stripeCustomerId}
        AND status IN ('active', 'trialing')
        ORDER BY created DESC
        LIMIT 1
      `);

      res.json({ subscription: result.rows[0] || null });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Create customer portal session for managing subscription
  app.post("/api/stripe/portal", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const sessionUser = req.user as any;
      
      // Only providers can access the portal
      if (sessionUser.role !== 'provider') {
        return res.status(403).json({ error: "Only providers can access billing" });
      }
      
      // Fetch fresh user data from database
      const user = await storage.getUser(sessionUser.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (!user.stripeCustomerId) {
        return res.status(400).json({ error: "No subscription found" });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      const session = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        `${baseUrl}/provider-dashboard`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // Legacy subscription endpoint (for backwards compatibility)
  app.post("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { paymentMethod } = req.body;

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

  // Admin Email Endpoints
  app.post("/api/admin/send-email", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { to, subject, body, audience } = req.body;
    
    if (!subject || !body) {
      return res.status(400).json({ error: "Subject and body are required" });
    }

    try {
      let recipients: string[] = [];
      
      if (audience) {
        // Get users based on audience type
        const allUsers = await storage.getAllUsers();
        
        switch (audience) {
          case 'all':
            recipients = allUsers.map(u => u.email);
            break;
          case 'tenants':
            recipients = allUsers.filter(u => u.role === 'tenant').map(u => u.email);
            break;
          case 'providers':
            recipients = allUsers.filter(u => u.role === 'provider').map(u => u.email);
            break;
          default:
            recipients = allUsers.map(u => u.email);
        }
      } else if (to) {
        recipients = Array.isArray(to) ? to : [to];
      } else {
        return res.status(400).json({ error: "Either 'to' or 'audience' is required" });
      }

      if (recipients.length === 0) {
        return res.status(400).json({ error: "No recipients found" });
      }

      const html = createMarketingEmailHtml(subject, body);
      
      if (recipients.length === 1) {
        const result = await sendEmail({ to: recipients[0], subject, html });
        if (result.success) {
          res.json({ success: true, sent: 1, message: "Email sent successfully" });
        } else {
          res.status(500).json({ error: result.error || "Failed to send email" });
        }
      } else {
        const emails = recipients.map(email => ({ to: email, subject, html }));
        const result = await sendBulkEmails(emails);
        res.json({ 
          success: result.success, 
          sent: result.sent, 
          failed: result.failed,
          message: `Sent ${result.sent} emails${result.failed > 0 ? `, ${result.failed} failed` : ''}`
        });
      }
    } catch (error: any) {
      console.error("Admin email error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Send email to specific user
  app.post("/api/admin/send-user-email", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { userId, subject, body } = req.body;
    
    if (!userId || !subject || !body) {
      return res.status(400).json({ error: "userId, subject, and body are required" });
    }

    try {
      const targetUser = await storage.getUser(parseInt(userId));
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const html = createMarketingEmailHtml(subject, body);
      const result = await sendEmail({ to: targetUser.email, subject, html });
      
      if (result.success) {
        res.json({ success: true, message: `Email sent to ${targetUser.email}` });
      } else {
        res.status(500).json({ error: result.error || "Failed to send email" });
      }
    } catch (error: any) {
      console.error("Send user email error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Development: Seed test accounts
  app.post("/api/dev/seed-test-accounts", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ error: "This endpoint is only available in development" });
    }

    try {
      const testAccounts = [
        {
          email: "tenant@test.com",
          password: "password123",
          firstName: "Test",
          lastName: "Tenant",
          role: "tenant",
        },
        {
          email: "provider@test.com",
          password: "password123",
          firstName: "Test",
          lastName: "Provider",
          role: "provider",
        },
        {
          email: "admin@test.com",
          password: "password123",
          firstName: "Test",
          lastName: "Admin",
          role: "tenant",
        }
      ];

      const createdUsers = [];

      for (const account of testAccounts) {
        const existing = await storage.getUserByEmail(account.email);
        if (existing) {
          createdUsers.push({
            ...account,
            created: false,
            message: "Already exists",
          });
          continue;
        }

        const username = account.email.split("@")[0] + Math.floor(Math.random() * 10000);
        const name = `${account.firstName} ${account.lastName}`;
        const hashedPassword = await bcrypt.hash(account.password, 10);

        const user = await storage.createUser({
          username,
          email: account.email,
          password: hashedPassword,
          name,
          role: account.role as "tenant" | "provider",
        });

        // Make admin account actually admin
        if (account.email === "admin@test.com") {
          await storage.updateUser(user.id, { role: "admin" });
        }

        const { password: _, ...safeUser } = user;
        createdUsers.push({
          ...safeUser,
          plainPassword: account.password,
          created: true,
        });
      }

      res.json({
        success: true,
        message: "Test accounts seeded",
        accounts: createdUsers,
      });
    } catch (error: any) {
      console.error("Seed test accounts error:", error);
      res.status(500).json({ error: error.message || "Failed to seed accounts" });
    }
  });

  // Tenant Profile Routes
  app.get("/api/tenant/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const profile = await storage.getTenantProfile(user.id);
      if (!profile) {
        return res.json({ id: 0, tenantId: user.id });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/tenant/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { bio, applicationData } = req.body;
      const profile = await storage.createOrUpdateTenantProfile(user.id, {
        bio,
        applicationData,
      });
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.post("/api/tenant/upload", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { type, fileUrl } = req.body;
      
      // Store file URL (in production, upload to cloud storage and get the URL)
      const updateData: any = {};
      if (type === "profile") updateData.profilePhotoUrl = fileUrl;
      if (type === "id") updateData.idPhotoUrl = fileUrl;
      if (type === "application") updateData.applicationUrl = fileUrl;

      await storage.createOrUpdateTenantProfile(user.id, updateData);
      
      res.json({ 
        success: true, 
        url: fileUrl
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Provider Profile Routes
  app.get("/api/provider/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const profile = await storage.getProviderProfile(user.id);
      if (!profile) {
        return res.json({ id: 0, providerId: user.id });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching provider profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/provider/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { companyName, website, phone, description, address, city, state, zip, foundedYear, totalBeds } = req.body;
      const profile = await storage.createOrUpdateProviderProfile(user.id, {
        companyName,
        website,
        phone,
        description,
        address,
        city,
        state,
        zip,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        totalBeds: totalBeds ? parseInt(totalBeds) : null,
      });
      res.json(profile);
    } catch (error) {
      console.error("Error saving provider profile:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.post("/api/provider/upload-logo", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { logoUrl } = req.body;
      
      if (!logoUrl || typeof logoUrl !== "string") {
        return res.status(400).json({ error: "Logo URL is required" });
      }
      
      const maxSizeBytes = 2 * 1024 * 1024;
      if (logoUrl.length > maxSizeBytes) {
        return res.status(400).json({ error: "Logo file is too large. Maximum size is 2MB." });
      }
      
      if (!logoUrl.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image format. Please upload a valid image file." });
      }
      
      await storage.createOrUpdateProviderProfile(user.id, { logoUrl });
      res.json({ success: true, url: logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  // Submit application to a property
  app.post("/api/applications", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { listingId, applicationData, bio, profilePhotoUrl, idPhotoUrl } = req.body;
      
      if (!listingId) {
        return res.status(400).json({ error: "Listing ID is required" });
      }
      
      const application = await storage.createApplication({
        tenantId: user.id,
        listingId,
        applicationData,
        bio,
        profilePhotoUrl,
        idPhotoUrl,
        status: "pending",
      });
      
      // Send email notifications (non-blocking)
      try {
        const listing = await storage.getListing(listingId);
        const tenant = await storage.getUser(user.id);
        
        if (listing && tenant) {
          const provider = await storage.getUser(listing.providerId);
          const providerProfile = await storage.getProviderProfile(listing.providerId);
          const providerName = providerProfile?.companyName || provider?.name || 'The Provider';
          const tenantName = tenant.name || 'Tenant';
          
          // Send confirmation to tenant
          sendApplicationReceivedEmail(
            tenant.email,
            tenantName,
            listing.propertyName,
            providerName
          ).catch(err => console.error('Failed to send tenant confirmation email:', err));
          
          // Send notification to provider
          if (provider) {
            sendNewApplicationNotification(
              provider.email,
              providerName,
              tenantName,
              listing.propertyName
            ).catch(err => console.error('Failed to send provider notification email:', err));
          }
        }
      } catch (emailError) {
        console.error("Error sending application emails:", emailError);
        // Don't fail the request if emails fail
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Get applications for a tenant
  app.get("/api/applications", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const applications = await storage.getApplicationsByTenant(user.id);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get applications for a provider (all applications for their listings)
  app.get("/api/provider/applications", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const applications = await storage.getApplicationsByProvider(user.id);
      
      // Enrich with tenant and listing info
      const enrichedApplications = await Promise.all(applications.map(async (app) => {
        const tenant = await storage.getUser(app.tenantId);
        const listing = await storage.getListing(app.listingId);
        return {
          ...app,
          tenantName: tenant?.name || 'Unknown',
          tenantEmail: tenant?.email || '',
          propertyName: listing?.propertyName || 'Unknown Property',
        };
      }));
      
      res.json(enrichedApplications);
    } catch (error) {
      console.error("Error fetching provider applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Update application status (for providers)
  app.patch("/api/provider/applications/:id/status", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const appId = parseInt(req.params.id);
      if (isNaN(appId)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }
      
      const { status, reason } = req.body;
      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      // Verify the application belongs to one of the provider's listings
      const application = await storage.getApplication(appId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const listing = await storage.getListing(application.listingId);
      if (!listing || listing.providerId !== user.id) {
        return res.status(403).json({ error: "Not authorized to update this application" });
      }
      
      // Update the status
      const updated = await storage.updateApplicationStatus(appId, status);
      
      // Send email notification to tenant
      try {
        const tenant = await storage.getUser(application.tenantId);
        const providerProfile = await storage.getProviderProfile(user.id);
        const provider = await storage.getUser(user.id);
        
        if (tenant) {
          const tenantName = tenant.name || 'Tenant';
          const providerName = providerProfile?.companyName || provider?.name || 'The Provider';
          
          if (status === 'approved') {
            sendApplicationApprovedEmail(
              tenant.email,
              tenantName,
              listing.propertyName,
              providerName
            ).catch(err => console.error('Failed to send approval email:', err));
          } else if (status === 'rejected') {
            sendApplicationDeniedEmail(
              tenant.email,
              tenantName,
              listing.propertyName,
              providerName,
              reason
            ).catch(err => console.error('Failed to send rejection email:', err));
          }
        }
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Admin Promo Code Management
  app.get("/api/admin/promos", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const promos = await storage.getAllPromoCodes();
      res.json(promos);
    } catch (error) {
      console.error("Error fetching promos:", error);
      res.status(500).json({ error: "Failed to fetch promo codes" });
    }
  });

  app.post("/api/admin/promos", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { code, discountType, discountValue, target, usageLimit, isActive, expiresAt } = req.body;
      
      if (!code || !discountType || discountValue === undefined || !target) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const promo = await storage.createPromoCode({
        code,
        discountType,
        discountValue,
        target,
        usageLimit: usageLimit || 0,
        isActive: isActive !== false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });
      
      res.status(201).json(promo);
    } catch (error: any) {
      console.error("Error creating promo:", error);
      if (error.code === '23505') {
        return res.status(400).json({ error: "Promo code already exists" });
      }
      res.status(500).json({ error: "Failed to create promo code" });
    }
  });

  app.put("/api/admin/promos/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const { code, discountType, discountValue, target, usageLimit, isActive, expiresAt } = req.body;
      
      const updateData: any = {};
      if (code !== undefined) updateData.code = code;
      if (discountType !== undefined) updateData.discountType = discountType;
      if (discountValue !== undefined) updateData.discountValue = discountValue;
      if (target !== undefined) updateData.target = target;
      if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      
      const promo = await storage.updatePromoCode(id, updateData);
      if (!promo) {
        return res.status(404).json({ error: "Promo code not found" });
      }
      res.json(promo);
    } catch (error: any) {
      console.error("Error updating promo:", error);
      if (error.code === '23505') {
        return res.status(400).json({ error: "Promo code already exists" });
      }
      res.status(500).json({ error: "Failed to update promo code" });
    }
  });

  app.delete("/api/admin/promos/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromoCode(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting promo:", error);
      res.status(500).json({ error: "Failed to delete promo code" });
    }
  });

  // Admin Provider Verification endpoints
  app.patch("/api/admin/providers/:id/verify", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const providerId = parseInt(req.params.id);
      const profile = await storage.verifyProvider(providerId);
      if (!profile) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error verifying provider:", error);
      res.status(500).json({ error: "Failed to verify provider" });
    }
  });

  app.patch("/api/admin/providers/:id/unverify", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const providerId = parseInt(req.params.id);
      const profile = await storage.unverifyProvider(providerId);
      if (!profile) {
        return res.status(404).json({ error: "Provider not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error unverifying provider:", error);
      res.status(500).json({ error: "Failed to unverify provider" });
    }
  });

  // Featured Listings endpoints
  
  // Get all featured listings (admin)
  app.get("/api/admin/featured-listings", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const featured = await storage.getAllFeaturedListings();
      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured listings:", error);
      res.status(500).json({ error: "Failed to fetch featured listings" });
    }
  });

  // Get active featured listings (public - for browse page)
  app.get("/api/featured-listings", async (req, res) => {
    try {
      // Deactivate expired ones first
      await storage.deactivateExpiredFeaturedListings();
      const featured = await storage.getActiveFeaturedListings();
      res.json(featured);
    } catch (error) {
      console.error("Error fetching active featured listings:", error);
      res.status(500).json({ error: "Failed to fetch featured listings" });
    }
  });

  // Get provider's featured listings
  app.get("/api/provider/featured-listings", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const featured = await storage.getFeaturedListingsByProvider(user.id);
      res.json(featured);
    } catch (error) {
      console.error("Error fetching provider featured listings:", error);
      res.status(500).json({ error: "Failed to fetch featured listings" });
    }
  });

  // Purchase featured listing (provider)
  app.post("/api/provider/featured-listings", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { listingId, boostLevel, durationDays } = req.body;
      
      // Check if provider is verified before allowing purchase
      const isVerified = await storage.isProviderVerified(user.id);
      if (!isVerified) {
        return res.status(403).json({ error: "Your documents must be verified before purchasing featured listings. Please submit verification documents." });
      }
      
      // Validate listing belongs to provider
      const listing = await storage.getListing(listingId);
      if (!listing || listing.providerId !== user.id) {
        return res.status(403).json({ error: "Listing not found or access denied" });
      }
      
      // Check if listing is already featured
      const existingFeatured = await storage.getFeaturedListingByListingId(listingId);
      if (existingFeatured) {
        return res.status(400).json({ error: "Listing is already featured" });
      }
      
      // Calculate pricing: $7/day for 2x, $10/day for 3x, $15/day for 5x
      const pricePerDay = boostLevel === 5 ? 1500 : boostLevel === 3 ? 1000 : 700;
      const amountPaid = pricePerDay * durationDays;
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);
      
      const featured = await storage.createFeaturedListing({
        listingId,
        providerId: user.id,
        boostLevel: boostLevel || 2,
        amountPaid,
        durationDays: durationDays || 7,
        startDate,
        endDate,
        isActive: true,
      });
      
      res.json(featured);
    } catch (error) {
      console.error("Error creating featured listing:", error);
      res.status(500).json({ error: "Failed to create featured listing" });
    }
  });

  // Deactivate featured listing (admin or provider who owns it)
  app.patch("/api/featured-listings/:id/deactivate", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const featured = await storage.getFeaturedListing(id);
      
      if (!featured) {
        return res.status(404).json({ error: "Featured listing not found" });
      }
      
      // Only admin or the owning provider can deactivate
      if (user.role !== "admin" && featured.providerId !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.deactivateFeaturedListing(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deactivating featured listing:", error);
      res.status(500).json({ error: "Failed to deactivate featured listing" });
    }
  });

  // Update featured listing (admin only)
  app.patch("/api/admin/featured-listings/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const { boostLevel, isActive, endDate } = req.body;
      
      const updateData: any = {};
      if (boostLevel !== undefined) updateData.boostLevel = boostLevel;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (endDate !== undefined) updateData.endDate = new Date(endDate);
      
      const featured = await storage.updateFeaturedListing(id, updateData);
      if (!featured) {
        return res.status(404).json({ error: "Featured listing not found" });
      }
      res.json(featured);
    } catch (error) {
      console.error("Error updating featured listing:", error);
      res.status(500).json({ error: "Failed to update featured listing" });
    }
  });

  // Toggle featured listing active status (admin only)
  app.patch("/api/admin/featured-listings/:id/toggle", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const featured = await storage.getFeaturedListing(id);
      
      if (!featured) {
        return res.status(404).json({ error: "Featured listing not found" });
      }
      
      const updated = await storage.updateFeaturedListing(id, { isActive: !featured.isActive });
      res.json(updated);
    } catch (error) {
      console.error("Error toggling featured listing:", error);
      res.status(500).json({ error: "Failed to toggle featured listing" });
    }
  });

  return httpServer;
}
