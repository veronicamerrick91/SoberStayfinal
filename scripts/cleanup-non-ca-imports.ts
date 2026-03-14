import { db } from "../server/db";
import { listings, listingAnalyticsEvents, listingAnalyticsDaily, claimRequests, applications, tenantFavorites, tenantViewedHomes, featuredListings } from "../shared/schema";
import { eq, and, not, or, inArray, sql } from "drizzle-orm";

async function cleanupNonCaImports() {
  const nonCaCondition = and(
    eq(listings.isImported, true),
    not(eq(listings.state, "California")),
    not(eq(listings.state, "CA"))
  );

  const before = await db
    .select({ id: listings.id, state: listings.state })
    .from(listings)
    .where(nonCaCondition);

  console.log(`Found ${before.length} non-CA imported listings to remove`);

  if (before.length === 0) {
    console.log("Nothing to clean up.");

    const remaining = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.isImported, true));
    console.log(`CA imported listings remaining: ${remaining[0]?.count ?? 0}`);
    process.exit(0);
  }

  const ids = before.map((l) => l.id);

  await db.transaction(async (tx) => {
    const r1 = await tx.delete(listingAnalyticsEvents).where(inArray(listingAnalyticsEvents.listingId, ids));
    console.log(`  Deleted ${r1.rowCount ?? 0} analytics events`);

    const r2 = await tx.delete(listingAnalyticsDaily).where(inArray(listingAnalyticsDaily.listingId, ids));
    console.log(`  Deleted ${r2.rowCount ?? 0} analytics daily records`);

    const r3 = await tx.delete(claimRequests).where(inArray(claimRequests.listingId, ids));
    console.log(`  Deleted ${r3.rowCount ?? 0} claim requests`);

    const r4 = await tx.delete(applications).where(inArray(applications.listingId, ids));
    console.log(`  Deleted ${r4.rowCount ?? 0} applications`);

    const r5 = await tx.delete(tenantFavorites).where(inArray(tenantFavorites.listingId, ids));
    console.log(`  Deleted ${r5.rowCount ?? 0} favorites`);

    const r6 = await tx.delete(tenantViewedHomes).where(inArray(tenantViewedHomes.listingId, ids));
    console.log(`  Deleted ${r6.rowCount ?? 0} viewed homes`);

    const r7 = await tx.delete(featuredListings).where(inArray(featuredListings.listingId, ids));
    console.log(`  Deleted ${r7.rowCount ?? 0} featured listings`);

    const r8 = await tx.delete(listings).where(inArray(listings.id, ids));
    console.log(`  Deleted ${r8.rowCount ?? 0} non-CA imported listings`);
  });

  const remaining = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.isImported, true));
  console.log(`\nCleanup complete. CA imported listings remaining: ${remaining[0]?.count ?? 0}`);
  process.exit(0);
}

cleanupNonCaImports().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
