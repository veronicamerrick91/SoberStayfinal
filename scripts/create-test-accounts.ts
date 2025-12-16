import { db } from "../server/db";
import { users } from "../shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const accounts = [
  {
    username: "admin",
    email: "support@soberstayhomes.com",
    password: "Sincemay1991!",
    name: "Administrator",
    role: "admin" as const,
  },
  {
    username: "provider",
    email: "provider@soberstayhomes.com",
    password: "Sincemay1991!",
    name: "Test Provider",
    role: "provider" as const,
  },
  {
    username: "tenant",
    email: "tenant@soberstayhomes.com",
    password: "Sincemay1991!",
    name: "Test Tenant",
    role: "tenant" as const,
  },
];

async function createAccounts() {
  for (const account of accounts) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    
    // Check if user exists by email
    const existing = await db.select().from(users).where(eq(users.email, account.email.toLowerCase()));
    
    if (existing.length > 0) {
      // Update existing user
      await db.update(users)
        .set({ 
          password: hashedPassword,
          username: account.username,
          name: account.name,
          role: account.role
        })
        .where(eq(users.email, account.email.toLowerCase()));
      console.log(`Updated: ${account.email} (${account.role})`);
    } else {
      // Create new user
      await db.insert(users).values({
        username: account.username,
        email: account.email.toLowerCase(),
        password: hashedPassword,
        name: account.name,
        role: account.role,
      });
      console.log(`Created: ${account.email} (${account.role})`);
    }
  }
  
  console.log("\nAll accounts ready!");
  process.exit(0);
}

createAccounts().catch(console.error);
