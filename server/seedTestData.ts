import { db } from "./db";
import {
  users,
  listings,
  providerProfiles,
  tenantProfiles,
  applications,
  listingAnalyticsEvents,
  listingAnalyticsDaily,
  tenantFavorites,
  tenantViewedHomes,
  claimRequests,
  featuredListings,
  passwordResetTokens,
  subscriptions,
  workflowEnrollments,
  siteVisits,
} from "@shared/schema";
import { inArray, eq, and, sql, not, count } from "drizzle-orm";
import bcrypt from "bcrypt";

const TEST_PREFIX = "test_";

function testUserCondition() {
  return sql`${users.username} LIKE 'test\_%' ESCAPE '\'`;
}

export async function cleanupTestData(): Promise<{ deleted: Record<string, number> }> {
  const deleted: Record<string, number> = {};

  await db.transaction(async (tx) => {
    const testUsers = await tx
      .select({ id: users.id })
      .from(users)
      .where(testUserCondition());
    const testUserIds = testUsers.map((u) => u.id);

    if (testUserIds.length === 0) {
      return;
    }

    const testListingRows = await tx
      .select({ id: listings.id })
      .from(listings)
      .where(inArray(listings.providerId, testUserIds));
    const testListingIds = testListingRows.map((l) => l.id);

    if (testListingIds.length > 0) {
      const r1 = await tx.delete(listingAnalyticsEvents).where(inArray(listingAnalyticsEvents.listingId, testListingIds));
      deleted.analyticsEvents = r1.rowCount ?? 0;

      const r2 = await tx.delete(listingAnalyticsDaily).where(inArray(listingAnalyticsDaily.listingId, testListingIds));
      deleted.analyticsDaily = r2.rowCount ?? 0;

      const r3 = await tx.delete(featuredListings).where(inArray(featuredListings.listingId, testListingIds));
      deleted.featuredListings = r3.rowCount ?? 0;

      const r4 = await tx.delete(claimRequests).where(inArray(claimRequests.listingId, testListingIds));
      deleted.claimRequests = r4.rowCount ?? 0;

      const r5 = await tx.delete(applications).where(
        and(
          inArray(applications.listingId, testListingIds),
          inArray(applications.tenantId, testUserIds)
        )
      );
      deleted.applications = r5.rowCount ?? 0;

      const r6 = await tx.delete(tenantFavorites).where(
        and(
          inArray(tenantFavorites.listingId, testListingIds),
          inArray(tenantFavorites.tenantId, testUserIds)
        )
      );
      deleted.favorites = r6.rowCount ?? 0;

      const r7 = await tx.delete(tenantViewedHomes).where(
        and(
          inArray(tenantViewedHomes.listingId, testListingIds),
          inArray(tenantViewedHomes.tenantId, testUserIds)
        )
      );
      deleted.viewedHomes = r7.rowCount ?? 0;

      const listingsToHardDelete: number[] = [];
      const listingsToSoftDelete: number[] = [];

      for (const listingId of testListingIds) {
        const [appCount] = await tx.select({ c: count() }).from(applications).where(eq(applications.listingId, listingId));
        const [favCount] = await tx.select({ c: count() }).from(tenantFavorites).where(eq(tenantFavorites.listingId, listingId));
        const [viewCount] = await tx.select({ c: count() }).from(tenantViewedHomes).where(eq(tenantViewedHomes.listingId, listingId));

        if ((appCount?.c ?? 0) === 0 && (favCount?.c ?? 0) === 0 && (viewCount?.c ?? 0) === 0) {
          listingsToHardDelete.push(listingId);
        } else {
          listingsToSoftDelete.push(listingId);
        }
      }

      if (listingsToHardDelete.length > 0) {
        const r8 = await tx.delete(listings).where(inArray(listings.id, listingsToHardDelete));
        deleted.listings = r8.rowCount ?? 0;
      }

      if (listingsToSoftDelete.length > 0) {
        await tx
          .update(listings)
          .set({ status: "draft", isVisible: false })
          .where(inArray(listings.id, listingsToSoftDelete));
        deleted.listingsSoftDeleted = listingsToSoftDelete.length;
      }
    }

    const raeP = await tx.delete(listingAnalyticsEvents).where(inArray(listingAnalyticsEvents.providerId, testUserIds));
    deleted.analyticsEvents = (deleted.analyticsEvents ?? 0) + (raeP.rowCount ?? 0);

    const raeT = await tx.delete(listingAnalyticsEvents).where(inArray(listingAnalyticsEvents.tenantId, testUserIds));
    deleted.analyticsEvents = (deleted.analyticsEvents ?? 0) + (raeT.rowCount ?? 0);

    const radP = await tx.delete(listingAnalyticsDaily).where(inArray(listingAnalyticsDaily.providerId, testUserIds));
    deleted.analyticsDaily = (deleted.analyticsDaily ?? 0) + (radP.rowCount ?? 0);

    const ra = await tx.delete(applications).where(inArray(applications.tenantId, testUserIds));
    deleted.applications = (deleted.applications ?? 0) + (ra.rowCount ?? 0);

    const rf = await tx.delete(tenantFavorites).where(inArray(tenantFavorites.tenantId, testUserIds));
    deleted.favorites = (deleted.favorites ?? 0) + (rf.rowCount ?? 0);

    const rv = await tx.delete(tenantViewedHomes).where(inArray(tenantViewedHomes.tenantId, testUserIds));
    deleted.viewedHomes = (deleted.viewedHomes ?? 0) + (rv.rowCount ?? 0);

    const rwe = await tx.delete(workflowEnrollments).where(inArray(workflowEnrollments.userId, testUserIds));
    deleted.workflowEnrollments = rwe.rowCount ?? 0;

    const rsub = await tx.delete(subscriptions).where(inArray(subscriptions.providerId, testUserIds));
    deleted.subscriptions = rsub.rowCount ?? 0;

    const rprt = await tx.delete(passwordResetTokens).where(inArray(passwordResetTokens.userId, testUserIds));
    deleted.passwordResetTokens = rprt.rowCount ?? 0;

    const rsv = await tx.delete(siteVisits).where(inArray(siteVisits.userId, testUserIds));
    deleted.siteVisits = rsv.rowCount ?? 0;

    const rp = await tx.delete(providerProfiles).where(inArray(providerProfiles.providerId, testUserIds));
    deleted.providerProfiles = rp.rowCount ?? 0;

    const rt = await tx.delete(tenantProfiles).where(inArray(tenantProfiles.tenantId, testUserIds));
    deleted.tenantProfiles = rt.rowCount ?? 0;

    const ru = await tx.delete(users).where(inArray(users.id, testUserIds));
    deleted.users = ru.rowCount ?? 0;
  });

  return { deleted };
}

export async function seedTestData(): Promise<{ created: Record<string, number>; credentials: Record<string, { email: string; password: string }> }> {
  await cleanupTestData();

  const created: Record<string, number> = {};
  const rawPassword = "TestPass123!";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const credentials: Record<string, { email: string; password: string }> = {};

  const existingAdmins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));

  if (existingAdmins.length === 0) {
    await db
      .insert(users)
      .values({
        username: `${TEST_PREFIX}admin`,
        email: `${TEST_PREFIX}admin@example.com`,
        password: hashedPassword,
        name: "Test Admin",
        role: "admin",
      })
      .returning();
    created.users = 1;
    credentials.admin = { email: `${TEST_PREFIX}admin@example.com`, password: rawPassword };
  }

  const [providerUser] = await db
    .insert(users)
    .values({
      username: `${TEST_PREFIX}provider`,
      email: `${TEST_PREFIX}provider@example.com`,
      password: hashedPassword,
      name: "Test Provider",
      role: "provider",
    })
    .returning();

  const [tenantUser] = await db
    .insert(users)
    .values({
      username: `${TEST_PREFIX}tenant`,
      email: `${TEST_PREFIX}tenant@example.com`,
      password: hashedPassword,
      name: "Test Tenant",
      role: "tenant",
    })
    .returning();

  created.users = (created.users ?? 0) + 2;
  credentials.provider = { email: `${TEST_PREFIX}provider@example.com`, password: rawPassword };
  credentials.tenant = { email: `${TEST_PREFIX}tenant@example.com`, password: rawPassword };

  await db.insert(providerProfiles).values({
    providerId: providerUser.id,
    companyName: "Test Recovery Homes LLC",
    phone: "(555) 100-0001",
    smsOptIn: false,
    description: "A test provider organization operating sober living homes across multiple states.",
    address: "123 Test Street",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    foundedYear: 2020,
    totalBeds: 40,
    documentsVerified: true,
    verifiedAt: new Date(),
    twoFactorEnabled: false,
    isFoundingMember: false,
  });
  created.providerProfiles = 1;

  await db.insert(tenantProfiles).values({
    tenantId: tenantUser.id,
    bio: "Looking for a supportive sober living environment to continue my recovery journey.",
    phone: "(555) 200-0001",
    smsOptIn: false,
  });
  created.tenantProfiles = 1;

  const listingData = [
    {
      providerId: providerUser.id,
      propertyName: "Test Serenity House - LA",
      address: "456 Recovery Blvd",
      city: "Los Angeles",
      state: "CA",
      monthlyPrice: 1200,
      totalBeds: 8,
      gender: "male",
      roomType: "shared",
      description: "A welcoming sober living home in the heart of Los Angeles. Our structured program includes daily house meetings, weekly drug testing, and access to recovery support groups nearby.",
      amenities: ["WiFi", "Laundry", "Parking", "Kitchen", "TV"],
      inclusions: ["Utilities", "House Meetings", "Drug Testing"],
      photos: [],
      supervisionType: "house_manager",
      houseRules: ["No drugs or alcohol", "Curfew 10pm", "Weekly chores"],
      isMatFriendly: true,
      isPetFriendly: false,
      isLgbtqFriendly: true,
      isFaithBased: false,
      acceptsCouples: false,
      status: "approved",
      isVisible: true,
      isClaimed: true,
      isImported: false,
      listingTier: "basic",
    },
    {
      providerId: providerUser.id,
      propertyName: "Test New Beginnings - Miami",
      address: "789 Sunshine Ave",
      city: "Miami",
      state: "FL",
      monthlyPrice: 1500,
      totalBeds: 12,
      gender: "female",
      roomType: "private",
      description: "A beautiful women's sober living home in sunny Miami. Private rooms, pool access, and a strong community of women in recovery. Close to beaches and outpatient treatment centers.",
      amenities: ["WiFi", "Pool", "Private Rooms", "Kitchen", "Laundry", "Garden"],
      inclusions: ["Utilities", "Meals", "Transportation to Meetings"],
      photos: [],
      supervisionType: "clinical_staff",
      houseRules: ["No drugs or alcohol", "Curfew 11pm", "Attend 3 meetings per week"],
      isMatFriendly: true,
      isPetFriendly: true,
      isLgbtqFriendly: true,
      isFaithBased: false,
      acceptsCouples: false,
      status: "approved",
      isVisible: true,
      isClaimed: true,
      isImported: false,
      listingTier: "premium",
    },
    {
      providerId: providerUser.id,
      propertyName: "Test Grace Home - Denver",
      address: "321 Mountain View Dr",
      city: "Denver",
      state: "CO",
      monthlyPrice: 950,
      totalBeds: 6,
      gender: "co-ed",
      roomType: "shared",
      description: "An affordable co-ed sober living home near the Rocky Mountains. Faith-based program with optional spiritual counseling. Great for those seeking a fresh start in a new environment.",
      amenities: ["WiFi", "Kitchen", "Laundry", "Gym Access"],
      inclusions: ["Utilities", "Bible Study"],
      photos: [],
      supervisionType: "peer_run",
      houseRules: ["No drugs or alcohol", "Attend house meetings", "Maintain employment or education"],
      isMatFriendly: false,
      isPetFriendly: false,
      isLgbtqFriendly: false,
      isFaithBased: true,
      acceptsCouples: true,
      status: "approved",
      isVisible: true,
      isClaimed: true,
      isImported: false,
      listingTier: "basic",
    },
    {
      providerId: providerUser.id,
      propertyName: "Test Phoenix Rising - Austin",
      address: "555 Live Music Ln",
      city: "Austin",
      state: "TX",
      monthlyPrice: 1100,
      totalBeds: 10,
      gender: "male",
      roomType: "semi-private",
      description: "A vibrant sober living community in Austin, Texas. Strong focus on employment assistance and life skills development. Located near public transit and recovery resources.",
      amenities: ["WiFi", "Laundry", "Kitchen", "Bike Storage", "Common Area"],
      inclusions: ["Utilities", "Job Coaching", "Life Skills Workshops"],
      photos: [],
      supervisionType: "house_manager",
      houseRules: ["No drugs or alcohol", "Random drug tests", "Maintain clean living space"],
      isMatFriendly: true,
      isPetFriendly: true,
      isLgbtqFriendly: true,
      isFaithBased: false,
      acceptsCouples: false,
      status: "approved",
      isVisible: true,
      isClaimed: true,
      isImported: false,
      listingTier: "basic",
    },
  ];

  const insertedListings = await db.insert(listings).values(listingData).returning();
  created.listings = insertedListings.length;

  await db
    .insert(applications)
    .values({
      tenantId: tenantUser.id,
      listingId: insertedListings[0].id,
      applicationData: {
        sobrietyDate: "2025-06-01",
        currentSituation: "Completing outpatient treatment, looking for stable housing.",
        employmentStatus: "Part-time",
        emergencyContact: "Jane Doe - (555) 999-0000",
      },
      status: "pending",
      paymentStatus: "paid",
      hasFeeWaiver: false,
    })
    .returning();
  created.applications = 1;

  await db.insert(tenantFavorites).values([
    { tenantId: tenantUser.id, listingId: insertedListings[1].id },
    { tenantId: tenantUser.id, listingId: insertedListings[2].id },
  ]);
  created.favorites = 2;

  await db.insert(tenantViewedHomes).values(
    insertedListings.map((l) => ({
      tenantId: tenantUser.id,
      listingId: l.id,
    }))
  );
  created.viewedHomes = insertedListings.length;

  const now = new Date();
  const eventTypes = ["view", "click", "inquiry", "tour_request", "application"];
  const analyticsEvents = [];
  for (const listing of insertedListings) {
    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
      const eventsPerDay = Math.floor(Math.random() * 8) + 2;
      for (let e = 0; e < eventsPerDay; e++) {
        const eventDate = new Date(now);
        eventDate.setDate(eventDate.getDate() - daysAgo);
        eventDate.setHours(Math.floor(Math.random() * 24));
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        analyticsEvents.push({
          listingId: listing.id,
          providerId: providerUser.id,
          eventType,
          city: listing.city,
          state: listing.state,
          occurredAt: eventDate,
        });
      }
    }
  }

  const BATCH_SIZE = 100;
  for (let i = 0; i < analyticsEvents.length; i += BATCH_SIZE) {
    await db.insert(listingAnalyticsEvents).values(analyticsEvents.slice(i, i + BATCH_SIZE));
  }
  created.analyticsEvents = analyticsEvents.length;

  const dailyAnalytics = [];
  for (const listing of insertedListings) {
    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
      const eventDate = new Date(now);
      eventDate.setDate(eventDate.getDate() - daysAgo);
      eventDate.setHours(0, 0, 0, 0);
      dailyAnalytics.push({
        listingId: listing.id,
        providerId: providerUser.id,
        eventDate,
        views: Math.floor(Math.random() * 20) + 5,
        clicks: Math.floor(Math.random() * 10) + 1,
        inquiries: Math.floor(Math.random() * 3),
        tourRequests: Math.floor(Math.random() * 2),
        applications: Math.floor(Math.random() * 2),
      });
    }
  }

  for (let i = 0; i < dailyAnalytics.length; i += BATCH_SIZE) {
    await db.insert(listingAnalyticsDaily).values(dailyAnalytics.slice(i, i + BATCH_SIZE));
  }
  created.analyticsDaily = dailyAnalytics.length;

  return { created, credentials };
}
