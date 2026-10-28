import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  StatusPill,
  bookingTone,
} from "@/components/account/status-pill";
import { PageHeader } from "@/components/page-header";
import {
  accountEmailsFromUser,
  bookingStatusLabel,
  emailMatchesAccount,
  formatAccountDate,
  formatPreferredSlot,
  requireAccountUser,
} from "@/lib/account";
import { getBookingById } from "@/lib/bookings-store";
import { formatNaira } from "@/lib/format";
import { ui } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Booking ${decodeURIComponent(id)}`,
    description: "Booking details from Yas Beauty Allure.",
  };
}

async function BookingDetailBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = decodeURIComponent(idParam);
  const user = await requireAccountUser(
    `/account/bookings/${encodeURIComponent(id)}`,
  );
  const emails = accountEmailsFromUser(user);

  const booking = await getBookingById(id);
  if (!booking || !emailMatchesAccount(booking.email, emails)) {
    notFound();
  }

  return (
    <>
      <Link href="/account/bookings" className={ui.btnGhost}>
        ← All bookings
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Booking"
          title={booking.serviceName}
          lede={`Requested ${formatAccountDate(booking.createdAt, true)}`}
        />
        <StatusPill
          label={bookingStatusLabel(booking.status)}
          tone={bookingTone(booking.status)}
        />
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className={ui.panel}>
          <h2 className={`${ui.eyebrow} text-black`}>Appointment</h2>
          <p className="mt-4 text-lg font-medium">
            {formatPreferredSlot(booking.preferredDate, booking.preferredTime)}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Preferred slot — we’ll confirm availability by email or phone.
          </p>
          {booking.depositAmount > 0 ? (
            <p className="mt-4 text-sm text-neutral-700">
              Deposit {formatNaira(booking.depositAmount / 100)} ·{" "}
              {booking.depositPaid ? "Paid" : "Unpaid"}
              {booking.depositReference ? (
                <span className="mt-1 block font-mono text-xs text-neutral-500">
                  {booking.depositReference}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className={ui.panel}>
          <h2 className={`${ui.eyebrow} text-black`}>Contact</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="mt-1 font-medium">{booking.name}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Email</dt>
              <dd className="mt-1">{booking.email}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd className="mt-1">{booking.phone}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`${ui.panel} mt-6`}>
        <h2 className={`${ui.eyebrow} text-black`}>Notes</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700">
          {booking.notes?.trim()
            ? booking.notes
            : "No notes were added with this request."}
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/book" className={ui.btnSecondary}>
          Book again
        </Link>
        <Link href="/account/bookings" className={ui.btnGhost}>
          Back to bookings
        </Link>
      </div>
    </>
  );
}

export default function AccountBookingDetailPage({ params }: PageProps) {
  return (
    <div className={ui.pageShell}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <BookingDetailBody params={params} />
      </Suspense>
    </div>
  );
}
