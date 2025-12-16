import { type User, type InsertUser, type Listing, type InsertListing, type Subscription, type InsertSubscription, type PasswordResetToken, type TenantProfile, type InsertTenantProfile, type ProviderProfile, type InsertProviderProfile, type Application, type InsertApplication, type PromoCode, type InsertPromoCode, users, listings, subscriptions, passwordResetTokens, tenantProfiles, providerProfiles, applications, promoCodes } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, lt, isNull, or, desc, count } from "drizzle-orm";
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
  
  createListing(listing: InsertListing & { providerId: number }): Promise<Listing>;
  getListing(id: number): Promise<Listing | undefined>;
  getAllListings(): Promise<Listing[]>;
  getApprovedListings(): Promise<Listing[]>;
  getListingsByProvider(providerId: number): Promise<Listing[]>;
  updateListing(id: number, listing: Partial<InsertListing>): Promise<Listing | undefined>;
  updateListingStatus(id: number, data: { status?: string; isVisible?: boolean }): Promise<Listing | undefined>;
  deleteListing(id: number): Promise<void>;
  
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByProvider(providerId: number): Promise<Subscription | undefined>;
  
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getValidPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(id: number): Promise<void>;
  invalidateUserPasswordResetTokens(userId: number): Promise<void>;
  
  getTenantProfile(tenantId: number): Promise<TenantProfile | undefined>;
  createOrUpdateTenantProfile(tenantId: number, profile: Partial<InsertTenantProfile>): Promise<TenantProfile>;
  
  getProviderProfile(providerId: number): Promise<ProviderProfile | undefined>;
  createOrUpdateProviderProfile(providerId: number, profile: Partial<InsertProviderProfile>): Promise<ProviderProfile>;
  
  // Subscription lifecycle methods
  updateSubscription(providerId: number, data: Partial<Subscription>): Promise<Subscription | undefined>;
  updateSubscriptionById(subscriptionId: number, data: Partial<Subscription>): Promise<Subscription | undefined>;
  getSubscriptionsNeedingRenewalReminder(): Promise<Subscription[]>;
  getExpiredGracePeriodSubscriptions(): Promise<Subscription[]>;
  getAllActiveSubscriptions(): Promise<Subscription[]>;
  
  // Listing visibility methods
  hideProviderListings(providerId: number): Promise<void>;
  showProviderListings(providerId: number): Promise<void>;
  getVisibleApprovedListings(): Promise<Listing[]>;
  
  // Listing allowance
  getActiveListingCount(providerId: number): Promise<number>;
  incrementListingAllowance(providerId: number, amount: number): Promise<void>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByTenant(tenantId: number): Promise<Application[]>;
  getApplicationsByListing(listingId: number): Promise<Application[]>;
  
  // Promo Codes
  getAllPromoCodes(): Promise<PromoCode[]>;
  getActivePromoCodes(): Promise<PromoCode[]>;
  getPromoCode(id: number): Promise<PromoCode | undefined>;
  getPromoCodeByCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promo: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, data: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<void>;
  incrementPromoCodeUsage(id: number): Promise<PromoCode | undefined>;
  
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

  async createListing(insertListing: InsertListing & { providerId: number }): Promise<Listing> {
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

  async updateListingStatus(id: number, data: { status?: string; isVisible?: boolean }): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set(data as any)
      .where(eq(listings.id, id))
      .returning();
    return listing;
  }

  async deleteListing(id: number): Promise<void> {
    await db.delete(listings).where(eq(listings.id, id));
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getSubscriptionByProvider(providerId: number): Promise<Subscription | undefined> {
    // Get the most recent subscription (order by createdAt DESC)
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.providerId, providerId))
      .orderBy(desc(subscriptions.createdAt))
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

  async getProviderProfile(providerId: number): Promise<ProviderProfile | undefined> {
    const [profile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.providerId, providerId));
    return profile;
  }

  async createOrUpdateProviderProfile(providerId: number, profile: Partial<InsertProviderProfile>): Promise<ProviderProfile> {
    const existingProfile = await this.getProviderProfile(providerId);
    
    if (existingProfile) {
      const [updated] = await db
        .update(providerProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(providerProfiles.providerId, providerId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(providerProfiles)
        .values({ ...profile, providerId })
        .returning();
      return created;
    }
  }

  // Subscription lifecycle methods
  async updateSubscription(providerId: number, data: Partial<Subscription>): Promise<Subscription | undefined> {
    // First, find the most recent subscription for this provider
    const existingSubscription = await this.getSubscriptionByProvider(providerId);
    if (!existingSubscription) {
      console.log(`[Storage] No subscription found for provider ${providerId}`);
      return undefined;
    }
    
    // Update by subscription ID, not provider ID
    const [subscription] = await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, existingSubscription.id))
      .returning();
    return subscription;
  }
  
  async updateSubscriptionById(subscriptionId: number, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return subscription;
  }

  async getSubscriptionsNeedingRenewalReminder(): Promise<Subscription[]> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const now = new Date();
    
    return await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'active'),
          gt(subscriptions.currentPeriodEnd, now),
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

  async getActiveListingCount(providerId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.providerId, providerId));
    return result?.count || 0;
  }

  async incrementListingAllowance(providerId: number, amount: number): Promise<void> {
    const subscription = await this.getSubscriptionByProvider(providerId);
    if (!subscription) {
      console.log(`[Storage] No subscription found for provider ${providerId}`);
      return;
    }
    
    const newAllowance = (subscription.listingAllowance || 0) + amount;
    await this.updateSubscriptionById(subscription.id, {
      listingAllowance: newAllowance as any
    });
  }

  // Applications
  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async getApplicationsByTenant(tenantId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.tenantId, tenantId))
      .orderBy(desc(applications.createdAt));
  }

  async getApplicationsByListing(listingId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.listingId, listingId))
      .orderBy(desc(applications.createdAt));
  }

  // Promo Code methods
  async getAllPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
  }

  async getActivePromoCodes(): Promise<PromoCode[]> {
    const now = new Date();
    return await db
      .select()
      .from(promoCodes)
      .where(
        and(
          eq(promoCodes.isActive, true),
          or(
            isNull(promoCodes.expiresAt),
            gt(promoCodes.expiresAt, now)
          )
        )
      )
      .orderBy(desc(promoCodes.createdAt));
  }

  async getPromoCode(id: number): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    return promo;
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, code.toUpperCase()));
    return promo;
  }

  async createPromoCode(promo: InsertPromoCode): Promise<PromoCode> {
    const [newPromo] = await db
      .insert(promoCodes)
      .values({ ...promo, code: promo.code.toUpperCase() })
      .returning();
    return newPromo;
  }

  async updatePromoCode(id: number, data: Partial<InsertPromoCode>): Promise<PromoCode | undefined> {
    const updateData = data.code ? { ...data, code: data.code.toUpperCase() } : data;
    const [promo] = await db
      .update(promoCodes)
      .set(updateData)
      .where(eq(promoCodes.id, id))
      .returning();
    return promo;
  }

  async deletePromoCode(id: number): Promise<void> {
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
  }

  async incrementPromoCodeUsage(id: number): Promise<PromoCode | undefined> {
    const promo = await this.getPromoCode(id);
    if (!promo) return undefined;
    
    const [updated] = await db
      .update(promoCodes)
      .set({ usedCount: promo.usedCount + 1 })
      .where(eq(promoCodes.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
