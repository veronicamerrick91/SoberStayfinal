import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

interface Facility {
  name: string;
  city: string;
  phone?: string;
  website?: string;
  source: string;
}

const FACILITIES: Facility[] = [
  // --- Los Angeles Area ---
  // Source: soberhousedirectory.com, addicted.org, soberhousing.net
  { name: "12 Step Sober Living", city: "Sunland", phone: "(818) 293-2222", source: "soberhousedirectory.com" },
  { name: "Awakening Recovery", city: "Beverly Hills", phone: "(310) 709-4415", source: "soberhousedirectory.com" },
  { name: "Herbert House", city: "Culver City", phone: "(310) 737-7566", source: "soberhousedirectory.com" },
  { name: "Hilltop Sober Living", city: "Highland Park", phone: "(747) 271-8438", source: "soberhousedirectory.com" },
  { name: "Community Sober Living", city: "Los Angeles", source: "soberhousedirectory.com" },
  { name: "The Last House", city: "Los Angeles", phone: "(424) 292-6926", website: "thelasthouse.net", source: "thelasthouse.net" },
  { name: "Silicon Beach Treatment Center", city: "Los Angeles", phone: "(866) 520-4881", source: "soberhousedirectory.com" },
  { name: "Design for Recovery", city: "Los Angeles", website: "designforrecovery.com", source: "designforrecovery.com" },
  { name: "Clear Way Home", city: "Los Angeles", source: "soberhousedirectory.com" },
  { name: "Bridges Recovery", city: "Los Angeles", source: "soberhousedirectory.com" },

  // --- San Diego Area ---
  // Source: soberhousedirectory.com, soarr.org
  { name: "San Diego Coastal Sober Living", city: "San Diego", source: "soberhousedirectory.com" },
  { name: "North County Sober Living", city: "Vista", phone: "(760) 580-0402", source: "soarr.org" },
  { name: "Shoreline Sober Living", city: "San Diego", phone: "(858) 278-9411", source: "soberhousedirectory.com" },
  { name: "Casa Pacifica", city: "Encinitas", source: "soberhousedirectory.com" },
  { name: "Second Chance", city: "San Diego", source: "soberhousedirectory.com" },
  { name: "Normal Heights Sober Living", city: "San Diego", source: "soberhousedirectory.com" },
  { name: "By the Sea Recovery", city: "Carlsbad", phone: "(619) 363-4767", source: "soberhousedirectory.com" },
  { name: "Way of Life Sober Living", city: "Carlsbad", source: "soberhousedirectory.com" },
  { name: "Sober Living Today", city: "Carlsbad", source: "soberhousedirectory.com" },
  { name: "Casa Bonita", city: "San Diego", source: "soberhousedirectory.com" },
  { name: "Mission Sober Living", city: "San Diego", source: "soberhousedirectory.com" },
  { name: "Del Mar Sober Living", city: "Del Mar", source: "soberhousedirectory.com" },

  // --- San Jose / Bay Area ---
  // Source: soberhousedirectory.com, addicted.org, bayareasoberlivings.com
  { name: "Second Chance Sobriety Homes", city: "San Jose", website: "secondchancesobriety.com", source: "secondchancesobriety.com" },
  { name: "Change Recovery House", city: "San Jose", website: "changerecovery.com", source: "changerecovery.com" },
  { name: "Support Systems Homes", city: "San Jose", website: "supportsystemshomes.com", source: "supportsystemshomes.com" },
  { name: "Potentials Unlimited", city: "San Jose", website: "bayareasoberlivings.com", source: "bayareasoberlivings.com" },
  { name: "Rainbow Recovery", city: "San Jose", website: "rainbowrecovery.org", source: "addicted.org" },
  { name: "Bayview Homes SLE", city: "Sunnyvale", phone: "(408) 372-6421", source: "soberhousedirectory.com" },
  { name: "Bill Wilson Center", city: "Santa Clara", phone: "(408) 243-0222", source: "soberhousedirectory.com" },
  { name: "West Valley Community Services", city: "Cupertino", phone: "(408) 255-8033", source: "soberhousedirectory.com" },
  { name: "Amicus House", city: "San Jose", source: "addicted.org" },
  { name: "West Coast Recovery Sober Living", city: "San Jose", source: "addicted.org" },
  { name: "New Life Recovery Centers", city: "San Jose", source: "addicted.org" },
  { name: "LifeMoves Montgomery Street Inn", city: "San Jose", phone: "(408) 271-5160", source: "soberhousedirectory.com" },
  { name: "Genesis Project", city: "San Jose", source: "addicted.org" },

  // --- Sacramento Area ---
  // Source: addicted.org, ccapprecoveryresidences.org
  { name: "Monarch Recovery Centers", city: "Sacramento", website: "monarchrecoverycenters.com", source: "ccapprecoveryresidences.org" },
  { name: "Clean & Sober Transitional Living", city: "Fair Oaks", website: "clean-and-sober-living.com", source: "clean-and-sober-living.com" },
  { name: "Harmony Homes 4 Healing", city: "Sacramento", website: "harmonyhomes4healing.org", source: "harmonyhomes4healing.org" },
  { name: "Hope Cooperative", city: "Sacramento", website: "hopecoop.org", source: "addicted.org" },
  { name: "Promise House", city: "Sacramento", source: "addicted.org" },
  { name: "Bridges Professional Treatment Services", city: "Sacramento", website: "bridgesinc.net", source: "bridgesinc.net" },
  { name: "Sea Change Valley Sober Living", city: "Sacramento", phone: "(209) 513-2319", website: "valleysoberliving.us", source: "valleysoberliving.us" },

  // --- Fresno Area ---
  // Source: soberhousedirectory.com, addicted.org
  { name: "Her Harbor Recovery", city: "Fresno", phone: "(559) 481-8318", website: "herharborrecovery.com", source: "herharborrecovery.com" },
  { name: "A Villa Sober Living", city: "Fresno", website: "avillasoberliving.com", source: "avillasoberliving.com" },
  { name: "Stay Up Recovery", city: "Fresno", phone: "(714) 655-8691", website: "stayuprecovery.com", source: "stayuprecovery.com" },
  { name: "Quest House", city: "Fresno", source: "addicted.org" },
  { name: "Centers For Living", city: "Fresno", website: "centersforliving.org", source: "centersforliving.org" },
  { name: "LIT Sober Living", city: "Fresno", source: "addicted.org" },

  // --- Palm Springs / Desert ---
  // Source: soberhousedirectory.com, addicted.org
  { name: "Oottrr Sober Living", city: "Palm Springs", source: "soberhousedirectory.com" },
  { name: "Michael's House", city: "Palm Springs", source: "addicted.org" },
  { name: "Palo Verde Wellness", city: "Palm Springs", source: "addicted.org" },
  { name: "Entera", city: "Palm Springs", source: "addicted.org" },
  { name: "Phoenix Rising Recovery", city: "Palm Springs", source: "addicted.org" },
  { name: "Coachella Valley Recovery Center", city: "Palm Springs", source: "addicted.org" },
  { name: "Cielo Sober Living", city: "Palm Springs", source: "addicted.org" },
  { name: "Ascension Treatment Center", city: "Desert Hot Springs", source: "addicted.org" },

  // --- Inland Empire ---
  // Source: addicted.org, soberhousedirectory.com
  { name: "Beloved Treatment Centers", city: "Apple Valley", source: "addicted.org" },
  { name: "A Peace of Mind Sober Living", city: "Riverside", source: "soberhousedirectory.com" },
  { name: "Seventh Step Foundation", city: "Riverside", source: "addicted.org" },

  // --- Ventura / Other SoCal ---
  // Source: addicted.org
  { name: "Tarzana Treatment Centers", city: "Tarzana", source: "addicted.org" },

  // --- Central Coast ---
  // Source: montereybayrecovery.com, addicted.org
  { name: "Monterey Bay Recovery", city: "Monterey", website: "montereybayrecovery.com", source: "montereybayrecovery.com" },
];

async function importWebDirectory() {
  console.log(`Processing ${FACILITIES.length} facilities from web directories...\n`);

  const seen = new Set<string>();
  const deduped: Facility[] = [];
  for (const f of FACILITIES) {
    const key = f.name.toLowerCase() + "|" + f.city.toLowerCase();
    if (seen.has(key)) {
      console.log(`  Skipping duplicate in list: ${f.name} (${f.city})`);
      continue;
    }
    seen.add(key);
    deduped.push(f);
  }

  console.log(`${deduped.length} unique facilities after internal dedup\n`);

  let imported = 0;
  let skipped = 0;

  for (const f of deduped) {
    const existing = await db
      .select()
      .from(listings)
      .where(
        and(
          sql`lower(${listings.propertyName}) = ${f.name.toLowerCase()}`,
          sql`lower(${listings.city}) = ${f.city.toLowerCase()}`
        )
      );

    if (existing.length > 0) {
      console.log(`  Already exists: ${f.name} (${f.city})`);
      skipped++;
      continue;
    }

    await db.insert(listings).values({
      propertyName: f.name,
      address: `${f.city}, CA`,
      city: f.city,
      state: "California",
      description: `${f.name} is a sober living facility located in ${f.city}, California. Contact them directly for availability, pricing, and program details.`,
      monthlyPrice: 0,
      totalBeds: 0,
      gender: "co-ed",
      supervisionType: "peer-run",
      roomType: "shared",
      amenities: [],
      inclusions: [],
      photos: [],
      status: "approved",
      isVisible: true,
      isClaimed: false,
      isImported: true,
      listingTier: "basic",
      providerId: null,
      phone: f.phone || null,
      website: f.website || null,
    });

    imported++;
    console.log(`  Imported: ${f.name} (${f.city}, CA) [source: ${f.source}]`);
  }

  console.log(`\nImport complete: ${imported} imported, ${skipped} skipped (already existed)`);

  const totalImported = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.isImported, true));

  const totalAll = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings);

  console.log(`\nDatabase totals: ${totalImported[0].count} imported listings, ${totalAll[0].count} total listings`);
  process.exit(0);
}

importWebDirectory().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
