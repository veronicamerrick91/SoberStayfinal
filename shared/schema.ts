import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("tenant").notNull(),
  googleId: text("google_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  emailOptOut: boolean("email_opt_out").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => users.id),
  propertyName: text("property_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  totalBeds: integer("total_beds").notNull(),
  gender: text("gender").notNull(),
  roomType: text("room_type").notNull(),
  description: text("description").notNull(),
  amenities: jsonb("amenities").$type<string[]>().notNull(),
  inclusions: jsonb("inclusions").$type<string[]>().notNull(),
  photos: jsonb("photos").$type<string[]>().notNull(),
  supervisionType: text("supervision_type").notNull(),
  isMatFriendly: boolean("is_mat_friendly").default(false).notNull(),
  isPetFriendly: boolean("is_pet_friendly").default(false).notNull(),
  isLgbtqFriendly: boolean("is_lgbtq_friendly").default(false).notNull(),
  isFaithBased: boolean("is_faith_based").default(false).notNull(),
  acceptsCouples: boolean("accepts_couples").default(false).notNull(),
  status: text("status").default("draft").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => users.id),
  status: text("status").notNull(), // active, canceled, past_due, grace_period
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  paymentMethod: text("payment_method").notNull(), // debit, paypal, applepay
  listingAllowance: integer("listing_allowance").default(0).notNull(),
  hasFeeWaiver: boolean("has_fee_waiver").default(false).notNull(),
  gracePeriodEndsAt: timestamp("grace_period_ends_at"),
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tenantProfiles = pgTable("tenant_profiles", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => users.id).unique(),
  profilePhotoUrl: text("profile_photo_url"),
  idPhotoUrl: text("id_photo_url"),
  applicationUrl: text("application_url"),
  applicationData: jsonb("application_data").$type<Record<string, any>>(),
  bio: text("bio"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const providerProfiles = pgTable("provider_profiles", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => users.id).unique(),
  companyName: text("company_name"),
  logoUrl: text("logo_url"),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  foundedYear: integer("founded_year"),
  totalBeds: integer("total_beds"),
  documentsVerified: boolean("documents_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  applicationData: jsonb("application_data").$type<Record<string, any>>(),
  bio: text("bio"),
  profilePhotoUrl: text("profile_photo_url"),
  idPhotoUrl: text("id_photo_url"),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // "percent" or "fixed"
  discountValue: integer("discount_value").notNull(), // percent (10 = 10%) or cents (1000 = $10)
  target: text("target").notNull(), // "providers", "tenants", "all"
  usageLimit: integer("usage_limit").default(0).notNull(), // 0 = unlimited
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const featuredListings = pgTable("featured_listings", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  providerId: integer("provider_id").notNull().references(() => users.id),
  boostLevel: integer("boost_level").notNull().default(2), // 2x, 3x, 5x visibility multiplier
  amountPaid: integer("amount_paid").notNull(), // in cents
  durationDays: integer("duration_days").notNull().default(7), // how long the feature lasts
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  providerId: true,
  createdAt: true,
  isVisible: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertTenantProfileSchema = createInsertSchema(tenantProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderProfileSchema = createInsertSchema(providerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

export const insertFeaturedListingSchema = createInsertSchema(featuredListings).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type TenantProfile = typeof tenantProfiles.$inferSelect;
export type InsertTenantProfile = z.infer<typeof insertTenantProfileSchema>;
export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type InsertProviderProfile = z.infer<typeof insertProviderProfileSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type FeaturedListing = typeof featuredListings.$inferSelect;
export type InsertFeaturedListing = z.infer<typeof insertFeaturedListingSchema>;
