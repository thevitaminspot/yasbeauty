import { BookingsList } from "@/components/admin/bookings-list";
import { AdminPageHeader } from "@/components/admin/ui";
import { readBookings } from "@/lib/bookings-store";

export const metadata = { title: "Bookings" };
export const instant = false;

export default async function AdminBookingsPage() {
  const rows = await readBookings();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Bookings"
        description="Confirm new requests, mark sessions done, or cancel. Done and cancelled bookings stay in their tabs."
      />
      <BookingsList rows={rows} />
    </div>
  );
}
