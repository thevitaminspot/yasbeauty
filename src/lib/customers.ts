import "server-only";
import { readBookings } from "@/lib/bookings-store";
import { readMessages } from "@/lib/messages-store";
import { readOrders } from "@/lib/orders-store";

export type CustomerRow = {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  bookingCount: number;
  messageCount: number;
  lastSeenAt: string;
  sources: ("order" | "booking" | "message")[];
};

function newer(a: string, b: string) {
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

export async function listCustomers(): Promise<CustomerRow[]> {
  const [orders, bookings, messages] = await Promise.all([
    readOrders(),
    readBookings(),
    readMessages(),
  ]);

  const map = new Map<string, CustomerRow>();

  function touch(
    emailRaw: string,
    patch: {
      name?: string;
      phone?: string;
      at: string;
      source: CustomerRow["sources"][number];
      order?: boolean;
      booking?: boolean;
      message?: boolean;
    },
  ) {
    const email = emailRaw.trim().toLowerCase();
    if (!email || !email.includes("@")) return;
    const existing = map.get(email);
    if (!existing) {
      map.set(email, {
        email,
        name: patch.name?.trim() || "",
        phone: patch.phone?.trim() || "",
        orderCount: patch.order ? 1 : 0,
        bookingCount: patch.booking ? 1 : 0,
        messageCount: patch.message ? 1 : 0,
        lastSeenAt: patch.at,
        sources: [patch.source],
      });
      return;
    }
    if (patch.name?.trim() && !existing.name) existing.name = patch.name.trim();
    if (patch.phone?.trim() && !existing.phone) existing.phone = patch.phone.trim();
    if (patch.order) existing.orderCount += 1;
    if (patch.booking) existing.bookingCount += 1;
    if (patch.message) existing.messageCount += 1;
    existing.lastSeenAt = newer(existing.lastSeenAt, patch.at);
    if (!existing.sources.includes(patch.source)) {
      existing.sources.push(patch.source);
    }
  }

  for (const order of orders) {
    touch(order.email, {
      name: order.customer.name,
      phone: order.customer.phone,
      at: order.createdAt,
      source: "order",
      order: true,
    });
  }

  for (const booking of bookings) {
    touch(booking.email, {
      name: booking.name,
      phone: booking.phone,
      at: booking.createdAt,
      source: "booking",
      booking: true,
    });
  }

  for (const message of messages) {
    touch(message.email, {
      name: message.name,
      phone: message.phone,
      at: message.createdAt,
      source: "message",
      message: true,
    });
  }

  return [...map.values()].sort(
    (a, b) =>
      new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
  );
}
