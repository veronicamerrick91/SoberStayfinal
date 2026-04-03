import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and, inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";

const CSV_PATH = path.resolve("./attached_assets/soberhousing_1775181365682.csv");

interface CsvRow {
  name: string;
  location: string;
  serves: string;
  prices: string;
  phones: string;
  website: string;
}

function parseCSV(raw: string): CsvRow[] {
  const lines = raw.split("\n");
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

    if (fields[0] && fields[1]) {
      rows.push({
        name: fields[0],
        location: fields[1],
        serves: fields[2] || "",
        prices: fields[3] || "",
        phones: fields[5] || "",
        website: fields[6] || "",
      });
    }
  }
  return rows;
}

function parseGender(serves: string): string {
  const s = serves.toLowerCase().trim();
  if (s.includes("coed") || s.includes("co-ed")) return "co-ed";
  if (s.includes("women") && s.includes("men")) return "co-ed";
  if (s.includes("women")) return "women";
  if (s.includes("men")) return "men";
  return "co-ed";
}

function parseMonthlyPrice(prices: string): number {
  if (!prices || ["varies", "price", "rbh", ""].includes(prices.toLowerCase().trim())) return 0;
  // Pull first number sequence (handles "$800-$1000" → 800, "$1,760" → 1760)
  const cleaned = prices.replace(/,/g, "").match(/\d+/);
  if (!cleaned) return 0;
  return parseInt(cleaned[0]);
}

function normalize(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Token overlap similarity — how many words match
function similarity(a: string, b: string): number {
  const wordsA = new Set(normalize(a).split(" ").filter(w => w.length > 2));
  const wordsB = new Set(normalize(b).split(" ").filter(w => w.length > 2));
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  const total = Math.max(wordsA.size, wordsB.size);
  return total === 0 ? 0 : overlap / total;
}

async function run() {
  const rawBuffer = fs.readFileSync(CSV_PATH);
  const raw = rawBuffer.toString("latin1");
  const csvRows = parseCSV(raw);
  console.log(`[CSV] Parsed ${csvRows.length} rows`);

  // Get all unverified listings
  const allUnverified = await db
    .select()
    .from(listings)
    .where(eq(listings.isClaimed, false));
  console.log(`[DB] Found ${allUnverified.length} unverified listings`);

  // Step 1: Find and delete listings added in the last merge run
  // They were added very recently — identify by checking for the new added ones
  // We'll find them by looking for listings where property name+city combo exists
  // more than once (duplicates), keeping the oldest one
  console.log("\n--- Step 1: Remove duplicates ---");
  const seen = new Map<string, typeof allUnverified[0]>();
  const toDelete: number[] = [];

  // Sort by id ascending (oldest first)
  const sorted = [...allUnverified].sort((a, b) => a.id - b.id);

  for (const listing of sorted) {
    const key = normalize(listing.propertyName) + "|" + normalize(listing.city);
    if (seen.has(key)) {
      // Duplicate — delete the newer one (current listing has higher id)
      toDelete.push(listing.id);
    } else {
      seen.set(key, listing);
    }
  }

  if (toDelete.length > 0) {
    await db.delete(listings).where(inArray(listings.id, toDelete));
    console.log(`Deleted ${toDelete.length} duplicate listings`);
  } else {
    console.log("No exact duplicates found");
  }

  // Reload after deletion
  const remaining = await db
    .select()
    .from(listings)
    .where(eq(listings.isClaimed, false));
  console.log(`Remaining unverified after dedup: ${remaining.length}`);

  // Step 2: Update gender and price from CSV for matching listings
  console.log("\n--- Step 2: Update gender and price from CSV ---");
  let updated = 0;
  let noMatch = 0;

  for (const listing of remaining) {
    let bestMatch: CsvRow | null = null;
    let bestScore = 0;

    for (const row of csvRows) {
      // City must match (normalized)
      const cityMatch = normalize(listing.city).includes(normalize(row.location)) ||
        normalize(row.location).includes(normalize(listing.city));
      if (!cityMatch) continue;

      const score = similarity(listing.propertyName, row.name);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = row;
      }
    }

    if (bestMatch && bestScore >= 0.5) {
      const gender = parseGender(bestMatch.serves);
      const monthlyPrice = parseMonthlyPrice(bestMatch.prices);

      await db.update(listings)
        .set({
          gender,
          monthlyPrice,
        })
        .where(eq(listings.id, listing.id));
      updated++;
    } else {
      noMatch++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Duplicates removed: ${toDelete.length}`);
  console.log(`Listings updated with gender+price: ${updated}`);
  console.log(`No CSV match found (unchanged): ${noMatch}`);
  console.log(`Final unverified count: ${remaining.length}`);
}

run().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
