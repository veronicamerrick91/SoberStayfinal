import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and, isNull } from "drizzle-orm";
import fs from "fs";
import path from "path";

const CSV_PATH = path.resolve("./attached_assets/soberhousing_1775181365682.csv");

interface CsvRow {
  name: string;
  location: string;
  serves: string;
  prices: string;
  contactPerson: string;
  phones: string;
  website: string;
}

function parseCSV(raw: string): CsvRow[] {
  const lines = raw.split("\n");
  const header = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    rows.push({
      name: fields[0] || "",
      location: fields[1] || "",
      serves: fields[2] || "",
      prices: fields[3] || "",
      contactPerson: fields[4] || "",
      phones: fields[5] || "",
      website: fields[6] || "",
    });
  }

  return rows.filter(r => r.name && r.location);
}

function parseGender(serves: string): string {
  const s = serves.toLowerCase().trim();
  if (s.includes("coed") || s.includes("co-ed") || s.includes("women with children")) return "co-ed";
  if (s.includes("women") && s.includes("men")) return "co-ed";
  if (s.includes("women")) return "women";
  if (s.includes("men")) return "men";
  return "co-ed";
}

function parseMonthlyPrice(prices: string): number {
  if (!prices || prices.toLowerCase() === "varies" || prices.toLowerCase() === "price" || prices.toLowerCase() === "rbh") return 0;
  const cleaned = prices.replace(/[^0-9]/g, "");
  if (!cleaned) return 0;
  const n = parseInt(cleaned);
  return isNaN(n) ? 0 : n;
}

function cleanPhone(phones: string): string {
  return phones.replace(/\s+/g, " ").trim();
}

function cleanWebsite(website: string): string {
  let w = website.trim();
  if (!w) return "";
  if (!w.startsWith("http://") && !w.startsWith("https://")) {
    w = "https://" + w;
  }
  return w;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function mergeListings() {
  const rawBuffer = fs.readFileSync(CSV_PATH);
  const raw = rawBuffer.toString("latin1");
  const csvRows = parseCSV(raw);
  console.log(`[CSV] Parsed ${csvRows.length} rows`);

  const existingUnverified = await db
    .select()
    .from(listings)
    .where(eq(listings.isClaimed, false));
  console.log(`[DB] Found ${existingUnverified.length} existing unverified listings`);

  let updated = 0;
  let added = 0;
  let skipped = 0;

  for (const row of csvRows) {
    const gender = parseGender(row.serves);
    const monthlyPrice = parseMonthlyPrice(row.prices);
    const phone = cleanPhone(row.phones);
    const website = cleanWebsite(row.website);
    const city = row.location.trim();
    const name = row.name.trim();

    const normName = normalize(name);
    const normCity = normalize(city);

    const match = existingUnverified.find(l =>
      normalize(l.propertyName) === normName &&
      normalize(l.city) === normCity
    );

    if (match) {
      await db.update(listings)
        .set({
          gender,
          monthlyPrice,
          phone: phone || match.phone || null,
          website: website || match.website || null,
        })
        .where(eq(listings.id, match.id));
      updated++;
    } else {
      await db.insert(listings).values({
        propertyName: name,
        city,
        state: "CA",
        address: city + ", CA",
        description: `${name} is a sober living home located in ${city}, California.`,
        monthlyPrice,
        gender,
        roomType: "shared",
        totalBeds: 0,
        availableBeds: 0,
        supervisionType: "house_manager",
        phone: phone || null,
        website: website || null,
        status: "approved",
        isClaimed: false,
        isImported: true,
        providerId: null,
        photos: [],
        amenities: [],
        inclusions: [],
        requirements: [],
        rules: [],
        latitude: null,
        longitude: null,
        isMatFriendly: false,
        acceptsCouples: false,
        minimumStay: null,
        maximumStay: null,
        depositAmount: null,
        utilityIncluded: false,
        petFriendly: false,
        smokingAllowed: false,
        petsAllowed: false,
      });
      added++;
    }
  }

  console.log(`\n=== Merge Complete ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Added:   ${added}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total CSV rows: ${csvRows.length}`);
}

mergeListings().then(() => {
  console.log("Done.");
  process.exit(0);
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
