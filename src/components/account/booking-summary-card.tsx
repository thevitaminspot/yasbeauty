import Link from "next/link";
import {
  StatusPill,
  bookingTone,
} from "@/components/account/status-pill";
import {
  bookingStatusLabel,
  formatAccountDate,
  formatPreferredSlot,
} from "@/lib/account";
import type { BookingRequest } from "@/lib/bookings-store";
import { formatNaira } from "@/lib/format";
import { ui } from "@/lib/ui";

export function BookingSummaryCard({ booking }: { booking: BookingRequest }) {
  return (
    <article className="border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-4 md:px-6">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={bookingStatusLabel(booking.status)}
              tone={bookingTone(booking.status)}
            />
            <p className="text-sm text-neutral-500">
              Requested {formatAccountDate(booking.createdAt)}
            </p>
          </div>
          <h2 className="font-medium text-black">{booking.serviceName}</h2>
        </div>
        <p className="text-sm font-medium text-neutral-800">
          {formatPreferredSlot(booking.preferredDate, booking.preferredTime)}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-6">
        <div className="max-w-md space-y-1 text-sm text-neutral-500">
          {booking.depositAmount > 0 ? (
            <p>
              Deposit {formatNaira(booking.depositAmount / 100)} ·{" "}
              {booking.depositPaid ? "Paid" : "Unpaid"}
            </p>
          ) : null}
          <p>
            {booking.notes
              ? booking.notes
              : "No notes added with this request."}
          </p>
        </div>
        <Link
          href={`/account/bookings/${encodeURIComponent(booking.id)}`}
          className={ui.btnSecondary}
        >
          View booking
        </Link>
      </div>
    </article>
  );
}
