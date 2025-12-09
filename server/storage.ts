import { type User, type InsertUser, type Listing, type InsertListing, type Subscription, type InsertSubscription, type PasswordResetToken, type TenantProfile, type InsertTenantProfile, users, listings, subscriptions, passwordResetTokens, tenantProfiles } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, lt, isNull, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser & { googleId?: string }): Promise<User>;
  updateUser(id: number, data: Partial<{ role: string; googleId?: string }>): Promise<User | undefined>;
  updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined>;
  updateUserStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined>;
  
  createListing(listing: InsertListing): Promise<Listing>;
  getListing(id: number): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  getApprovedListings(): Promise<Listing[]>;
  getListingsByProvider(providerId: number): Promise<Listing[]>;
  updateListing(id: number, listing: Partial<InsertListing>): Promise<Listing | undefined>;
  
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByProvider(providerId: number): Promise<Subscription | undefined>;
  
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getValidPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(id: number): Promise<void>;
  invalidateUserPasswordResetTokens(userId: number): Promise<void>;
  
  getTenantProfile(tenantId: number): Promise<TenantProfile | undefined>;
  createOrUpdateTenantProfile(tenantId: number, profile: Partial<InsertTenantProfile>): Promise<TenantProfile>;
  
  // Subscription lifecycle methods
  updateSubscription(providerId: number, data: Partial<Subscription>): Promise<Subscription | undefined>;
  getSubscriptionsNeedingRenewalReminder(): Promise<Subscription[]>;
  getExpiredGracePeriodSubscriptions(): Promise<Subscription[]>;
  getAllActiveSubscriptions(): Promise<Subscription[]>;
  
  // Listing visibility methods
  hideProviderListings(providerId: number): Promise<void>;
  showProviderListings(providerId: number): Promise<void>;
  getVisibleApprovedListings(): Promise<Listing[]>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser & { googleId?: string }): Promise<User> {
    const { googleId, ...userData } = insertUser;
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        googleId,
        role: insertUser.role ?? "tenant"
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<{ role: string; googleId?: string }>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db
      .insert(listings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async getAllListings(): Promise<Listing[]> {
    return await db.select().from(listings);
  }

  async getApprovedListings(): Promise<Listing[]> {
    return await db.select().from(listings).where(eq(listings.status, "approved"));
  }

  async getListingsByProvider(providerId: number): Promise<Listing[]> {
    return await db.select().from(listings).where(eq(listings.providerId, providerId));
  }

  async updateListing(id: number, listingData: Partial<InsertListing>): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set(listingData)
      .where(eq(listings.id, id))
      .returning();
    return listing;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getSubscriptionByProvider(providerId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.providerId, providerId))
      .orderBy(subscriptions.createdAt)
      .limit(1);
      
    return subscription;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const [resetToken] = await db
      .insert(passwordResetTokens)
      .values({ userId, token, expiresAt })
      .returning();
    return resetToken;
  }

  async getValidPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      );
    
    if (resetToken && resetToken.usedAt) {
      return undefined;
    }
    return resetToken;
  }

  async markPasswordResetTokenUsed(id: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, id));
  }

  async invalidateUserPasswordResetTokens(userId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.userId, userId));
  }

  async getTenantProfile(tenantId: number): Promise<TenantProfile | undefined> {
    const [profile] = await db
      .select()
      .from(tenantProfiles)
      .where(eq(tenantProfiles.tenantId, tenantId));
    return profile;
  }

  async createOrUpdateTenantProfile(tenantId: number, profile: Partial<InsertTenantProfile>): Promise<TenantProfile> {
    const existingProfile = await this.getTenantProfile(tenantId);
    
    if (existingProfile) {
      const [updated] = await db
        .update(tenantProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(tenantProfiles.tenantId, tenantId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(tenantProfiles)
        .values({ ...profile, tenantId })
        .returning();
      return created;
    }
  }

  // Subscription lifecycle methods
  async updateSubscription(providerId: number, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.providerId, providerId))
      .returning();
    return subscription;
  }

  async getSubscriptionsNeedingRenewalReminder(): Promise<Subscription[]> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'active'),
          lt(subscriptions.currentPeriodEnd, threeDaysFromNow),
          or(
            eq(subscriptions.renewalReminderSent, false),
            isNull(subscriptions.renewalReminderSent)
          )
        )
      );
  }

  async getExpiredGracePeriodSubscriptions(): Promise<Subscription[]> {
    const now = new Date();
    return await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'grace_period'),
          lt(subscriptions.gracePeriodEndsAt, now)
        )
      );
  }

  async getAllActiveSubscriptions(): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));
  }

  // Listing visibility methods
  async hideProviderListings(providerId: number): Promise<void> {
    await db
      .update(listings)
      .set({ isVisible: false })
      .where(eq(listings.providerId, providerId));
  }

  async showProviderListings(providerId: number): Promise<void> {
    await db
      .update(listings)
      .set({ isVisible: true })
      .where(eq(listings.providerId, providerId));
  }

  async getVisibleApprovedListings(): Promise<Listing[]> {
    return await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.status, 'approved'),
          eq(listings.isVisible, true)
        )
      );
  }
}

export const storage = new DatabaseStorage();
