import { type User, type InsertUser, type Listing, type InsertListing, type Subscription, type InsertSubscription, type Application, type InsertApplication, users, listings, subscriptions, applications } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser & { googleId?: string }): Promise<User>;
  updateUserStripeInfo(userId: number, stripeInfo: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }): Promise<User | undefined>;
  
  createListing(listing: InsertListing): Promise<Listing>;
  getListing(id: number): Promise<Listing | undefined>;
  getListingsByProvider(providerId: number): Promise<Listing[]>;
  updateListing(id: number, listing: Partial<InsertListing>): Promise<Listing | undefined>;
  
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByProvider(providerId: number): Promise<Subscription | undefined>;
  
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByTenant(tenantId: number): Promise<Application[]>;
  getApplicationsByListing(listingId: number): Promise<Application[]>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;

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

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser & { googleId?: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role ?? "tenant"
      })
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
      
    // In a real app we would check if it's the latest active one
    return subscription;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByTenant(tenantId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.tenantId, tenantId));
  }

  async getApplicationsByListing(listingId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.listingId, listingId));
  }

  async updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ ...applicationData, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async updateUserStripeInfo(userId: number, stripeInfo: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(stripeInfo)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
