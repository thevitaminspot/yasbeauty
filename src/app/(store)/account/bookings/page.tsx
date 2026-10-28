import Link from "next/link";
import { Suspense } from "react";
import { BookingSummaryCard } from "@/components/account/booking-summary-card";
import { PageHeader } from "@/components/page-header";
import {
  accountEmailsFromUser,
  requireAccountUser,
} from "@/lib/account";
import { readBookingsForEmail } from "@/lib/bookings-store";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "My bookings",
  description: "Your Yas Beauty Allure studio booking requests.",
};

async function BookingsBody() {
  const user = await requireAccountUser("/account/bookings");
  const emails = accountEmailsFromUser(user);

  const seen = new Set<string>();
  const bookings = (
    await Promise.all(emails.map((email) => readBookingsForEmail(email)))
  )
    .flat()
    .filter((booking) => {
      if (seen.has(booking.id)) return false;
      seen.add(booking.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My bookings"
        lede="Each studio request is listed separately. Open one for schedule and status."
      />

      {bookings.length === 0 ? (
        <div className={`${ui.panel} mt-12`}>
          <p className="text-sm text-neutral-600">No bookings yet.</p>
          <Link href="/book" className={`${ui.btnSecondary} mt-6`}>
            Book a chair
          </Link>
        </div>
      ) : (
        <div className="mt-12 space-y-5">
          {bookings.map((booking) => (
            <BookingSummaryCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </>
  );
}

export default function AccountBookingsPage() {
  return (
    <div className={ui.pageShell}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <BookingsBody />
      </Suspense>
    </div>
  );
}
