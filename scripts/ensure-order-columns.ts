/**
 * Idempotent: ensure delivery workflow columns exist.
 * Usage: npm run db:ping-style — via `npx dotenv run -f .env -- tsx scripts/ensure-order-columns.ts`
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is missing");

  const sql = neon(url);
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status text NOT NULL DEFAULT 'confirmed'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery jsonb`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT ''`;
  await sql`UPDATE orders SET fulfillment_status = 'confirmed' WHERE fulfillment_status IS NULL`;

  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount integer NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_paid boolean NOT NULL DEFAULT false`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_reference text`;
  await sql`
    CREATE TABLE IF NOT EXISTS delivery_settings (
      id text PRIMARY KEY DEFAULT 'default',
      abuja_areas jsonb NOT NULL,
      out_of_abuja_price integer NOT NULL,
      international_price integer NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const cols = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'orders'
      AND column_name IN ('fulfillment_status', 'delivery', 'notes')
    ORDER BY column_name
  `;
  console.log(
    "orders columns ready:",
    cols.map((c) => c.column_name).join(", "),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
