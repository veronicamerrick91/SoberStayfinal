import XLSX from "xlsx";
import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and } from "drizzle-orm";

interface NormalizedRow {
  companyName: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  address: string;
}

const SPREADSHEET_FILES = [
  "./attached_assets/Sober_Living_Facility_List_1773370302185.xlsx",
  "./attached_assets/California_Sober_Living_List_1773461360117.xlsx",
];

function normalizeRow(raw: Record<string, unknown>): NormalizedRow {
  return {
    companyName: String(raw["Company Name"] || "").trim(),
    city: String(raw["Company City"] || "").trim(),
    state: String(raw["Company State"] || "").trim(),
    phone: String(raw["Corporate Phone"] || "").trim().replace(/^'+/, ""),
    website: String(raw["Website"] || "").trim(),
    address: String(raw["Company Address"] || "").trim(),
  };
}

function isCalifornia(state: string): boolean {
  const s = state.toLowerCase();
  return s === "ca" || s === "california" || s.includes("california");
}

async function importDirectory() {
  const seen = new Set<string>();
  const allRows: NormalizedRow[] = [];

  for (const filePath of SPREADSHEET_FILES) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);
      console.log(`[${filePath}] Found ${rawRows.length} rows`);

      for (const raw of rawRows) {
        const row = normalizeRow(raw);
        if (!row.companyName || !row.city) continue;
        if (row.state && !isCalifornia(row.state)) continue;

        const key = row.companyName.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        allRows.push(row);
      }
    } catch (err) {
      console.error(`[${filePath}] Failed to read: ${err}`);
    }
  }

  console.log(`\n${allRows.length} unique California companies across all files`);

  let imported = 0;
  let skipped = 0;

  for (const row of allRows) {
    const existing = await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.propertyName, row.companyName),
          eq(listings.city, row.city),
          eq(listings.isImported, true)
        )
      );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(listings).values({
      propertyName: row.companyName,
      address: row.address || `${row.city}, CA`,
      city: row.city,
      state: "California",
      description: `${row.companyName} is a sober living facility located in ${row.city}, California. Contact them directly for availability, pricing, and program details.`,
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
      phone: row.phone || null,
      website: row.website || null,
    });

    imported++;
    console.log(`  Imported: ${row.companyName} (${row.city}, CA)`);
  }

  console.log(`\nImport complete: ${imported} imported, ${skipped} skipped (already existed)`);
  process.exit(0);
}

importDirectory().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
