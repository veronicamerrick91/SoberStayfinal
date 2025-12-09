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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
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

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type TenantProfile = typeof tenantProfiles.$inferSelect;
export type InsertTenantProfile = z.infer<typeof insertTenantProfileSchema>;
