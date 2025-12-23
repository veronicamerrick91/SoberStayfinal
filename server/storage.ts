import { type User, type InsertUser, type Listing, type InsertListing, type Subscription, type InsertSubscription, type PasswordResetToken, type TenantProfile, type InsertTenantProfile, type ProviderProfile, type InsertProviderProfile, type Application, type InsertApplication, type PromoCode, type InsertPromoCode, type FeaturedListing, type InsertFeaturedListing, type BlogPost, type InsertBlogPost, type Partner, type InsertPartner, type TenantFavorite, type TenantViewedHome, type ListingAnalyticsEvent, type InsertListingAnalyticsEvent, type ListingAnalyticsDaily, users, listings, subscriptions, passwordResetTokens, tenantProfiles, providerProfiles, applications, promoCodes, featuredListings, blogPosts, partners, tenantFavorites, tenantViewedHomes, listingAnalyticsEvents, listingAnalyticsDaily } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, lt, isNull, or, desc, count, inArray, gte, lte, sql } from "drizzle-orm";
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
  updateUserEmailOptOut(id: number, emailOptOut: boolean): Promise<User | undefined>;
  
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
  isProviderVerified(providerId: number): Promise<boolean>;
  verifyProvider(providerId: number): Promise<ProviderProfile | undefined>;
  unverifyProvider(providerId: number): Promise<ProviderProfile | undefined>;
  
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
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByTenant(tenantId: number): Promise<Application[]>;
  getApplicationsByListing(listingId: number): Promise<Application[]>;
  getApplicationsByProvider(providerId: number): Promise<Application[]>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  
  // Promo Codes
  getAllPromoCodes(): Promise<PromoCode[]>;
  getActivePromoCodes(): Promise<PromoCode[]>;
  getPromoCode(id: number): Promise<PromoCode | undefined>;
  getPromoCodeByCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promo: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, data: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<void>;
  incrementPromoCodeUsage(id: number): Promise<PromoCode | undefined>;
  
  // Featured Listings
  getAllFeaturedListings(): Promise<FeaturedListing[]>;
  getActiveFeaturedListings(): Promise<FeaturedListing[]>;
  getFeaturedListing(id: number): Promise<FeaturedListing | undefined>;
  getFeaturedListingByListingId(listingId: number): Promise<FeaturedListing | undefined>;
  getFeaturedListingsByProvider(providerId: number): Promise<FeaturedListing[]>;
  createFeaturedListing(featured: InsertFeaturedListing): Promise<FeaturedListing>;
  updateFeaturedListing(id: number, data: Partial<InsertFeaturedListing>): Promise<FeaturedListing | undefined>;
  deactivateFeaturedListing(id: number): Promise<void>;
  deactivateExpiredFeaturedListings(): Promise<void>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Partners
  getAllPartners(): Promise<Partner[]>;
  getActivePartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: number): Promise<void>;
  
  // Tenant Favorites
  getTenantFavorites(tenantId: number): Promise<TenantFavorite[]>;
  addTenantFavorite(tenantId: number, listingId: number): Promise<TenantFavorite>;
  removeTenantFavorite(tenantId: number, listingId: number): Promise<void>;
  isTenantFavorite(tenantId: number, listingId: number): Promise<boolean>;
  
  // Tenant Viewed Homes
  getTenantViewedHomes(tenantId: number): Promise<TenantViewedHome[]>;
  addTenantViewedHome(tenantId: number, listingId: number): Promise<TenantViewedHome>;
  
  // Analytics
  recordAnalyticsEvent(event: InsertListingAnalyticsEvent): Promise<ListingAnalyticsEvent>;
  getProviderAnalyticsSummary(providerId: number, startDate: Date, endDate: Date): Promise<ListingAnalyticsDaily[]>;
  getProviderAnalyticsByListing(providerId: number, listingId: number, startDate: Date, endDate: Date): Promise<ListingAnalyticsDaily[]>;
  getProviderTopLocations(providerId: number, startDate: Date, endDate: Date): Promise<{city: string; state: string; count: number}[]>;
  aggregateDailyAnalytics(): Promise<void>;
  
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

  async updateUserEmailOptOut(id: number, emailOptOut: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ emailOptOut })
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

  async isProviderVerified(providerId: number): Promise<boolean> {
    const profile = await this.getProviderProfile(providerId);
    return profile?.documentsVerified ?? false;
  }

  async verifyProvider(providerId: number): Promise<ProviderProfile | undefined> {
    const existingProfile = await this.getProviderProfile(providerId);
    if (!existingProfile) {
      // Create profile with verification
      const [created] = await db
        .insert(providerProfiles)
        .values({ providerId, documentsVerified: true, verifiedAt: new Date() })
        .returning();
      return created;
    }
    const [updated] = await db
      .update(providerProfiles)
      .set({ documentsVerified: true, verifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(providerProfiles.providerId, providerId))
      .returning();
    return updated;
  }

  async unverifyProvider(providerId: number): Promise<ProviderProfile | undefined> {
    const existingProfile = await this.getProviderProfile(providerId);
    if (!existingProfile) return undefined;
    
    const [updated] = await db
      .update(providerProfiles)
      .set({ documentsVerified: false, verifiedAt: null, updatedAt: new Date() })
      .where(eq(providerProfiles.providerId, providerId))
      .returning();
    return updated;
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

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByProvider(providerId: number): Promise<Application[]> {
    const providerListings = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.providerId, providerId));
    
    const listingIds = providerListings.map(l => l.id);
    if (listingIds.length === 0) return [];
    
    return await db
      .select()
      .from(applications)
      .where(inArray(applications.listingId, listingIds))
      .orderBy(desc(applications.createdAt));
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updated] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return updated;
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

  // Featured Listings methods
  async getAllFeaturedListings(): Promise<FeaturedListing[]> {
    return await db.select().from(featuredListings).orderBy(desc(featuredListings.createdAt));
  }

  async getActiveFeaturedListings(): Promise<FeaturedListing[]> {
    const now = new Date();
    return await db
      .select()
      .from(featuredListings)
      .where(
        and(
          eq(featuredListings.isActive, true),
          gt(featuredListings.endDate, now)
        )
      )
      .orderBy(desc(featuredListings.boostLevel));
  }

  async getFeaturedListing(id: number): Promise<FeaturedListing | undefined> {
    const [featured] = await db.select().from(featuredListings).where(eq(featuredListings.id, id));
    return featured;
  }

  async getFeaturedListingByListingId(listingId: number): Promise<FeaturedListing | undefined> {
    const now = new Date();
    const [featured] = await db
      .select()
      .from(featuredListings)
      .where(
        and(
          eq(featuredListings.listingId, listingId),
          eq(featuredListings.isActive, true),
          gt(featuredListings.endDate, now)
        )
      );
    return featured;
  }

  async getFeaturedListingsByProvider(providerId: number): Promise<FeaturedListing[]> {
    return await db
      .select()
      .from(featuredListings)
      .where(eq(featuredListings.providerId, providerId))
      .orderBy(desc(featuredListings.createdAt));
  }

  async createFeaturedListing(featured: InsertFeaturedListing): Promise<FeaturedListing> {
    const [newFeatured] = await db
      .insert(featuredListings)
      .values(featured)
      .returning();
    return newFeatured;
  }

  async updateFeaturedListing(id: number, data: Partial<InsertFeaturedListing>): Promise<FeaturedListing | undefined> {
    const [featured] = await db
      .update(featuredListings)
      .set(data)
      .where(eq(featuredListings.id, id))
      .returning();
    return featured;
  }

  async deactivateFeaturedListing(id: number): Promise<void> {
    await db
      .update(featuredListings)
      .set({ isActive: false })
      .where(eq(featuredListings.id, id));
  }

  async deactivateExpiredFeaturedListings(): Promise<void> {
    const now = new Date();
    await db
      .update(featuredListings)
      .set({ isActive: false })
      .where(
        and(
          eq(featuredListings.isActive, true),
          lt(featuredListings.endDate, now)
        )
      );
  }

  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        tags: post.tags ? [...post.tags] : []
      })
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.tags) {
      updateData.tags = [...data.tags];
    }
    const [post] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Partners
  async getAllPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async getActivePartners(): Promise<Partner[]> {
    return await db.select().from(partners).where(eq(partners.isActive, true));
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db
      .insert(partners)
      .values({
        ...partner,
        focus: partner.focus ? [...partner.focus] : []
      })
      .returning();
    return newPartner;
  }

  async updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | undefined> {
    const updateData: any = { ...data };
    if (data.focus) {
      updateData.focus = [...data.focus];
    }
    const [partner] = await db
      .update(partners)
      .set(updateData)
      .where(eq(partners.id, id))
      .returning();
    return partner;
  }

  async deletePartner(id: number): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }

  // Tenant Favorites
  async getTenantFavorites(tenantId: number): Promise<TenantFavorite[]> {
    return await db.select().from(tenantFavorites).where(eq(tenantFavorites.tenantId, tenantId));
  }

  async addTenantFavorite(tenantId: number, listingId: number): Promise<TenantFavorite> {
    const existing = await db.select().from(tenantFavorites).where(
      and(eq(tenantFavorites.tenantId, tenantId), eq(tenantFavorites.listingId, listingId))
    );
    if (existing.length > 0) {
      return existing[0];
    }
    const [favorite] = await db.insert(tenantFavorites).values({ tenantId, listingId }).returning();
    return favorite;
  }

  async removeTenantFavorite(tenantId: number, listingId: number): Promise<void> {
    await db.delete(tenantFavorites).where(
      and(eq(tenantFavorites.tenantId, tenantId), eq(tenantFavorites.listingId, listingId))
    );
  }

  async isTenantFavorite(tenantId: number, listingId: number): Promise<boolean> {
    const [result] = await db.select().from(tenantFavorites).where(
      and(eq(tenantFavorites.tenantId, tenantId), eq(tenantFavorites.listingId, listingId))
    );
    return !!result;
  }

  // Tenant Viewed Homes
  async getTenantViewedHomes(tenantId: number): Promise<TenantViewedHome[]> {
    return await db.select().from(tenantViewedHomes)
      .where(eq(tenantViewedHomes.tenantId, tenantId))
      .orderBy(desc(tenantViewedHomes.viewedAt));
  }

  async addTenantViewedHome(tenantId: number, listingId: number): Promise<TenantViewedHome> {
    const existing = await db.select().from(tenantViewedHomes).where(
      and(eq(tenantViewedHomes.tenantId, tenantId), eq(tenantViewedHomes.listingId, listingId))
    );
    if (existing.length > 0) {
      await db.update(tenantViewedHomes)
        .set({ viewedAt: new Date() })
        .where(eq(tenantViewedHomes.id, existing[0].id));
      return { ...existing[0], viewedAt: new Date() };
    }
    const [viewed] = await db.insert(tenantViewedHomes).values({ tenantId, listingId }).returning();
    return viewed;
  }

  // Analytics methods
  async recordAnalyticsEvent(event: InsertListingAnalyticsEvent): Promise<ListingAnalyticsEvent> {
    const [recorded] = await db.insert(listingAnalyticsEvents).values(event).returning();
    return recorded;
  }

  async getProviderAnalyticsSummary(providerId: number, startDate: Date, endDate: Date): Promise<ListingAnalyticsDaily[]> {
    return await db.select().from(listingAnalyticsDaily)
      .where(and(
        eq(listingAnalyticsDaily.providerId, providerId),
        gte(listingAnalyticsDaily.eventDate, startDate),
        lte(listingAnalyticsDaily.eventDate, endDate)
      ))
      .orderBy(desc(listingAnalyticsDaily.eventDate));
  }

  async getProviderAnalyticsByListing(providerId: number, listingId: number, startDate: Date, endDate: Date): Promise<ListingAnalyticsDaily[]> {
    return await db.select().from(listingAnalyticsDaily)
      .where(and(
        eq(listingAnalyticsDaily.providerId, providerId),
        eq(listingAnalyticsDaily.listingId, listingId),
        gte(listingAnalyticsDaily.eventDate, startDate),
        lte(listingAnalyticsDaily.eventDate, endDate)
      ))
      .orderBy(desc(listingAnalyticsDaily.eventDate));
  }

  async getProviderTopLocations(providerId: number, startDate: Date, endDate: Date): Promise<{city: string; state: string; count: number}[]> {
    const results = await db.select({
      city: listingAnalyticsEvents.city,
      state: listingAnalyticsEvents.state,
      count: count()
    })
    .from(listingAnalyticsEvents)
    .where(and(
      eq(listingAnalyticsEvents.providerId, providerId),
      gte(listingAnalyticsEvents.occurredAt, startDate),
      lte(listingAnalyticsEvents.occurredAt, endDate),
      sql`${listingAnalyticsEvents.city} IS NOT NULL`
    ))
    .groupBy(listingAnalyticsEvents.city, listingAnalyticsEvents.state)
    .orderBy(desc(count()))
    .limit(10);
    
    return results.map(r => ({
      city: r.city || 'Unknown',
      state: r.state || 'Unknown',
      count: r.count
    }));
  }

  async aggregateDailyAnalytics(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all events from yesterday grouped by listing
    const events = await db.select({
      listingId: listingAnalyticsEvents.listingId,
      providerId: listingAnalyticsEvents.providerId,
      eventType: listingAnalyticsEvents.eventType,
      count: count()
    })
    .from(listingAnalyticsEvents)
    .where(and(
      gte(listingAnalyticsEvents.occurredAt, yesterday),
      lt(listingAnalyticsEvents.occurredAt, today)
    ))
    .groupBy(listingAnalyticsEvents.listingId, listingAnalyticsEvents.providerId, listingAnalyticsEvents.eventType);

    // Aggregate by listing
    const aggregates: Record<number, {
      listingId: number;
      providerId: number;
      views: number;
      clicks: number;
      inquiries: number;
      tourRequests: number;
      applications: number;
    }> = {};

    for (const event of events) {
      if (!aggregates[event.listingId]) {
        aggregates[event.listingId] = {
          listingId: event.listingId,
          providerId: event.providerId,
          views: 0,
          clicks: 0,
          inquiries: 0,
          tourRequests: 0,
          applications: 0
        };
      }
      const agg = aggregates[event.listingId];
      switch (event.eventType) {
        case 'view': agg.views += event.count; break;
        case 'click': agg.clicks += event.count; break;
        case 'inquiry': agg.inquiries += event.count; break;
        case 'tour_request': agg.tourRequests += event.count; break;
        case 'application': agg.applications += event.count; break;
      }
    }

    // Insert daily aggregates
    for (const agg of Object.values(aggregates)) {
      await db.insert(listingAnalyticsDaily).values({
        listingId: agg.listingId,
        providerId: agg.providerId,
        eventDate: yesterday,
        views: agg.views,
        clicks: agg.clicks,
        inquiries: agg.inquiries,
        tourRequests: agg.tourRequests,
        applications: agg.applications
      });
    }
  }
}

export const storage = new DatabaseStorage();
