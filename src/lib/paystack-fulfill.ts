import "server-only";
import type { OrderDelivery } from "@/lib/delivery-types";
import { appendOrder } from "@/lib/orders-store";
import { decrementStock } from "@/lib/products-store";

export type PaystackOrderMeta = {
  customer_name?: string;
  customer_phone?: string;
  customer_city?: string;
  customer_address?: string;
  notes?: string;
  delivery?: OrderDelivery;
  items?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
};

/** Persist a paid Paystack charge once (idempotent via order reference). */
export async function fulfillPaidPaystackOrder(input: {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  email: string;
  metadata?: PaystackOrderMeta | Record<string, unknown> | null;
}): Promise<{ created: boolean }> {
  const meta = (input.metadata ?? {}) as PaystackOrderMeta;
  const items = Array.isArray(meta.items) ? meta.items : [];
  const delivery =
    meta.delivery && typeof meta.delivery === "object" ? meta.delivery : null;
  const notes = String(meta.notes ?? "").trim();

  const created = await appendOrder({
    reference: input.reference,
    status: input.status,
    fulfillmentStatus: "confirmed",
    amount: input.amount,
    currency: input.currency,
    email: input.email,
    customer: {
      name: String(meta.customer_name ?? ""),
      phone: String(meta.customer_phone ?? ""),
      city: String(meta.customer_city ?? ""),
      address: String(meta.customer_address ?? ""),
    },
    items,
    delivery,
    notes,
    createdAt: new Date().toISOString(),
    channel: "paystack",
  });

  if (created && items.length > 0) {
    await decrementStock(
      items.map((item) => ({ id: item.id, quantity: item.quantity })),
    );
  }

  return { created };
}
