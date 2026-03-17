import { db } from '../server/db';
import { listings } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function importContacts() {
  const XLSX = (await import('xlsx')).default || await import('xlsx');
  const workbook = XLSX.readFile('attached_assets/California_Contacts_By_Company_1773710160717.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: Array<{ 'e-mail': string; 'Company Name': string; 'Phone': string }> = XLSX.utils.sheet_to_json(sheet);

  const existing = await db.select({ name: listings.propertyName }).from(listings);
  const existingNames = new Set(existing.map(e => e.name?.toLowerCase().trim()));

  const seen = new Set<string>();
  let imported = 0;
  let skipped = 0;

  const batch: any[] = [];

  for (const row of data) {
    const name = row['Company Name']?.trim();
    if (!name) { skipped++; continue; }
    
    const lowerName = name.toLowerCase();
    if (existingNames.has(lowerName) || seen.has(lowerName)) {
      skipped++;
      continue;
    }
    seen.add(lowerName);

    let phone = row['Phone']?.trim() || null;
    if (phone) {
      phone = phone.replace(/[^\d+]/g, '');
      if (!phone.startsWith('+')) phone = '+1' + phone;
    }

    batch.push({
      providerId: null,
      propertyName: name,
      address: 'California, United States',
      city: 'California',
      state: 'California',
      monthlyPrice: 0,
      totalBeds: 0,
      gender: 'co-ed' as const,
      roomType: 'shared' as const,
      description: `${name} is a recovery facility located in California. Contact them directly for availability, pricing, and program details.`,
      amenities: [],
      inclusions: [],
      photos: [],
      supervisionType: 'peer-run',
      houseRules: [],
      nearbyServices: [],
      isMatFriendly: false,
      isPetFriendly: false,
      isLgbtqFriendly: false,
      isFaithBased: false,
      acceptsCouples: false,
      status: 'approved',
      isVisible: true,
      isClaimed: false,
      isImported: true,
      listingTier: 'basic',
      phone: phone,
      website: null,
    });
  }

  if (batch.length > 0) {
    const chunkSize = 50;
    for (let i = 0; i < batch.length; i += chunkSize) {
      const chunk = batch.slice(i, i + chunkSize);
      await db.insert(listings).values(chunk);
      imported += chunk.length;
      console.log(`Imported ${imported}/${batch.length}...`);
    }
  }

  console.log(`\nDone! Imported: ${imported}, Skipped (duplicates/empty): ${skipped}`);
  process.exit(0);
}

importContacts().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
