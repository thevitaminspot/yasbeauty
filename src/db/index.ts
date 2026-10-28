import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

/**
 * App traffic uses the pooled DATABASE_URL (neon deploy / neon env pull).
 * Migrations use DATABASE_URL_UNPOOLED via drizzle.config.ts.
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  return Boolean(url && url.startsWith("postgres"));
}

function createDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  // HTTP neon() driver — fits Next.js serverless / Node route handlers
  const sql = neon(url);
  return drizzle(sql, { schema });
}

type Db = ReturnType<typeof createDb>;

let _db: Db | null = null;

/** Lazy Neon + Drizzle client — safe when DATABASE_URL is missing at build time. */
export function getDb(): Db {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export type { Db };
export { schema };
