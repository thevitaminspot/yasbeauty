/**
 * Prove Neon Postgres connectivity end-to-end.
 * Usage: npm run db:ping
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL missing — run `neon deploy` or `neon env pull`.");
  }

  const host = url.replace(/^.*@([^/]+)\/.*$/, "$1");
  const sqlClient = neon(url);
  const db = drizzle(sqlClient, { schema });

  const rows = (await sqlClient`select now()::text as now`) as {
    now: string;
  }[];
  const now = rows[0]?.now ?? "(unknown)";

  const products = await db
    .select({ id: schema.products.id })
    .from(schema.products);
  const services = await db
    .select({ id: schema.services.id })
    .from(schema.services);

  console.log("Neon ping OK");
  console.log(`  branch: ${process.env.NEON_BRANCH ?? "(unset)"}`);
  console.log(`  host:   ${host}`);
  console.log(`  now:    ${now}`);
  console.log(`  products: ${products.length}`);
  console.log(`  services: ${services.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
