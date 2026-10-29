import "server-only";
import {
  getBookingByDepositReference,
  getBookingById,
  markBookingDepositPaid,
} from "@/lib/bookings-store";
import { sendBookingEmails } from "@/lib/mail";

export async function fulfillBookingDeposit(input: {
  reference: string;
  amount: number;
  metadata?: Record<string, unknown> | null;
}): Promise<{ ok: boolean; bookingId?: string }> {
  const meta = input.metadata ?? {};
  const bookingId = String(meta.booking_id ?? "").trim();

  let booking = bookingId ? await getBookingById(bookingId) : null;
  if (!booking) {
    booking = await getBookingByDepositReference(input.reference);
  }
  if (!booking) {
    return { ok: false };
  }

  const alreadyPaid = booking.depositPaid;
  const updated = await markBookingDepositPaid({
    bookingId: booking.id,
    reference: input.reference,
    amount: input.amount,
  });

  if (!alreadyPaid && updated) {
    try {
      await sendBookingEmails(updated);
    } catch (err) {
      console.error("[mail] booking notify failed:", err);
    }
  }

  return { ok: true, bookingId: booking.id };
}
