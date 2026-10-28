import { desc, eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { orders as ordersTable } from "@/db/schema";
import { ordersFilePath } from "@/lib/data-paths";
import {
  normalizeFulfillmentStatus,
  type FulfillmentStatus,
  type OrderDelivery,
} from "@/lib/delivery-types";

export type StoredOrder = {
  reference: string;
  /** Paystack payment status */
  status: string;
  fulfillmentStatus: FulfillmentStatus;
  amount: number;
  currency: string;
  email: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: { id: string; name: string; quantity: number; unitPrice: number }[];
  delivery?: OrderDelivery | null;
  notes?: string;
  createdAt: string;
  channel: "paystack" | "whatsapp";
};

function rowToOrder(row: typeof ordersTable.$inferSelect): StoredOrder {
  return {
    reference: row.reference,
    status: row.status,
    fulfillmentStatus: normalizeFulfillmentStatus(
      row.fulfillmentStatus ?? row.status,
    ),
    amount: row.amount,
    currency: row.currency,
    email: row.email,
    customer: row.customer,
    items: row.items,
    delivery: row.delivery ?? null,
    notes: row.notes ?? "",
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
    channel: row.channel,
  };
}

function normalizeStored(order: StoredOrder): StoredOrder {
  return {
    ...order,
    fulfillmentStatus: normalizeFulfillmentStatus(
      order.fulfillmentStatus ?? order.status,
    ),
    delivery: order.delivery ?? null,
    notes: order.notes ?? "",
  };
}

async function readOrdersFile(): Promise<StoredOrder[]> {
  try {
    const raw = await readFile(ordersFilePath, "utf8");
    const parsed = JSON.parse(raw) as StoredOrder[];
    return parsed.map(normalizeStored);
  } catch {
    return [];
  }
}

export async function readOrders(): Promise<StoredOrder[]> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(200);
    return rows.map(rowToOrder);
  }
  return readOrdersFile();
}

export async function readOrdersForEmail(email: string): Promise<StoredOrder[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];
  const all = await readOrders();
  return all.filter((o) => o.email.trim().toLowerCase() === normalized);
}

export async function getOrderByReference(
  reference: string,
): Promise<StoredOrder | null> {
  const ref = reference.trim();
  if (!ref) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.reference, ref))
      .limit(1);
    return rows[0] ? rowToOrder(rows[0]) : null;
  }

  const orders = await readOrdersFile();
  return orders.find((o) => o.reference === ref) ?? null;
}

/** Returns true when the order was newly stored (false if duplicate). */
export async function appendOrder(order: StoredOrder): Promise<boolean> {
  const next = normalizeStored({
    ...order,
    fulfillmentStatus: order.fulfillmentStatus ?? "confirmed",
  });

  if (isDatabaseConfigured()) {
    const db = getDb();
    const existing = await db
      .select({ reference: ordersTable.reference })
      .from(ordersTable)
      .where(eq(ordersTable.reference, next.reference))
      .limit(1);
    if (existing.length > 0) return false;

    await db.insert(ordersTable).values({
      reference: next.reference,
      status: next.status,
      fulfillmentStatus: next.fulfillmentStatus,
      amount: next.amount,
      currency: next.currency,
      email: next.email,
      customer: next.customer,
      items: next.items,
      delivery: next.delivery ?? null,
      notes: next.notes ?? "",
      channel: next.channel,
      createdAt: new Date(next.createdAt),
    });
    return true;
  }

  const existing = await readOrdersFile();
  if (existing.some((o) => o.reference === next.reference)) return false;

  existing.unshift(next);
  await writeFile(
    ordersFilePath,
    `${JSON.stringify(existing.slice(0, 200), null, 2)}\n`,
    "utf8",
  );
  return true;
}

export async function updateOrderFulfillment(
  reference: string,
  fulfillmentStatus: FulfillmentStatus,
): Promise<StoredOrder | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const updated = await db
      .update(ordersTable)
      .set({ fulfillmentStatus })
      .where(eq(ordersTable.reference, reference))
      .returning();
    return updated[0] ? rowToOrder(updated[0]) : null;
  }

  const orders = await readOrdersFile();
  const index = orders.findIndex((o) => o.reference === reference);
  if (index < 0) return null;
  orders[index] = { ...orders[index], fulfillmentStatus };
  await writeFile(
    ordersFilePath,
    `${JSON.stringify(orders.slice(0, 200), null, 2)}\n`,
    "utf8",
  );
  return orders[index];
}
