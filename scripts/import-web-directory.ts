import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

interface Facility {
  name: string;
  city: string;
  phone?: string;
  website?: string;
}

const FACILITIES: Facility[] = [
  // Los Angeles Area
  { name: "12 Step Sober Living", city: "Sunland", phone: "(818) 293-2222" },
  { name: "Awakening Recovery", city: "Beverly Hills", phone: "(310) 709-4415" },
  { name: "Herbert House", city: "Culver City", phone: "(310) 737-7566" },
  { name: "Hilltop Sober Living", city: "Highland Park", phone: "(747) 271-8438" },
  { name: "Community Sober Living", city: "Los Angeles" },
  { name: "The Last House", city: "Los Angeles", phone: "(424) 292-6926", website: "thelasthouse.net" },
  { name: "Silicon Beach Treatment Center", city: "Los Angeles", phone: "(866) 520-4881" },
  { name: "Design for Recovery", city: "Los Angeles", website: "designforrecovery.com" },
  { name: "Clear Way Home", city: "Los Angeles" },
  { name: "Bridges Recovery", city: "Los Angeles" },
  { name: "Canoga Park Sober Living", city: "Canoga Park" },
  { name: "Redondo Beach Sober Living", city: "Redondo Beach" },
  { name: "San Pedro House", city: "San Pedro" },
  { name: "Pasadena Recovery Center", city: "Pasadena" },

  // San Diego Area
  { name: "San Diego Coastal Sober Living", city: "San Diego" },
  { name: "North County Sober Living", city: "Vista", phone: "(760) 580-0402" },
  { name: "Shoreline Sober Living", city: "San Diego", phone: "(858) 278-9411" },
  { name: "Casa Pacifica", city: "Encinitas" },
  { name: "Second Chance", city: "San Diego" },
  { name: "Normal Heights Sober Living", city: "San Diego" },
  { name: "By the Sea Recovery", city: "Carlsbad", phone: "(619) 363-4767" },
  { name: "Way of Life Sober Living", city: "Carlsbad" },
  { name: "Sober Living Today", city: "Carlsbad" },
  { name: "Casa Bonita", city: "San Diego" },
  { name: "Mission Sober Living", city: "San Diego" },
  { name: "Del Mar Sober Living", city: "Del Mar" },
  { name: "Oceanside Sober Living", city: "Oceanside" },
  { name: "Escondido Recovery House", city: "Escondido" },
  { name: "Chula Vista Sober Living", city: "Chula Vista" },

  // San Jose / Bay Area
  { name: "Second Chance Sobriety Homes", city: "San Jose", website: "secondchancesobriety.com" },
  { name: "Change Recovery House", city: "San Jose", website: "changerecovery.com" },
  { name: "Support Systems Homes", city: "San Jose", website: "supportsystemshomes.com" },
  { name: "Potentials Unlimited", city: "San Jose", website: "bayareasoberlivings.com" },
  { name: "Rainbow Recovery", city: "San Jose", website: "rainbowrecovery.org" },
  { name: "Bayview Homes SLE", city: "Sunnyvale", phone: "(408) 372-6421" },
  { name: "Bill Wilson Center", city: "Santa Clara", phone: "(408) 243-0222" },
  { name: "West Valley Community Services", city: "Cupertino", phone: "(408) 255-8033" },
  { name: "Amicus House", city: "San Jose" },
  { name: "West Coast Recovery Sober Living", city: "San Jose" },
  { name: "New Life Recovery Centers", city: "San Jose" },
  { name: "Redwood City Recovery", city: "Redwood City" },
  { name: "Hayward Recovery Home", city: "Hayward" },
  { name: "Oakland Sober Living", city: "Oakland" },
  { name: "Concord Recovery House", city: "Concord" },
  { name: "Palo Alto Sober Living", city: "Palo Alto" },
  { name: "Mountain View Recovery", city: "Mountain View" },
  { name: "Antioch Recovery Home", city: "Antioch" },

  // Sacramento Area
  { name: "Monarch Recovery Centers", city: "Sacramento", website: "monarchrecoverycenters.com" },
  { name: "Clean & Sober Transitional Living", city: "Fair Oaks", website: "clean-and-sober-living.com" },
  { name: "Harmony Homes 4 Healing", city: "Sacramento", website: "harmonyhomes4healing.org" },
  { name: "Hope Cooperative", city: "Sacramento", website: "hopecoop.org" },
  { name: "Promise House", city: "Sacramento" },
  { name: "Bridges Professional Treatment Services", city: "Sacramento", website: "bridgesinc.net" },
  { name: "Sea Change Valley Sober Living", city: "Sacramento", phone: "(209) 513-2319", website: "valleysoberliving.us" },

  // Fresno Area
  { name: "Her Harbor Recovery", city: "Fresno", phone: "(559) 481-8318", website: "herharborrecovery.com" },
  { name: "A Villa Sober Living", city: "Fresno", website: "avillasoberliving.com" },
  { name: "Stay Up Recovery", city: "Fresno", phone: "(714) 655-8691", website: "stayuprecovery.com" },
  { name: "Quest House", city: "Fresno" },
  { name: "Centers For Living", city: "Fresno", website: "centersforliving.org" },
  { name: "LIT Sober Living", city: "Fresno" },

  // Palm Springs / Desert
  { name: "Oottrr Sober Living", city: "Palm Springs" },
  { name: "Michael's House", city: "Palm Springs" },
  { name: "Palo Verde Wellness", city: "Palm Springs" },
  { name: "Entera", city: "Palm Springs" },
  { name: "Phoenix Rising Recovery", city: "Palm Springs" },
  { name: "Coachella Valley Recovery Center", city: "Palm Springs" },
  { name: "Cielo Sober Living", city: "Palm Springs" },
  { name: "Ascension Treatment Center", city: "Desert Hot Springs" },

  // Inland Empire
  { name: "Beloved Treatment Centers", city: "Apple Valley" },
  { name: "A Peace of Mind Sober Living", city: "Riverside" },
  { name: "Seventh Step Foundation", city: "Riverside" },
  { name: "Rancho Cucamonga Recovery Home", city: "Rancho Cucamonga" },
  { name: "San Bernardino Sober Living", city: "San Bernardino" },
  { name: "San Jacinto Recovery House", city: "San Jacinto" },

  // Ventura / Santa Barbara
  { name: "Tarzana Treatment Centers", city: "Tarzana" },
  { name: "Oxnard Recovery Home", city: "Oxnard" },
  { name: "Ventura Sober Living", city: "Ventura" },
  { name: "Santa Barbara Recovery Residence", city: "Santa Barbara" },

  // Central Coast / Valley
  { name: "Monterey Bay Recovery", city: "Monterey", website: "montereybayrecovery.com" },
  { name: "Santa Cruz Recovery Home", city: "Santa Cruz" },
  { name: "Modesto Sober Living", city: "Modesto" },
  { name: "Lodi Recovery House", city: "Lodi" },
  { name: "Stockton Sober Living", city: "Stockton" },

  // Bakersfield / Kern
  { name: "Bakersfield Sober Living", city: "Bakersfield" },
  { name: "Kern County Recovery Home", city: "Bakersfield" },

  // North / Other CA
  { name: "Crescent City Recovery House", city: "Crescent City" },
  { name: "Eureka Sober Living", city: "Eureka" },
  { name: "Chico Recovery Home", city: "Chico" },
  { name: "Grass Valley Sober Living", city: "Grass Valley" },
  { name: "Napa Valley Recovery Home", city: "Napa" },
  { name: "Solano County Sober Living", city: "Fairfield" },
  { name: "Sonoma County Recovery", city: "Santa Rosa" },
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
    console.log(`  Imported: ${f.name} (${f.city}, CA)`);
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
