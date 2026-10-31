import { BookingsList } from "@/components/admin/bookings-list";
import { AdminPageHeader } from "@/components/admin/ui";
import { readBookings } from "@/lib/bookings-store";

export const metadata = { title: "Bookings" };
export const instant = false;

type PageProps = {
  searchParams: Promise<{ focus?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const rows = await readBookings();
  const { focus } = await searchParams;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Bookings"
        description="Confirm new requests, mark sessions done, or cancel. Done and cancelled bookings stay in their tabs."
      />
      <BookingsList rows={rows} focusId={focus?.trim() || undefined} />
    </div>
  );
}
