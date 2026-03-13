import XLSX from "xlsx";
import { db } from "../server/db";
import { listings } from "../shared/schema";
import { eq, and } from "drizzle-orm";

interface DirectoryRow {
  "Company Name"?: string;
  "Company City"?: string;
  "Company State"?: string;
  "Corporate Phone"?: string;
  "Website"?: string;
  "Company Address"?: string;
}

async function importDirectory() {
  const filePath = "./attached_assets/Sober_Living_Facility_List_1773370302185.xlsx";
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rows: DirectoryRow[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(`Found ${rows.length} rows in spreadsheet`);

  const seen = new Set<string>();
  const uniqueRows: DirectoryRow[] = [];

  for (const row of rows) {
    const name = (row["Company Name"] || "").trim();
    const city = (row["Company City"] || "").trim();
    const state = (row["Company State"] || "").trim();
    if (!name || !city) continue;

    if (state && !state.toLowerCase().includes("california") && state.toLowerCase() !== "ca") continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueRows.push(row);
  }

  console.log(`${uniqueRows.length} unique California companies to import`);

  let imported = 0;
  let skipped = 0;

  for (const row of uniqueRows) {
    const companyName = (row["Company Name"] || "").trim();
    const city = (row["Company City"] || "").trim();
    const phone = (row["Corporate Phone"] || "").trim();
    const website = (row["Website"] || "").trim();
    const address = (row["Company Address"] || "").trim();

    const existing = await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.propertyName, companyName),
          eq(listings.city, city),
          eq(listings.isImported, true)
        )
      );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(listings).values({
      propertyName: companyName,
      address: address || `${city}, CA`,
      city,
      state: "California",
      description: `${companyName} is a sober living facility located in ${city}, California. Contact them directly for availability, pricing, and program details.`,
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
      phone: phone || null,
      website: website || null,
    });

    imported++;
    console.log(`  Imported: ${companyName} (${city}, CA)`);
  }

  console.log(`\nImport complete: ${imported} imported, ${skipped} skipped (already existed)`);
  process.exit(0);
}

importDirectory().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
