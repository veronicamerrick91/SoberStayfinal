import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertListingSchema, insertSubscriptionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail, sendEmail, sendBulkEmails, createMarketingEmailHtml } from "./email";

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
      const { email, password } = req.body;

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

  // Admin endpoints
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const users = await storage.getAllUsers();
    const safeUsers = users.map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    res.json(safeUsers);
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

  return httpServer;
}
