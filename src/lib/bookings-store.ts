import { desc, eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { bookings as bookingsTable } from "@/db/schema";
import { bookingsFilePath } from "@/lib/data-paths";

export type BookingRequest = {
  id: string;
  serviceId: string;
  serviceName: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  /** Deposit in kobo */
  depositAmount: number;
  depositPaid: boolean;
  depositReference: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

function rowToBooking(row: typeof bookingsTable.$inferSelect): BookingRequest {
  return {
    id: row.id,
    serviceId: row.serviceId,
    serviceName: row.serviceName,
    name: row.name,
    phone: row.phone,
    email: row.email,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    notes: row.notes,
    depositAmount: row.depositAmount ?? 0,
    depositPaid: Boolean(row.depositPaid),
    depositReference: row.depositReference ?? null,
    status: row.status,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  };
}

function normalizeBooking(booking: BookingRequest): BookingRequest {
  return {
    ...booking,
    depositAmount: booking.depositAmount ?? 0,
    depositPaid: Boolean(booking.depositPaid),
    depositReference: booking.depositReference ?? null,
  };
}

async function readBookingsFile(): Promise<BookingRequest[]> {
  try {
    const raw = await readFile(bookingsFilePath, "utf8");
    const parsed = JSON.parse(raw) as BookingRequest[];
    return parsed.map(normalizeBooking);
  } catch {
    return [];
  }
}

async function writeBookingsFile(bookings: BookingRequest[]): Promise<void> {
  await writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2));
}

export async function readBookings(): Promise<BookingRequest[]> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(bookingsTable)
      .orderBy(desc(bookingsTable.createdAt));
    return rows.map(rowToBooking);
  }
  return readBookingsFile();
}

export async function readBookingsForEmail(
  email: string,
): Promise<BookingRequest[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];
  const all = await readBookings();
  return all.filter((b) => b.email.trim().toLowerCase() === normalized);
}

export async function getBookingById(
  id: string,
): Promise<BookingRequest | null> {
  const bookingId = id.trim();
  if (!bookingId) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  const bookings = await readBookingsFile();
  return bookings.find((b) => b.id === bookingId) ?? null;
}

export async function getBookingByDepositReference(
  reference: string,
): Promise<BookingRequest | null> {
  const ref = reference.trim();
  if (!ref) return null;
  const all = await readBookings();
  return all.find((b) => b.depositReference === ref) ?? null;
}

export async function appendBooking(
  entry: Omit<BookingRequest, "id" | "status" | "createdAt" | "depositPaid"> & {
    depositPaid?: boolean;
  },
): Promise<BookingRequest> {
  const record: BookingRequest = {
    ...entry,
    id: `bk_${Date.now().toString(36)}`,
    depositAmount: entry.depositAmount ?? 0,
    depositPaid: entry.depositPaid ?? false,
    depositReference: entry.depositReference ?? null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    const db = getDb();
    await db.insert(bookingsTable).values({
      id: record.id,
      serviceId: record.serviceId,
      serviceName: record.serviceName,
      name: record.name,
      phone: record.phone,
      email: record.email,
      preferredDate: record.preferredDate,
      preferredTime: record.preferredTime,
      notes: record.notes,
      depositAmount: record.depositAmount,
      depositPaid: record.depositPaid,
      depositReference: record.depositReference,
      status: record.status,
      createdAt: new Date(record.createdAt),
    });
    return record;
  }

  const bookings = await readBookingsFile();
  bookings.unshift(record);
  await writeBookingsFile(bookings);
  return record;
}

export async function setBookingDepositReference(
  bookingId: string,
  reference: string,
): Promise<BookingRequest | null> {
  const booking = await getBookingById(bookingId);
  if (!booking) return null;
  const next = { ...booking, depositReference: reference };

  if (isDatabaseConfigured()) {
    const db = getDb();
    const updated = await db
      .update(bookingsTable)
      .set({ depositReference: reference })
      .where(eq(bookingsTable.id, bookingId))
      .returning();
    return updated[0] ? rowToBooking(updated[0]) : null;
  }

  const bookings = await readBookingsFile();
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index < 0) return null;
  bookings[index] = next;
  await writeBookingsFile(bookings);
  return next;
}

export async function markBookingDepositPaid(input: {
  bookingId: string;
  reference: string;
  amount: number;
}): Promise<BookingRequest | null> {
  const booking = await getBookingById(input.bookingId);
  if (!booking) return null;
  if (booking.depositPaid) return booking;

  const next: BookingRequest = {
    ...booking,
    depositPaid: true,
    depositReference: input.reference,
    depositAmount: input.amount || booking.depositAmount,
  };

  if (isDatabaseConfigured()) {
    const db = getDb();
    const updated = await db
      .update(bookingsTable)
      .set({
        depositPaid: true,
        depositReference: next.depositReference,
        depositAmount: next.depositAmount,
      })
      .where(eq(bookingsTable.id, input.bookingId))
      .returning();
    return updated[0] ? rowToBooking(updated[0]) : null;
  }

  const bookings = await readBookingsFile();
  const index = bookings.findIndex((b) => b.id === input.bookingId);
  if (index < 0) return null;
  bookings[index] = next;
  await writeBookingsFile(bookings);
  return next;
}

export async function updateBookingStatus(
  id: string,
  status: BookingRequest["status"],
): Promise<BookingRequest | null> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const updated = await db
      .update(bookingsTable)
      .set({ status })
      .where(eq(bookingsTable.id, id))
      .returning();
    return updated[0] ? rowToBooking(updated[0]) : null;
  }

  const bookings = await readBookingsFile();
  const index = bookings.findIndex((b) => b.id === id);
  if (index < 0) return null;
  bookings[index] = { ...bookings[index], status };
  await writeBookingsFile(bookings);
  return bookings[index];
}
