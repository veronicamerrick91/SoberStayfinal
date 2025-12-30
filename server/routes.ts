import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { sendPasswordResetEmail, sendEmail, sendBulkEmails, createMarketingEmailHtml, sendApplicationReceivedEmail, sendNewApplicationNotification, sendApplicationApprovedEmail, sendApplicationDeniedEmail, sendPaymentReminderEmail, sendAdminContactEmail, sendRenewalReminderEmail, sendSubscriptionCanceledEmail, sendListingsHiddenEmail, sendAdminLoginNotification, sendAdminNewUserNotification, sendAdminNewListingNotification, sendAdminNewApplicationNotification, sendAdminSubscriptionNotification } from "./email";
import { enrollUserInActiveWorkflows } from "./subscriptionScheduler";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { sendApplicationNotification as sendSmsApplicationNotification, sendApplicationApprovedNotification as sendSmsApproved, sendApplicationDeniedNotification as sendSmsDenied, sendNewMessageNotification as sendSmsMessage, send2FACode, generate2FACode, isTwilioConfigured, sendTourRequestNotification as sendSmsTourRequest, isValidPhoneNumber } from "./sms-service";
import { getNearbyServicesForAddress, isGoogleMapsConfigured } from "./places-service";

const pending2FACodes: Map<string, { code: string; expiresAt: Date; phone: string }> = new Map();

// Rate limiting for login attempts (in-memory, simple implementation)
const loginAttempts: Map<string, { count: number; lastAttempt: Date; blockedUntil?: Date }> = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(email: string): { allowed: boolean; remainingAttempts?: number; blockedUntil?: Date } {
  const now = new Date();
  const attempt = loginAttempts.get(email.toLowerCase());
  
  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  // Check if blocked
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    return { allowed: false, blockedUntil: attempt.blockedUntil };
  }
  
  // Reset if window has passed
  if (now.getTime() - attempt.lastAttempt.getTime() > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(email.toLowerCase());
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.count };
}

function recordFailedLogin(email: string): void {
  const now = new Date();
  const attempt = loginAttempts.get(email.toLowerCase());
  
  if (!attempt || now.getTime() - attempt.lastAttempt.getTime() > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(email.toLowerCase(), { count: 1, lastAttempt: now });
    return;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.blockedUntil = new Date(now.getTime() + LOCKOUT_DURATION_MS);
  }
  
  loginAttempts.set(email.toLowerCase(), attempt);
}

function clearLoginAttempts(email: string): void {
  loginAttempts.delete(email.toLowerCase());
}

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
    const baseUrl = "https://www.soberstayhomes.com";
    
    // Get all approved listings for dynamic sitemap entries
    const listings = await storage.getAllListings();
    const approvedListings = listings.filter((l: any) => l.status === "approved");
    
    const staticPages = [
      "", "/browse", "/quiz", "/mission", "/resources", "/how-to-choose",
      "/insurance-info", "/crisis-resources", "/blog", "/contact",
      "/for-tenants", "/for-providers", "/resource-center", "/locations",
      "/sober-living-near-me", "/what-is-sober-living", "/apply-for-sober-living",
      "/find-sober-living",
      "/sober-living/california", "/sober-living/florida", "/sober-living/texas", "/sober-living/arizona",
      "/sober-living-homes/los-angeles", "/sober-living-homes/san-diego", "/sober-living-homes/miami",
      "/sober-living-homes/denver", "/sober-living-homes/austin", "/sober-living-homes/phoenix",
      "/sober-living-homes/delray-beach",
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

Sitemap: https://www.soberstayhomes.com/sitemap.xml

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

  // 301 Redirects for old city URL format to new SEO-friendly format
  const cityRedirects: Record<string, string> = {
    "/sober-living-los-angeles": "/sober-living-homes/los-angeles",
    "/sober-living-san-diego": "/sober-living-homes/san-diego",
    "/sober-living-miami": "/sober-living-homes/miami",
    "/sober-living-denver": "/sober-living-homes/denver",
    "/sober-living-austin": "/sober-living-homes/austin",
    "/sober-living-phoenix": "/sober-living-homes/phoenix",
    "/sober-living-delray-beach": "/sober-living-homes/delray-beach",
    "/sober-living-california": "/sober-living/california",
    "/sober-living-florida": "/sober-living/florida",
    "/sober-living-texas": "/sober-living/texas",
    "/sober-living-arizona": "/sober-living/arizona",
    "/sober-living-new-york": "/sober-living/new-york",
    "/sober-living-chicago": "/sober-living/illinois",
    "/sober-living-seattle": "/sober-living/washington",
    "/sober-living-portland": "/sober-living/oregon",
    "/sober-living-nashville": "/sober-living/tennessee",
    "/sober-living-atlanta": "/sober-living/georgia",
  };
  
  Object.entries(cityRedirects).forEach(([oldPath, newPath]) => {
    app.get(oldPath, (req, res) => {
      res.redirect(301, newPath);
    });
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

      // Enroll user in relevant workflows based on role
      const workflowTrigger = role === "provider" ? "on-provider-signup" : "on-tenant-signup";
      enrollUserInActiveWorkflows(user.id, workflowTrigger, role).catch(err => {
        console.error("Failed to enroll user in workflows:", err);
      });

      // Notify admins of new user signup (non-blocking)
      sendAdminNewUserNotification(name, email, role as 'provider' | 'tenant').catch(err => {
        console.error("Failed to send admin new user notification:", err);
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
      const { email, password, rememberMe, twoFactorToken } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Check rate limiting
      const rateLimit = checkLoginRateLimit(email);
      if (!rateLimit.allowed) {
        const minutesRemaining = rateLimit.blockedUntil 
          ? Math.ceil((rateLimit.blockedUntil.getTime() - Date.now()) / 60000)
          : 15;
        return res.status(429).json({ 
          error: `Too many login attempts. Please try again in ${minutesRemaining} minutes.`,
          blockedUntil: rateLimit.blockedUntil
        });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        recordFailedLogin(email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password against hash
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        recordFailedLogin(email);
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Clear failed attempts on successful login
      clearLoginAttempts(email);

      // Check if provider has 2FA enabled
      if (user.role === "provider") {
        const providerProfile = await storage.getProviderProfile(user.id);
        if (providerProfile?.twoFactorEnabled && providerProfile?.twoFactorSecret) {
          // 2FA is enabled - verify the token
          if (!twoFactorToken) {
            return res.status(200).json({ 
              requires2FA: true, 
              message: "Two-factor authentication required" 
            });
          }
          
          const { authenticator } = await import('otplib');
          const isValid = authenticator.verify({ 
            token: twoFactorToken, 
            secret: providerProfile.twoFactorSecret 
          });
          
          if (!isValid) {
            return res.status(401).json({ error: "Invalid 2FA code" });
          }
        }
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
        
        // Send login notification for admin users
        if (user.role === "admin") {
          const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'Unknown';
          const userAgent = req.headers['user-agent'] || 'Unknown';
          sendAdminLoginNotification(user.email, new Date(), ipAddress, userAgent).catch(err => {
            console.error("Failed to send admin login notification:", err);
          });
        }
        
        const { password: _, ...safeUser } = user;
        res.json({ success: true, user: safeUser });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ error: "Failed to destroy session" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
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

    // Notify admins when a listing is submitted (not draft) for approval
    if (!isDraft) {
      const providerProfile = await storage.getProviderProfile(providerId);
      const providerName = providerProfile?.companyName || user?.name || 'Provider';
      sendAdminNewListingNotification(
        providerName,
        listing.propertyName,
        listing.city,
        listing.state
      ).catch(err => console.error("Failed to send admin new listing notification:", err));
    }

    res.status(201).json(listing);
  });

  app.get("/api/listings/provider", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const listings = await storage.getListingsByProvider((req.user as any).id);
    res.json(listings);
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Store the contact message or send via email
      console.log("Contact form submission:", { name, email, subject, message });
      
      // Try to send email notification to admin
      try {
        const { sendEmail } = await import('./email');
        await sendEmail({
          to: 'support@soberstayhomes.com',
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (emailError) {
        console.log("Email notification skipped:", emailError);
      }
      
      res.json({ success: true, message: "Your message has been received" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
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

  // Get nearby services for a listing
  app.get("/api/listings/:id/nearby", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid listing ID" });
      }
      
      if (!isGoogleMapsConfigured()) {
        return res.json({ configured: false, places: [] });
      }
      
      const listing = await storage.getListing(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}`;
      const places = await getNearbyServicesForAddress(fullAddress);
      
      res.json({ configured: true, places });
    } catch (error) {
      console.error("Error fetching nearby services:", error);
      res.status(500).json({ error: "Failed to fetch nearby services" });
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

  // Site visitor tracking (public endpoint for frontend to record page views)
  app.post("/api/track-visit", async (req, res) => {
    try {
      const { page, sessionId } = req.body;
      if (!page) {
        return res.status(400).json({ error: "Page is required" });
      }
      
      const userAgent = req.headers['user-agent'] || null;
      const referrer = req.headers['referer'] || null;
      const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || null;
      const userId = req.isAuthenticated() ? (req.user as any).id : null;
      
      await storage.recordSiteVisit({
        page,
        userAgent,
        referrer,
        ip,
        userId,
        sessionId: sessionId || null,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking visit:", error);
      res.status(500).json({ error: "Failed to track visit" });
    }
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
          hasFeeWaiver: subscription?.hasFeeWaiver || false,
          isFoundingMember: profile?.isFoundingMember || false
        };
      }
      return safe;
    }));
    
    res.json(usersWithExtendedInfo);
  });

  // Admin site visit stats endpoint
  app.get("/api/admin/site-visits", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const { days = "7" } = req.query;
      const daysNum = parseInt(days as string, 10) || 7;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);
      
      const stats = await storage.getSiteVisitStats(startDate, endDate);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site visit stats:", error);
      res.status(500).json({ error: "Failed to fetch site visit stats" });
    }
  });

  app.get("/api/admin/listings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const listings = await storage.getAllListings();
    
    // Helper to normalize JSON fields that might be strings
    const normalizeArray = (val: any): string[] => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };
    
    // Cache provider verification status to avoid repeated DB calls
    const providerVerificationCache = new Map<number, boolean>();
    
    // Enrich listings with provider verification status and normalize data
    const enrichedListings = await Promise.all(listings.map(async (listing) => {
      let providerVerified = providerVerificationCache.get(listing.providerId);
      if (providerVerified === undefined) {
        const providerProfile = await storage.getProviderProfile(listing.providerId);
        providerVerified = providerProfile?.documentsVerified || false;
        providerVerificationCache.set(listing.providerId, providerVerified);
      }
      
      return {
        ...listing,
        amenities: normalizeArray(listing.amenities),
        inclusions: normalizeArray(listing.inclusions),
        houseRules: normalizeArray(listing.houseRules),
        photos: normalizeArray(listing.photos),
        providerVerified
      };
    }));
    
    res.json(enrichedListings);
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
    
    // Validate required fields before approving
    if (status === "approved") {
      const requiredFields = [];
      if (!listing.propertyName || listing.propertyName.trim() === "") requiredFields.push("Property Name");
      if (!listing.address || listing.address.trim() === "") requiredFields.push("Address");
      if (!listing.city || listing.city.trim() === "") requiredFields.push("City");
      if (!listing.state || listing.state.trim() === "") requiredFields.push("State");
      if (!listing.monthlyPrice || listing.monthlyPrice <= 0) requiredFields.push("Monthly Price");
      if (!listing.totalBeds || listing.totalBeds <= 0) requiredFields.push("Number of Beds");
      if (!listing.description || listing.description.trim() === "") requiredFields.push("Description");
      
      if (requiredFields.length > 0) {
        return res.status(400).json({ 
          error: `Cannot approve listing with missing required fields: ${requiredFields.join(", ")}` 
        });
      }
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

  // Admin: Get all applications with tenant and listing info
  app.get("/api/admin/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const allApplications = await storage.getAllApplications();
    
    // Enrich with tenant and listing details
    const enrichedApplications = await Promise.all(allApplications.map(async (app) => {
      const tenant = await storage.getUser(app.tenantId);
      const listing = await storage.getListing(app.listingId);
      const tenantProfile = await storage.getTenantProfile(app.tenantId);
      
      return {
        ...app,
        tenantName: tenant?.name || "Unknown",
        tenantEmail: tenant?.email || "",
        tenantPhone: tenantProfile?.phone || "",
        propertyName: listing?.propertyName || "Unknown Property",
        listingCity: listing?.city || "",
        listingState: listing?.state || "",
      };
    }));
    
    res.json(enrichedApplications);
  });

  // Admin: Grant fee waiver for an application
  app.patch("/api/admin/applications/:id/fee-waiver", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    const updated = await storage.grantApplicationFeeWaiver(id);
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json(updated);
  });

  // Admin: Update application status (with payment check)
  app.patch("/api/admin/applications/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    const { status, moveInDate } = req.body;
    const validStatuses = ["draft", "pending", "approved", "rejected"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    // Check if application exists and verify payment status for approve/reject
    const application = await storage.getApplication(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Block approve/reject if not paid and no fee waiver
    if ((status === "approved" || status === "rejected") && 
        application.paymentStatus !== "paid" && 
        !application.hasFeeWaiver) {
      return res.status(400).json({ 
        error: "Cannot approve or deny application until payment is completed or fee waiver is granted" 
      });
    }
    
    const updated = await storage.updateApplicationStatus(
      id, 
      status, 
      moveInDate ? new Date(moveInDate) : undefined
    );
    
    res.json(updated);
  });

  // Admin: Toggle fee waiver for a provider
  app.patch("/api/admin/providers/:id/fee-waiver", async (req, res) => {
    try {
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
      
      console.log(`[Fee Waiver] Toggling fee waiver for provider ${providerId} to ${hasFeeWaiver}`);
      
      // Check if provider exists
      const provider = await storage.getUser(providerId);
      if (!provider || provider.role !== "provider") {
        return res.status(404).json({ error: "Provider not found" });
      }
      
      // Check if subscription exists
      let subscription = await storage.getSubscriptionByProvider(providerId);
      console.log(`[Fee Waiver] Existing subscription:`, subscription);
      
      if (!subscription) {
        // Create a new subscription with fee waiver if one doesn't exist
        console.log(`[Fee Waiver] Creating new subscription with fee waiver for provider ${providerId}`);
        subscription = await storage.createSubscription({
          providerId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years from now
          paymentMethod: "fee_waiver",
          listingAllowance: 999, // Unlimited listings for fee waiver accounts
          hasFeeWaiver: true,
        });
        console.log(`[Fee Waiver] Created subscription:`, subscription);
      } else {
        // Update existing subscription
        console.log(`[Fee Waiver] Updating existing subscription ${subscription.id} for provider ${providerId}`);
        subscription = await storage.updateSubscription(providerId, {
          hasFeeWaiver,
          ...(hasFeeWaiver ? { 
            status: "active", 
            listingAllowance: 999,
            currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
          } : {})
        });
        console.log(`[Fee Waiver] Updated subscription:`, subscription);
      }
      
      res.json({ success: true, subscription });
    } catch (error) {
      console.error("[Fee Waiver] Error:", error);
      res.status(500).json({ error: "Failed to toggle fee waiver" });
    }
  });

  // Admin: Toggle founding member status for a provider
  app.patch("/api/admin/providers/:id/founding-member", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const user = req.user as any;
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const providerId = parseInt(req.params.id);
      if (isNaN(providerId)) {
        return res.status(400).json({ error: "Invalid provider ID" });
      }
      
      const { isFoundingMember } = req.body;
      if (typeof isFoundingMember !== "boolean") {
        return res.status(400).json({ error: "isFoundingMember must be a boolean" });
      }
      
      console.log(`[Founding Member] Toggling founding member for provider ${providerId} to ${isFoundingMember}`);
      
      // Check if provider exists
      const provider = await storage.getUser(providerId);
      if (!provider || provider.role !== "provider") {
        return res.status(404).json({ error: "Provider not found" });
      }
      
      // Update the provider profile - include defaults for NOT NULL fields when creating new
      const existingProfile = await storage.getProviderProfile(providerId);
      const updatedProfile = await storage.createOrUpdateProviderProfile(providerId, {
        isFoundingMember,
        // Include defaults for NOT NULL fields if creating new profile
        ...(existingProfile ? {} : {
          smsOptIn: false,
          twoFactorEnabled: false,
          documentsVerified: false
        })
      });
      
      // If provider has an active Stripe subscription, apply/remove the founding member discount
      if (provider.stripeSubscriptionId) {
        try {
          if (isFoundingMember) {
            await stripeService.applyFoundingMemberDiscount(provider.stripeSubscriptionId);
            console.log(`[Founding Member] Applied 50% discount to subscription ${provider.stripeSubscriptionId}`);
          } else {
            await stripeService.removeFoundingMemberDiscount(provider.stripeSubscriptionId);
            console.log(`[Founding Member] Removed discount from subscription ${provider.stripeSubscriptionId}`);
          }
        } catch (stripeError) {
          console.error("[Founding Member] Stripe discount error (continuing anyway):", stripeError);
        }
      }
      
      res.json({ success: true, profile: updatedProfile });
    } catch (error) {
      console.error("[Founding Member] Error:", error);
      res.status(500).json({ error: "Failed to toggle founding member status" });
    }
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

      // Check if provider is a founding member for discount
      const providerProfile = await storage.getProviderProfile(user.id);
      const isFoundingMember = providerProfile?.isFoundingMember || false;

      // Create checkout session (with founding member discount if applicable)
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/provider-dashboard`,
        `${baseUrl}/provider-dashboard`,
        { providerId: String(user.id) },
        isFoundingMember
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
      
      // First check for fee waiver in local subscriptions table
      const localSubscription = await storage.getSubscriptionByProvider(user.id);
      if (localSubscription?.hasFeeWaiver && localSubscription.status === 'active') {
        return res.json({ 
          subscription: {
            id: `fee-waiver-${localSubscription.id}`,
            status: 'active',
            hasFeeWaiver: true,
            currentPeriodEnd: localSubscription.currentPeriodEnd,
            listingAllowance: localSubscription.listingAllowance
          }
        });
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
        // Get users based on audience type, excluding those who opted out
        const allUsers = await storage.getAllUsers();
        const subscribedUsers = allUsers.filter(u => !u.emailOptOut && u.role !== 'admin');
        
        switch (audience) {
          case 'all':
            recipients = subscribedUsers.map(u => u.email);
            break;
          case 'tenants':
            recipients = subscribedUsers.filter(u => u.role === 'tenant').map(u => u.email);
            break;
          case 'providers':
            recipients = subscribedUsers.filter(u => u.role === 'provider').map(u => u.email);
            break;
          default:
            recipients = subscribedUsers.map(u => u.email);
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

  // Admin: Toggle email subscription for a user
  app.patch("/api/admin/users/:id/email-subscription", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { emailOptOut } = req.body;
    if (typeof emailOptOut !== "boolean") {
      return res.status(400).json({ error: "emailOptOut must be a boolean" });
    }

    try {
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.updateUserEmailOptOut(userId, emailOptOut);
      res.json({ success: true, user: updatedUser });
    } catch (error: any) {
      console.error("Update email subscription error:", error);
      res.status(500).json({ error: error.message || "Failed to update email subscription" });
    }
  });

  // Admin: Send payment reminder email to a provider
  app.post("/api/admin/send-payment-reminder", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { userId, providerName, email } = req.body;
    
    if (!email || !providerName) {
      return res.status(400).json({ error: "email and providerName are required" });
    }

    try {
      const success = await sendPaymentReminderEmail(email, providerName);
      
      if (success) {
        res.json({ success: true, message: `Payment reminder sent to ${email}` });
      } else {
        res.status(500).json({ error: "Failed to send payment reminder email" });
      }
    } catch (error: any) {
      console.error("Send payment reminder error:", error);
      res.status(500).json({ error: error.message || "Failed to send payment reminder" });
    }
  });

  // Admin: Send contact email to a provider
  app.post("/api/admin/contact-provider", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { providerName, email, message } = req.body;
    
    if (!email || !providerName) {
      return res.status(400).json({ error: "email and providerName are required" });
    }

    // Default message if none provided
    const contactMessage = message || "We noticed an issue with your account and wanted to reach out. Please log in to your Provider Dashboard to review your account status, or reply to this email if you need assistance.";

    try {
      const success = await sendAdminContactEmail(email, providerName, contactMessage);
      
      if (success) {
        res.json({ success: true, message: `Contact email sent to ${email}` });
      } else {
        res.status(500).json({ error: "Failed to send contact email" });
      }
    } catch (error: any) {
      console.error("Send contact email error:", error);
      res.status(500).json({ error: error.message || "Failed to send contact email" });
    }
  });

  // Admin: Send test emails showing all template styles
  app.post("/api/admin/send-test-emails", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    // Helper to add delay between emails to avoid rate limiting (Resend: 2/sec)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const results: { template: string; success: boolean; error?: string }[] = [];
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + 7);
      const gracePeriodEnd = new Date();
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

      // 1. Marketing/Newsletter Email - Realistic newsletter content
      const marketingHtml = createMarketingEmailHtml(
        "New Features & Recovery Resources",
        "We're excited to share some updates from Sober Stay Homes!\n\n" +
        "What's New:\n" +
        "• Enhanced search filters to find the perfect recovery home\n" +
        "• New provider verification badges for added trust\n" +
        "• Improved application tracking in your dashboard\n\n" +
        "Recovery Tip of the Month:\n" +
        "Building a strong support network is essential. Connect with local AA/NA meetings and consider reaching out to a sponsor.\n\n" +
        "Thank you for being part of our recovery community. Your journey matters to us."
      );
      const r1 = await sendEmail({ to: email, subject: "[TEST] New Features & Recovery Resources - Sober Stay Homes", html: marketingHtml });
      results.push({ template: "Marketing/Newsletter", success: r1.success, error: r1.error });

      await delay(600);

      // 2. Password Reset Email
      const r2Success = await sendPasswordResetEmail(email, "abc123xyz", "https://www.soberstayhomes.com/reset-password?token=abc123xyz");
      results.push({ template: "Password Reset", success: r2Success });

      await delay(600);

      // 3. Subscription Renewal Reminder - Realistic provider name
      const r3Success = await sendRenewalReminderEmail(email, "Hope Recovery Homes", renewalDate);
      results.push({ template: "Subscription Renewal Reminder", success: r3Success });

      await delay(600);

      // 4. Subscription Canceled / Grace Period
      const r4Success = await sendSubscriptionCanceledEmail(email, "Hope Recovery Homes", gracePeriodEnd);
      results.push({ template: "Subscription Canceled (Grace Period)", success: r4Success });

      await delay(600);

      // 5. Listings Hidden
      const r5Success = await sendListingsHiddenEmail(email, "Hope Recovery Homes");
      results.push({ template: "Listings Hidden", success: r5Success });

      await delay(600);

      // 6. Application Received (Tenant confirmation) - Realistic names
      const r6Success = await sendApplicationReceivedEmail(email, "Michael", "Serenity Men's Home - Phoenix", "Serenity Recovery Homes");
      results.push({ template: "Application Received (Tenant)", success: r6Success });

      await delay(600);

      // 7. New Application Notification (Provider) - Realistic applicant
      const r7Success = await sendNewApplicationNotification(email, "Serenity Recovery Homes", "Michael Johnson", "Serenity Men's Home - Phoenix");
      results.push({ template: "New Application (Provider)", success: r7Success });

      await delay(600);

      // 8. Application Approved - Realistic scenario
      const r8Success = await sendApplicationApprovedEmail(email, "Michael", "Serenity Men's Home - Phoenix", "Serenity Recovery Homes");
      results.push({ template: "Application Approved", success: r8Success });

      await delay(600);

      // 9. Application Denied - Realistic reason
      const r9Success = await sendApplicationDeniedEmail(email, "Michael", "Desert Hope Men's Residence", "Desert Hope Recovery", "We're currently at full capacity and cannot accept new residents at this time. We encourage you to explore other listings on Sober Stay Homes or check back with us in a few weeks.");
      results.push({ template: "Application Denied", success: r9Success });

      await delay(600);

      // 10. Payment Reminder
      const r10Success = await sendPaymentReminderEmail(email, "Hope Recovery Homes");
      results.push({ template: "Payment Reminder", success: r10Success });

      await delay(600);

      // 11. Admin Contact - Realistic admin message
      const r11Success = await sendAdminContactEmail(email, "Hope Recovery Homes", "We noticed your provider verification documents are still pending review. Please upload your business license and insurance documentation to complete your verification and unlock featured listing options. If you have any questions, feel free to reply to this email.");
      results.push({ template: "Admin Contact", success: r11Success });

      const sentCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;

      res.json({ 
        success: failedCount === 0, 
        sent: sentCount,
        failed: failedCount,
        results,
        message: `Sent ${sentCount} test emails to ${email}${failedCount > 0 ? `, ${failedCount} failed` : ''}`
      });
    } catch (error: any) {
      console.error("Send test emails error:", error);
      res.status(500).json({ error: error.message || "Failed to send test emails" });
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

  // Development: Seed comprehensive test data for portal testing
  app.post("/api/dev/seed-full-test-data", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ error: "This endpoint is only available in development" });
    }

    try {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const results: any = { accounts: [], listings: [], applications: [], favorites: [], viewedHomes: [] };

      // 1. Create test tenant with complete profile
      let testTenant = await storage.getUserByEmail("testtenant@soberstay.com");
      if (!testTenant) {
        testTenant = await storage.createUser({
          username: "testtenant" + Math.floor(Math.random() * 10000),
          email: "testtenant@soberstay.com",
          password: hashedPassword,
          name: "Jamie Rivera",
          role: "tenant",
        });
        results.accounts.push({ email: "testtenant@soberstay.com", password: "password123", role: "tenant", created: true });
      } else {
        results.accounts.push({ email: "testtenant@soberstay.com", password: "password123", role: "tenant", created: false, message: "Already exists" });
      }

      // Create complete tenant profile
      const tenantProfileData = {
        firstName: "Jamie",
        lastName: "Rivera",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        phone: "(555) 123-4567",
        email: "testtenant@soberstay.com",
        currentAddress: "123 Recovery Lane",
        currentCity: "Los Angeles",
        currentState: "CA",
        currentZip: "90001",
        sobrietyDate: "2024-01-15",
        primarySubstance: "Alcohol",
        secondarySubstances: ["Prescription Opioids"],
        isOnMat: true,
        matMedication: "Suboxone",
        hasCompletedTreatment: true,
        treatmentFacility: "Serenity Treatment Center",
        treatmentCompletionDate: "2024-06-01",
        hasMentalHealthDiagnosis: true,
        mentalHealthConditions: ["Anxiety", "Depression"],
        isOnMentalHealthMedication: true,
        emergencyContactName: "Maria Rivera",
        emergencyContactPhone: "(555) 987-6543",
        emergencyContactRelationship: "Mother",
        hasIdentification: true,
        identificationType: "Driver's License",
        isCurrentlyEmployed: true,
        employer: "Recovery Tech Solutions",
        employmentType: "Full-time",
        monthlyIncome: 4500,
        incomeVerification: "pay_stubs",
        hasPreviousEvictions: false,
        hasCriminalRecord: false,
        hasVehicle: true,
        hasPets: false,
        desiredMoveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        preferredLocation: "Los Angeles",
        preferredGender: "Men",
        budgetMin: 800,
        budgetMax: 1500,
        lengthOfStay: "6-12 months",
        personalStatement: "I am committed to my recovery journey and looking for a supportive sober living environment. I have been sober since January 2024 and completed residential treatment at Serenity Treatment Center. I work full-time as a software developer and am looking to build a stable foundation for long-term recovery.",
        consentToBackgroundCheck: true,
        consentToReleaseInfo: true,
        acknowledgePolicies: true,
        electronicSignature: "Jamie Rivera",
        signatureDate: new Date().toISOString().split('T')[0],
      };
      await storage.createOrUpdateTenantProfile(testTenant.id, {
        bio: tenantProfileData.personalStatement,
        phone: tenantProfileData.phone,
        smsOptIn: true,
        applicationData: tenantProfileData as Record<string, any>,
      });

      // 2. Create test providers with profiles
      let testProvider1 = await storage.getUserByEmail("provider1@soberstay.com");
      if (!testProvider1) {
        testProvider1 = await storage.createUser({
          username: "hopehouse" + Math.floor(Math.random() * 10000),
          email: "provider1@soberstay.com",
          password: hashedPassword,
          name: "Sarah Mitchell",
          role: "provider",
        });
        results.accounts.push({ email: "provider1@soberstay.com", password: "password123", role: "provider", created: true });
      } else {
        results.accounts.push({ email: "provider1@soberstay.com", password: "password123", role: "provider", created: false });
      }

      let testProvider2 = await storage.getUserByEmail("provider2@soberstay.com");
      if (!testProvider2) {
        testProvider2 = await storage.createUser({
          username: "newbeginnings" + Math.floor(Math.random() * 10000),
          email: "provider2@soberstay.com",
          password: hashedPassword,
          name: "Michael Chen",
          role: "provider",
        });
        results.accounts.push({ email: "provider2@soberstay.com", password: "password123", role: "provider", created: true });
      } else {
        results.accounts.push({ email: "provider2@soberstay.com", password: "password123", role: "provider", created: false });
      }

      // Create provider profiles
      await storage.createOrUpdateProviderProfile(testProvider1.id, {
        companyName: "Hope House Recovery",
        phone: "(555) 222-3333",
        smsOptIn: true,
        description: "We provide a supportive, structured environment for men in early recovery. Our program focuses on accountability, community, and building life skills for lasting sobriety.",
        address: "456 Serenity Street",
        city: "Los Angeles",
        state: "CA",
        zip: "90015",
        foundedYear: 2018,
        totalBeds: 24,
        documentsVerified: true,
        verifiedAt: new Date(),
      });

      await storage.createOrUpdateProviderProfile(testProvider2.id, {
        companyName: "New Beginnings Sober Living",
        phone: "(555) 444-5555",
        smsOptIn: true,
        description: "A welcoming environment for women seeking recovery. We offer comprehensive support including job placement assistance, therapy referrals, and life skills training.",
        address: "789 Recovery Road",
        city: "San Diego",
        state: "CA",
        zip: "92101",
        foundedYear: 2020,
        totalBeds: 16,
        documentsVerified: true,
        verifiedAt: new Date(),
      });

      // Create subscriptions for providers
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 6);
      
      const existingSub1 = await storage.getSubscriptionByProvider(testProvider1.id);
      if (!existingSub1) {
        await storage.createSubscription({
          providerId: testProvider1.id,
          status: "active",
          currentPeriodEnd: futureDate,
          paymentMethod: "debit",
          listingAllowance: 5,
          hasFeeWaiver: false,
        });
      }

      const existingSub2 = await storage.getSubscriptionByProvider(testProvider2.id);
      if (!existingSub2) {
        await storage.createSubscription({
          providerId: testProvider2.id,
          status: "active",
          currentPeriodEnd: futureDate,
          paymentMethod: "debit",
          listingAllowance: 3,
          hasFeeWaiver: true,
        });
      }

      // 3. Create sample listings
      const sampleListings = [
        {
          providerId: testProvider1.id,
          propertyName: "Hope House - Downtown LA",
          address: "456 Serenity Street",
          city: "Los Angeles",
          state: "CA",
          monthlyPrice: 1200,
          totalBeds: 8,
          gender: "Men",
          roomType: "Shared Room",
          description: "Our flagship men's sober living home in the heart of Downtown LA. Walking distance to transit, AA meetings, and employment opportunities. We provide a structured environment with house meetings, chores, and curfews to support your recovery journey.",
          amenities: ["WiFi", "Laundry", "Parking", "Kitchen Access", "Cable TV", "Air Conditioning", "Gym Access"],
          inclusions: ["Utilities", "Weekly House Meetings", "Recovery Support", "Job Search Assistance"],
          photos: [],
          supervisionType: "House Manager",
          isMatFriendly: true,
          isPetFriendly: false,
          isLgbtqFriendly: true,
          isFaithBased: false,
          acceptsCouples: false,
          status: "approved",
        },
        {
          providerId: testProvider1.id,
          propertyName: "Hope House - Westside",
          address: "123 Recovery Ave",
          city: "Santa Monica",
          state: "CA",
          monthlyPrice: 1500,
          totalBeds: 6,
          gender: "Men",
          roomType: "Private Room",
          description: "Premium sober living near the beach. Private rooms, beautiful common areas, and a supportive community. Perfect for professionals in recovery who need a quiet, structured environment.",
          amenities: ["WiFi", "Laundry", "Parking", "Kitchen Access", "Patio", "Air Conditioning", "Near Beach"],
          inclusions: ["Utilities", "Weekly House Meetings", "Recovery Support"],
          photos: [],
          supervisionType: "Supervised",
          isMatFriendly: true,
          isPetFriendly: false,
          isLgbtqFriendly: true,
          isFaithBased: false,
          acceptsCouples: false,
          status: "approved",
        },
        {
          providerId: testProvider2.id,
          propertyName: "New Beginnings - Women's House",
          address: "789 Recovery Road",
          city: "San Diego",
          state: "CA",
          monthlyPrice: 1100,
          totalBeds: 8,
          gender: "Women",
          roomType: "Shared Room",
          description: "A safe, nurturing environment for women in recovery. Our all-female staff understands the unique challenges women face. We offer trauma-informed care, parenting support, and career counseling.",
          amenities: ["WiFi", "Laundry", "Kitchen Access", "Garden", "Meditation Room", "Air Conditioning"],
          inclusions: ["Utilities", "Weekly House Meetings", "Recovery Support", "Trauma-Informed Care", "Career Counseling"],
          photos: [],
          supervisionType: "House Manager",
          isMatFriendly: true,
          isPetFriendly: true,
          isLgbtqFriendly: true,
          isFaithBased: false,
          acceptsCouples: false,
          status: "approved",
        },
        {
          providerId: testProvider2.id,
          propertyName: "Serenity Couples House",
          address: "555 Unity Lane",
          city: "San Diego",
          state: "CA",
          monthlyPrice: 2000,
          totalBeds: 4,
          gender: "Co-Ed",
          roomType: "Private Room",
          description: "Unique sober living for couples in recovery. Support each other's journey while receiving structured care. Private suites with shared common areas. Couples counseling available.",
          amenities: ["WiFi", "Laundry", "Parking", "Kitchen Access", "Private Bath", "Air Conditioning"],
          inclusions: ["Utilities", "Weekly House Meetings", "Couples Counseling", "Recovery Support"],
          photos: [],
          supervisionType: "Supervised",
          isMatFriendly: true,
          isPetFriendly: false,
          isLgbtqFriendly: true,
          isFaithBased: false,
          acceptsCouples: true,
          status: "approved",
        },
        {
          providerId: testProvider1.id,
          propertyName: "Faith & Recovery House",
          address: "777 Grace Street",
          city: "Pasadena",
          state: "CA",
          monthlyPrice: 950,
          totalBeds: 10,
          gender: "Men",
          roomType: "Shared Room",
          description: "Faith-based recovery home for men seeking spiritual growth alongside sobriety. Daily devotionals, church attendance encouraged, and a brotherhood of support. All faiths welcome.",
          amenities: ["WiFi", "Laundry", "Kitchen Access", "Chapel", "Garden"],
          inclusions: ["Utilities", "Weekly House Meetings", "Spiritual Guidance", "Recovery Support"],
          photos: [],
          supervisionType: "House Manager",
          isMatFriendly: false,
          isPetFriendly: false,
          isLgbtqFriendly: false,
          isFaithBased: true,
          acceptsCouples: false,
          status: "approved",
        },
      ];

      const createdListings: any[] = [];
      for (const listingData of sampleListings) {
        // Check if listing with same name exists
        const allListings = await storage.getListingsByProvider(listingData.providerId);
        const exists = allListings.find(l => l.propertyName === listingData.propertyName);
        if (!exists) {
          const listing = await storage.createListing(listingData);
          createdListings.push(listing);
          results.listings.push({ name: listingData.propertyName, created: true });
        } else {
          createdListings.push(exists);
          results.listings.push({ name: listingData.propertyName, created: false, message: "Already exists" });
        }
      }

      // 4. Create sample applications for tenant
      const applicationStatuses = [
        { status: "pending", listingIndex: 0, label: "Submitted Application" },
        { status: "approved", listingIndex: 1, label: "Approved Application" },
        { status: "rejected", listingIndex: 2, label: "Denied Application" },
      ];

      for (const appConfig of applicationStatuses) {
        if (createdListings[appConfig.listingIndex]) {
          const existingApps = await storage.getApplicationsByTenant(testTenant.id);
          const alreadyApplied = existingApps.find(a => a.listingId === createdListings[appConfig.listingIndex].id);
          if (!alreadyApplied) {
            const moveInDate = new Date();
            moveInDate.setDate(moveInDate.getDate() + 14);
            await storage.createApplication({
              tenantId: testTenant.id,
              listingId: createdListings[appConfig.listingIndex].id,
              applicationData: {
                ...tenantProfileData,
                appliedAt: new Date().toISOString(),
                notes: appConfig.status === "rejected" ? "Unfortunately, we are at full capacity at this time." : undefined,
              } as Record<string, any>,
              status: appConfig.status,
              moveInDate: appConfig.status === "approved" ? moveInDate : undefined,
            });
            results.applications.push({ label: appConfig.label, listing: createdListings[appConfig.listingIndex].propertyName, created: true });
          } else {
            results.applications.push({ label: appConfig.label, listing: createdListings[appConfig.listingIndex].propertyName, created: false });
          }
        }
      }

      // 5. Create favorites for tenant
      for (let i = 0; i < Math.min(3, createdListings.length); i++) {
        try {
          await storage.addTenantFavorite(testTenant.id, createdListings[i].id);
          results.favorites.push({ listing: createdListings[i].propertyName, created: true });
        } catch {
          results.favorites.push({ listing: createdListings[i].propertyName, created: false, message: "Already favorited" });
        }
      }

      // 6. Create viewed homes for tenant
      for (const listing of createdListings) {
        try {
          await storage.addTenantViewedHome(testTenant.id, listing.id);
          results.viewedHomes.push({ listing: listing.propertyName, created: true });
        } catch {
          results.viewedHomes.push({ listing: listing.propertyName, created: false });
        }
      }

      // Return listing IDs for client-side tour request seeding
      const listingsForTours = createdListings.slice(0, 2).map(l => ({
        id: l.id,
        propertyName: l.propertyName,
      }));

      res.json({
        success: true,
        message: "Full test data seeded successfully",
        testCredentials: {
          tenant: { email: "testtenant@soberstay.com", password: "password123" },
          provider1: { email: "provider1@soberstay.com", password: "password123" },
          provider2: { email: "provider2@soberstay.com", password: "password123" },
        },
        results,
        listingsForTours, // Use these to seed tour requests in localStorage
      });
    } catch (error: any) {
      console.error("Seed full test data error:", error);
      res.status(500).json({ error: error.message || "Failed to seed test data" });
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
      const { bio, phone, smsOptIn, applicationData } = req.body;
      const profile = await storage.createOrUpdateTenantProfile(user.id, {
        bio,
        phone,
        smsOptIn,
        applicationData,
      });
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.patch("/api/tenant/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { bio, phone, smsOptIn, applicationData } = req.body;
      const updateData: any = {};
      if (bio !== undefined) updateData.bio = bio;
      if (phone !== undefined) updateData.phone = phone;
      if (smsOptIn !== undefined) updateData.smsOptIn = smsOptIn;
      if (applicationData !== undefined) updateData.applicationData = applicationData;
      
      const profile = await storage.createOrUpdateTenantProfile(user.id, updateData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
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

  // Tenant Favorites Routes
  app.get("/api/tenant/favorites", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const favorites = await storage.getTenantFavorites(user.id);
      res.json(favorites.map(f => String(f.listingId)));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/tenant/favorites/:listingId", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const listingId = parseInt(req.params.listingId);
      await storage.addTenantFavorite(user.id, listingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/tenant/favorites/:listingId", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const listingId = parseInt(req.params.listingId);
      await storage.removeTenantFavorite(user.id, listingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // Tenant Viewed Homes Routes
  app.get("/api/tenant/viewed-homes", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const viewedHomes = await storage.getTenantViewedHomes(user.id);
      res.json(viewedHomes.map(v => ({ propertyId: String(v.listingId), viewedAt: v.viewedAt })));
    } catch (error) {
      console.error("Error fetching viewed homes:", error);
      res.status(500).json({ error: "Failed to fetch viewed homes" });
    }
  });

  app.post("/api/tenant/viewed-homes/:listingId", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "tenant") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const listingId = parseInt(req.params.listingId);
      await storage.addTenantViewedHome(user.id, listingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding viewed home:", error);
      res.status(500).json({ error: "Failed to record viewed home" });
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
      const { companyName, website, phone, smsOptIn, description, address, city, state, zip, foundedYear, totalBeds } = req.body;
      const profile = await storage.createOrUpdateProviderProfile(user.id, {
        companyName,
        website,
        phone,
        smsOptIn,
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

  // Update provider profile settings (phone)
  app.patch("/api/provider/profile", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { contactPhone, phone } = req.body;
      const updateData: any = {};
      // Use phone field from schema (accept both contactPhone and phone)
      if (contactPhone !== undefined) updateData.phone = contactPhone;
      if (phone !== undefined) updateData.phone = phone;
      
      const profile = await storage.createOrUpdateProviderProfile(user.id, updateData);
      res.json({ ...profile, contactPhone: profile?.phone });
    } catch (error) {
      console.error("Error updating provider profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
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

  // Upload verification document
  app.post("/api/provider/verification-doc", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { docType, fileUrl } = req.body;
      
      const validDocTypes = ["business_license", "insurance", "owner_id", "property_photos", "safety_certs"];
      if (!docType || !validDocTypes.includes(docType)) {
        return res.status(400).json({ error: "Invalid document type" });
      }
      
      if (!fileUrl || typeof fileUrl !== "string") {
        return res.status(400).json({ error: "File URL is required" });
      }
      
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB for documents
      if (fileUrl.length > maxSizeBytes) {
        return res.status(400).json({ error: "Document file is too large. Maximum size is 5MB." });
      }
      
      // Store document URL in provider profile's verificationDocs JSON field
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.verificationDocs as Record<string, string>) || {};
      existingDocs[docType] = fileUrl;
      
      await storage.createOrUpdateProviderProfile(user.id, { 
        verificationDocs: existingDocs as any 
      });
      
      res.json({ success: true, docType });
    } catch (error) {
      console.error("Error uploading verification document:", error);
      res.status(500).json({ error: "Failed to upload verification document" });
    }
  });

  // Remove verification document (POST for legacy support)
  app.post("/api/provider/verification-doc/remove", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { docType } = req.body;
      
      const validDocTypes = ["business_license", "insurance", "owner_id", "property_photos", "safety_certs"];
      if (!docType || !validDocTypes.includes(docType)) {
        return res.status(400).json({ error: "Invalid document type" });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.verificationDocs as Record<string, string>) || {};
      delete existingDocs[docType];
      
      await storage.createOrUpdateProviderProfile(user.id, { 
        verificationDocs: existingDocs as any 
      });
      
      res.json({ success: true, docType });
    } catch (error) {
      console.error("Error removing verification document:", error);
      res.status(500).json({ error: "Failed to remove verification document" });
    }
  });
  
  // Remove verification document (DELETE for REST compliance)
  app.delete("/api/provider/verification-doc", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { docType } = req.body;
      
      const validDocTypes = ["business_license", "insurance", "owner_id", "property_photos", "safety_certs"];
      if (!docType || !validDocTypes.includes(docType)) {
        return res.status(400).json({ error: "Invalid document type" });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.verificationDocs as Record<string, string>) || {};
      delete existingDocs[docType];
      
      await storage.createOrUpdateProviderProfile(user.id, { 
        verificationDocs: existingDocs as any 
      });
      
      res.json({ success: true, docType });
    } catch (error) {
      console.error("Error removing verification document:", error);
      res.status(500).json({ error: "Failed to remove verification document" });
    }
  });

  // Upload resident document
  app.post("/api/provider/resident-doc", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { tenantId, docType, fileUrl, customName, isMultiple, fileName } = req.body;
      
      const validDocTypes = [
        "intake_packet", "government_id", "insurance_card", "emergency_contacts",
        "release_of_info", "treatment_plan", "sobriety_agreement", "drug_test_history",
        "financial_agreement", "incident_reports", "custom"
      ];
      if (!docType || !validDocTypes.includes(docType)) {
        return res.status(400).json({ error: "Invalid document type" });
      }
      
      if (!tenantId || !fileUrl || typeof fileUrl !== "string") {
        return res.status(400).json({ error: "Tenant ID and file URL are required" });
      }
      
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB for documents
      if (fileUrl.length > maxSizeBytes) {
        return res.status(400).json({ error: "Document file is too large. Maximum size is 5MB." });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.residentDocuments as Record<string, Record<string, any>>) || {};
      
      if (!existingDocs[tenantId]) {
        existingDocs[tenantId] = {};
      }
      
      // For custom documents, use customName as the key
      const docKey = docType === "custom" && customName ? `custom_${Date.now()}` : docType;
      
      // Handle multiple upload types (drug_test_history, incident_reports)
      if (isMultiple) {
        const existingArray = Array.isArray(existingDocs[tenantId][docKey]) ? existingDocs[tenantId][docKey] : [];
        const newEntry = { 
          url: fileUrl, 
          date: new Date().toLocaleDateString(), 
          name: fileName || docType 
        };
        existingDocs[tenantId][docKey] = [...existingArray, newEntry];
      } else {
        existingDocs[tenantId][docKey] = fileUrl;
      }
      
      // Store custom name in a separate metadata key if provided
      if (docType === "custom" && customName) {
        existingDocs[tenantId][`${docKey}_name`] = customName;
      }
      
      await storage.createOrUpdateProviderProfile(user.id, { 
        residentDocuments: existingDocs as any 
      });
      
      res.json({ success: true, docType: docKey, tenantId });
    } catch (error) {
      console.error("Error uploading resident document:", error);
      res.status(500).json({ error: "Failed to upload resident document" });
    }
  });

  // Remove resident document
  app.post("/api/provider/resident-doc/remove", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { tenantId, docType, index } = req.body;
      
      if (!tenantId || !docType) {
        return res.status(400).json({ error: "Tenant ID and document type are required" });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.residentDocuments as Record<string, Record<string, any>>) || {};
      
      if (existingDocs[tenantId]) {
        // Handle removal from array (for multiple upload types)
        if (typeof index === 'number' && Array.isArray(existingDocs[tenantId][docType])) {
          existingDocs[tenantId][docType] = existingDocs[tenantId][docType].filter((_: any, i: number) => i !== index);
          // Clean up empty arrays
          if (existingDocs[tenantId][docType].length === 0) {
            delete existingDocs[tenantId][docType];
          }
        } else {
          delete existingDocs[tenantId][docType];
          // Also delete custom name if exists
          delete existingDocs[tenantId][`${docType}_name`];
        }
      }
      
      await storage.createOrUpdateProviderProfile(user.id, { 
        residentDocuments: existingDocs as any 
      });
      
      res.json({ success: true, docType, tenantId });
    } catch (error) {
      console.error("Error removing resident document:", error);
      res.status(500).json({ error: "Failed to remove resident document" });
    }
  });

  // Get resident documents for a specific tenant
  app.get("/api/provider/resident-docs/:tenantId", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { tenantId } = req.params;
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.residentDocuments as Record<string, Record<string, string>>) || {};
      
      res.json({ documents: existingDocs[tenantId] || {} });
    } catch (error) {
      console.error("Error fetching resident documents:", error);
      res.status(500).json({ error: "Failed to fetch resident documents" });
    }
  });

  // Download/view a specific resident document file
  app.get("/api/provider/resident-doc/download/:tenantId/:docKey/:uploadIndex?", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { tenantId, docKey, uploadIndex } = req.params;
      
      const profile = await storage.getProviderProfile(user.id);
      const existingDocs = (profile?.residentDocuments as Record<string, Record<string, any>>) || {};
      
      if (!existingDocs[tenantId] || !existingDocs[tenantId][docKey]) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      const docData = existingDocs[tenantId][docKey];
      let dataUrl: string;
      let fileName: string = docKey;
      
      if (Array.isArray(docData)) {
        const idx = parseInt(uploadIndex || '0', 10);
        if (idx >= docData.length) {
          return res.status(404).json({ error: "Document index not found" });
        }
        dataUrl = docData[idx].url || docData[idx];
        fileName = docData[idx].name || docKey;
      } else if (typeof docData === 'object' && docData.url) {
        dataUrl = docData.url;
        fileName = docData.name || docKey;
      } else {
        dataUrl = docData;
      }
      
      if (!dataUrl || !dataUrl.startsWith('data:')) {
        return res.status(400).json({ error: "Invalid document data" });
      }
      
      // Parse the data URL
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Determine file extension
      const extMap: Record<string, string> = {
        'application/pdf': '.pdf',
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
      };
      const ext = extMap[mimeType] || '';
      if (!fileName.includes('.')) {
        fileName += ext;
      }
      
      // Set headers for inline viewing (or download if browser can't display)
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    } catch (error) {
      console.error("Error downloading resident document:", error);
      res.status(500).json({ error: "Failed to download document" });
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
        status: "pending",
      });
      
      // Update tenant profile with photos if provided
      if (bio || profilePhotoUrl || idPhotoUrl) {
        await storage.createOrUpdateTenantProfile(user.id, {
          ...(bio && { bio }),
          ...(profilePhotoUrl && { profilePhotoUrl }),
          ...(idPhotoUrl && { idPhotoUrl }),
        });
      }
      
      // Send email and SMS notifications (non-blocking)
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
            
            // Send SMS to provider if opted in
            if (providerProfile?.smsOptIn && providerProfile?.phone) {
              sendSmsApplicationNotification(providerProfile.phone, tenantName, listing.propertyName)
                .catch(err => console.error('Failed to send provider SMS notification:', err));
            }
          }

          // Notify admins of new application
          sendAdminNewApplicationNotification(tenantName, listing.propertyName, providerName)
            .catch(err => console.error('Failed to send admin application notification:', err));
        }
      } catch (emailError) {
        console.error("Error sending application notifications:", emailError);
        // Don't fail the request if notifications fail
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
        const tenantProfile = await storage.getTenantProfile(app.tenantId);
        const listing = await storage.getListing(app.listingId);
        return {
          ...app,
          tenantName: tenant?.name || 'Unknown',
          tenantEmail: tenant?.email || '',
          propertyName: listing?.propertyName || 'Unknown Property',
          profilePhotoUrl: tenantProfile?.profilePhotoUrl || undefined,
          idPhotoUrl: tenantProfile?.idPhotoUrl || undefined,
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
      
      const { status, reason, moveInDate } = req.body;
      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      // Parse move-in date if provided
      let parsedMoveInDate: Date | undefined;
      if (moveInDate) {
        parsedMoveInDate = new Date(moveInDate);
        if (isNaN(parsedMoveInDate.getTime())) {
          return res.status(400).json({ error: "Invalid move-in date" });
        }
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
      
      // Update the status (and move-in date if approving)
      const updated = await storage.updateApplicationStatus(appId, status, parsedMoveInDate);
      
      // Send email and SMS notification to tenant
      try {
        const tenant = await storage.getUser(application.tenantId);
        const providerProfile = await storage.getProviderProfile(user.id);
        const provider = await storage.getUser(user.id);
        const tenantProfile = await storage.getTenantProfile(application.tenantId);
        
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
            
            // Send SMS if tenant opted in
            if (tenantProfile?.smsOptIn && tenantProfile?.phone) {
              sendSmsApproved(tenantProfile.phone, listing.propertyName)
                .catch(err => console.error('Failed to send approval SMS:', err));
            }
          } else if (status === 'rejected') {
            sendApplicationDeniedEmail(
              tenant.email,
              tenantName,
              listing.propertyName,
              providerName,
              reason
            ).catch(err => console.error('Failed to send rejection email:', err));
            
            // Send SMS if tenant opted in
            if (tenantProfile?.smsOptIn && tenantProfile?.phone) {
              sendSmsDenied(tenantProfile.phone, listing.propertyName)
                .catch(err => console.error('Failed to send rejection SMS:', err));
            }
          }
        }
      } catch (emailError) {
        console.error("Error sending status update notification:", emailError);
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Two-Factor Authentication endpoints for providers
  app.get("/api/provider/2fa/status", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const profile = await storage.getProviderProfile(user.id);
      res.json({ 
        enabled: profile?.twoFactorEnabled || false 
      });
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
      res.status(500).json({ error: "Failed to fetch 2FA status" });
    }
  });

  app.post("/api/provider/2fa/setup", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      // Generate a new secret
      const secret = authenticator.generateSecret();
      
      // Generate the OTP Auth URL for the QR code
      const userEmail = user.email || user.username;
      const otpAuthUrl = authenticator.keyuri(userEmail, "Sober Stay", secret);
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
      
      // Store the secret temporarily (not enabled yet until verified)
      await storage.createOrUpdateProviderProfile(user.id, {
        twoFactorSecret: secret,
        twoFactorEnabled: false
      });
      
      res.json({ 
        secret, 
        qrCode: qrCodeDataUrl,
        otpAuthUrl 
      });
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      res.status(500).json({ error: "Failed to setup 2FA" });
    }
  });

  app.post("/api/provider/2fa/verify", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      if (!profile?.twoFactorSecret) {
        return res.status(400).json({ error: "2FA not setup. Please setup first." });
      }
      
      // Verify the token
      const isValid = authenticator.verify({ 
        token, 
        secret: profile.twoFactorSecret 
      });
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Enable 2FA
      await storage.createOrUpdateProviderProfile(user.id, {
        twoFactorEnabled: true
      });
      
      res.json({ success: true, message: "Two-factor authentication enabled" });
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      res.status(500).json({ error: "Failed to verify 2FA" });
    }
  });

  app.post("/api/provider/2fa/disable", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required to disable 2FA" });
      }
      
      const profile = await storage.getProviderProfile(user.id);
      if (!profile?.twoFactorSecret || !profile?.twoFactorEnabled) {
        return res.status(400).json({ error: "2FA is not enabled" });
      }
      
      // Verify the token before disabling
      const isValid = authenticator.verify({ 
        token, 
        secret: profile.twoFactorSecret 
      });
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Disable 2FA and clear secret
      await storage.createOrUpdateProviderProfile(user.id, {
        twoFactorSecret: null,
        twoFactorEnabled: false
      });
      
      res.json({ success: true, message: "Two-factor authentication disabled" });
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      res.status(500).json({ error: "Failed to disable 2FA" });
    }
  });

  // SMS 2FA - Send code
  app.post("/api/provider/2fa/sms/send", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { phone } = req.body;
      if (!phone || !isValidPhoneNumber(phone)) {
        return res.status(400).json({ error: "Valid phone number is required (at least 10 digits)" });
      }
      
      if (!isTwilioConfigured()) {
        return res.status(503).json({ error: "SMS service is not configured. Please use the authenticator app method." });
      }
      
      const code = generate2FACode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store the pending code
      pending2FACodes.set(user.id.toString(), { code, expiresAt, phone });
      
      // Send the SMS
      const result = await send2FACode(phone, code);
      
      if (result.success) {
        res.json({ success: true, message: "Verification code sent" });
      } else {
        res.status(500).json({ error: result.error || "Failed to send SMS" });
      }
    } catch (error) {
      console.error("Error sending 2FA SMS:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // SMS 2FA - Verify code
  app.post("/api/provider/2fa/sms/verify", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Verification code is required" });
      }
      
      const pending = pending2FACodes.get(user.id.toString());
      if (!pending) {
        return res.status(400).json({ error: "No pending verification. Please request a new code." });
      }
      
      if (new Date() > pending.expiresAt) {
        pending2FACodes.delete(user.id.toString());
        return res.status(400).json({ error: "Verification code expired. Please request a new code." });
      }
      
      if (token !== pending.code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Code is valid - generate a TOTP secret for future logins
      const secret = authenticator.generateSecret();
      
      await storage.createOrUpdateProviderProfile(user.id, {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
        phone: pending.phone,
        smsOptIn: true
      });
      
      pending2FACodes.delete(user.id.toString());
      
      res.json({ success: true, message: "Two-factor authentication enabled via SMS" });
    } catch (error) {
      console.error("Error verifying 2FA SMS:", error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Check if Twilio is configured
  app.get("/api/sms/status", async (req, res) => {
    res.json({ configured: isTwilioConfigured() });
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

  // Analytics endpoints

  // Record analytics event (public, uses sendBeacon)
  app.post("/api/analytics/events", async (req, res) => {
    try {
      const { listingId, eventType, city, state } = req.body;
      
      if (!listingId || !eventType) {
        return res.status(400).json({ error: "listingId and eventType are required" });
      }
      
      // Validate event type
      const validEventTypes = ['view', 'click', 'inquiry', 'tour_request', 'application'];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Invalid event type" });
      }
      
      // Get the listing to find the provider ID
      const listing = await storage.getListing(parseInt(listingId));
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Get tenant ID if logged in
      const user = req.user as any;
      const tenantId = user?.role === 'tenant' ? user.id : null;
      
      // Record the event asynchronously (don't block response)
      setImmediate(async () => {
        try {
          await storage.recordAnalyticsEvent({
            listingId: listing.id,
            providerId: listing.providerId,
            tenantId,
            eventType,
            city: city ? String(city).slice(0, 100) : null,
            state: state ? String(state).slice(0, 50) : null
          });
        } catch (err) {
          console.error("Error recording analytics event:", err);
        }
      });
      
      res.status(204).end();
    } catch (error) {
      console.error("Error in analytics event:", error);
      res.status(500).json({ error: "Failed to record event" });
    }
  });

  // Get provider analytics summary
  app.get("/api/provider/analytics/summary", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { days = 30 } = req.query;
      const numDays = Math.min(Math.max(parseInt(String(days)) || 30, 1), 365);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - numDays);
      
      const dailyData = await storage.getProviderAnalyticsSummary(user.id, startDate, endDate);
      
      // Calculate totals
      const totals = dailyData.reduce((acc, day) => ({
        views: acc.views + day.views,
        clicks: acc.clicks + day.clicks,
        inquiries: acc.inquiries + day.inquiries,
        tourRequests: acc.tourRequests + day.tourRequests,
        applications: acc.applications + day.applications
      }), { views: 0, clicks: 0, inquiries: 0, tourRequests: 0, applications: 0 });
      
      res.json({
        totals,
        dailyData,
        period: { startDate, endDate, days: numDays }
      });
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get top locations for provider
  app.get("/api/provider/analytics/locations", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "provider") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { days = 30 } = req.query;
      const numDays = Math.min(Math.max(parseInt(String(days)) || 30, 1), 365);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - numDays);
      
      const locations = await storage.getProviderTopLocations(user.id, startDate, endDate);
      
      res.json({ locations });
    } catch (error) {
      console.error("Error fetching analytics locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Blog Post Management endpoints

  // Get all blog posts (admin only)
  app.get("/api/admin/blog-posts", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get published blog posts (public)
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post by slug (public)
  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Create blog post (admin only)
  app.post("/api/admin/blog-posts", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { title, slug, excerpt, content, author, category, tags, status, scheduledAt } = req.body;
      
      if (!title || !slug || !content || !author || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if slug already exists
      const existing = await storage.getBlogPostBySlug(slug);
      if (existing) {
        return res.status(400).json({ error: "A blog post with this slug already exists" });
      }
      
      const post = await storage.createBlogPost({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        author,
        category,
        tags: tags || [],
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      });
      
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  // Update blog post (admin only)
  app.patch("/api/admin/blog-posts/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const { title, slug, excerpt, content, author, category, tags, status, scheduledAt } = req.body;
      
      // If changing slug, check it doesn't conflict
      if (slug) {
        const existing = await storage.getBlogPostBySlug(slug);
        if (existing && existing.id !== id) {
          return res.status(400).json({ error: "A blog post with this slug already exists" });
        }
      }
      
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (content !== undefined) updateData.content = content;
      if (author !== undefined) updateData.author = author;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (status !== undefined) {
        updateData.status = status;
        if (status === "published") {
          updateData.publishedAt = new Date();
        }
      }
      if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
      
      const post = await storage.updateBlogPost(id, updateData);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  // Delete blog post (admin only)
  app.delete("/api/admin/blog-posts/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ========== PARTNERS API ==========

  // Get active partners (public)
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getActivePartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Get all partners (admin only)
  app.get("/api/admin/partners", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Create partner (admin only)
  app.post("/api/admin/partners", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const partner = await storage.createPartner(req.body);
      res.json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });

  // Update partner (admin only)
  app.put("/api/admin/partners/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const partner = await storage.updatePartner(id, req.body);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ error: "Failed to update partner" });
    }
  });

  // Delete partner (admin only)
  app.delete("/api/admin/partners/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartner(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });

  // Email Templates CRUD (admin only)
  app.get("/api/admin/email-templates", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const templates = await storage.getAllEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  app.post("/api/admin/email-templates", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const template = await storage.createEmailTemplate(req.body);
      res.json(template);
    } catch (error) {
      console.error("Error creating email template:", error);
      res.status(500).json({ error: "Failed to create email template" });
    }
  });

  app.put("/api/admin/email-templates/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateEmailTemplate(id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating email template:", error);
      res.status(500).json({ error: "Failed to update email template" });
    }
  });

  app.delete("/api/admin/email-templates/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmailTemplate(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting email template:", error);
      res.status(500).json({ error: "Failed to delete email template" });
    }
  });

  // Email Workflow Routes (Admin only)
  app.get("/api/admin/workflows", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const workflows = await storage.getAllEmailWorkflows();
      // Get steps for each workflow
      const workflowsWithSteps = await Promise.all(
        workflows.map(async (workflow) => {
          const steps = await storage.getWorkflowSteps(workflow.id);
          return { ...workflow, steps };
        })
      );
      res.json(workflowsWithSteps);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.get("/api/admin/workflows/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getEmailWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      const steps = await storage.getWorkflowSteps(id);
      res.json({ ...workflow, steps });
    } catch (error) {
      console.error("Error fetching workflow:", error);
      res.status(500).json({ error: "Failed to fetch workflow" });
    }
  });

  app.post("/api/admin/workflows", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { steps, ...workflowData } = req.body;
      const workflow = await storage.createEmailWorkflow(workflowData);
      
      // Create steps if provided
      if (steps && Array.isArray(steps)) {
        for (const step of steps) {
          await storage.createWorkflowStep({
            ...step,
            workflowId: workflow.id
          });
        }
      }
      
      const createdSteps = await storage.getWorkflowSteps(workflow.id);
      res.json({ ...workflow, steps: createdSteps });
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ error: "Failed to create workflow" });
    }
  });

  app.put("/api/admin/workflows/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const { steps, ...workflowData } = req.body;
      
      const workflow = await storage.updateEmailWorkflow(id, workflowData);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      
      // Handle steps update - delete existing and recreate
      if (steps && Array.isArray(steps)) {
        const existingSteps = await storage.getWorkflowSteps(id);
        for (const step of existingSteps) {
          await storage.deleteWorkflowStep(step.id);
        }
        for (const step of steps) {
          await storage.createWorkflowStep({
            ...step,
            workflowId: id
          });
        }
      }
      
      const updatedSteps = await storage.getWorkflowSteps(id);
      res.json({ ...workflow, steps: updatedSteps });
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ error: "Failed to update workflow" });
    }
  });

  app.delete("/api/admin/workflows/:id", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmailWorkflow(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ error: "Failed to delete workflow" });
    }
  });

  app.post("/api/admin/workflows/:id/toggle", async (req, res) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getEmailWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      const updated = await storage.updateEmailWorkflow(id, { isActive: !workflow.isActive });
      res.json(updated);
    } catch (error) {
      console.error("Error toggling workflow:", error);
      res.status(500).json({ error: "Failed to toggle workflow" });
    }
  });

  return httpServer;
}
