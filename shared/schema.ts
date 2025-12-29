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
  houseRules: jsonb("house_rules").$type<string[]>().default([]),
  customHouseRules: text("custom_house_rules"),
  nearbyServices: jsonb("nearby_services").$type<string[]>().default([]),
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
  phone: text("phone"),
  smsOptIn: boolean("sms_opt_in").default(false).notNull(),
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
  smsOptIn: boolean("sms_opt_in").default(false).notNull(),
  description: text("description"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  foundedYear: integer("founded_year"),
  totalBeds: integer("total_beds"),
  documentsVerified: boolean("documents_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  verificationDocs: jsonb("verification_docs").$type<Record<string, string>>().default({}),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  applicationData: jsonb("data").$type<Record<string, any>>(),
  status: text("status").default("draft").notNull(), // draft, pending, approved, rejected
  paymentStatus: text("payment_status").default("unpaid").notNull(), // unpaid, paid
  hasFeeWaiver: boolean("has_fee_waiver").default(false).notNull(),
  moveInDate: timestamp("move_in_date"),
  moveInReminderSent: boolean("move_in_reminder_sent").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const tenantFavorites = pgTable("tenant_favorites", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tenantViewedHomes = pgTable("tenant_viewed_homes", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => users.id),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// Analytics tracking tables
export const listingAnalyticsEvents = pgTable("listing_analytics_events", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  providerId: integer("provider_id").notNull().references(() => users.id),
  tenantId: integer("tenant_id").references(() => users.id), // nullable for anonymous
  eventType: text("event_type").notNull(), // view, click, inquiry, tour_request, application
  city: text("city"), // geo context
  state: text("state"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const listingAnalyticsDaily = pgTable("listing_analytics_daily", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  providerId: integer("provider_id").notNull().references(() => users.id),
  eventDate: timestamp("event_date").notNull(),
  views: integer("views").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  inquiries: integer("inquiries").default(0).notNull(),
  tourRequests: integer("tour_requests").default(0).notNull(),
  applications: integer("applications").default(0).notNull(),
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

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // organization, treatment, blog, hotline, association
  description: text("description").notNull(),
  website: text("website").notNull(),
  focus: jsonb("focus").$type<string[]>().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status").default("draft").notNull(), // draft, published, scheduled
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("email"), // email, sms
  trigger: text("trigger").notNull().default("none"), // none, on-signup, on-application-approved, on-application-denied, weekly, monthly, 7-days-before-renewal
  audience: text("audience").notNull().default("all"), // all, tenants, providers
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  usageCount: true,
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
export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type InsertProviderProfile = z.infer<typeof insertProviderProfileSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type FeaturedListing = typeof featuredListings.$inferSelect;
export type InsertFeaturedListing = z.infer<typeof insertFeaturedListingSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type TenantFavorite = typeof tenantFavorites.$inferSelect;
export type TenantViewedHome = typeof tenantViewedHomes.$inferSelect;

export const insertListingAnalyticsEventSchema = createInsertSchema(listingAnalyticsEvents).omit({
  id: true,
  occurredAt: true,
});

export const insertListingAnalyticsDailySchema = createInsertSchema(listingAnalyticsDaily).omit({
  id: true,
});

export type ListingAnalyticsEvent = typeof listingAnalyticsEvents.$inferSelect;
export type InsertListingAnalyticsEvent = z.infer<typeof insertListingAnalyticsEventSchema>;
export type ListingAnalyticsDaily = typeof listingAnalyticsDaily.$inferSelect;
export type InsertListingAnalyticsDaily = z.infer<typeof insertListingAnalyticsDailySchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;

// Email Workflows - multi-step automated email sequences
export const emailWorkflows = pgTable("email_workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: text("trigger").notNull(), // on-provider-signup, on-tenant-signup, on-application-submitted, on-application-approved, manual
  audience: text("audience").notNull().default("all"), // all, tenants, providers
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => emailWorkflows.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(), // 1, 2, 3...
  delayDays: integer("delay_days").notNull().default(0), // days to wait after previous step (or enrollment for step 1)
  delayHours: integer("delay_hours").notNull().default(0), // additional hours to wait
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const workflowEnrollments = pgTable("workflow_enrollments", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => emailWorkflows.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  currentStep: integer("current_step").notNull().default(0), // 0 = just enrolled, 1 = completed step 1, etc.
  nextStepAt: timestamp("next_step_at"), // when to process the next step
  status: text("status").notNull().default("active"), // active, completed, paused, cancelled
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertEmailWorkflowSchema = createInsertSchema(emailWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkflowStepSchema = createInsertSchema(workflowSteps).omit({
  id: true,
});

export const insertWorkflowEnrollmentSchema = createInsertSchema(workflowEnrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
});

export type EmailWorkflow = typeof emailWorkflows.$inferSelect;
export type InsertEmailWorkflow = z.infer<typeof insertEmailWorkflowSchema>;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = z.infer<typeof insertWorkflowStepSchema>;
export type WorkflowEnrollment = typeof workflowEnrollments.$inferSelect;
export type InsertWorkflowEnrollment = z.infer<typeof insertWorkflowEnrollmentSchema>;
