import { AvailabilityManager } from "@/components/admin/availability-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import {
  readAvailability,
  readBlockedDates,
} from "@/lib/availability-store";

export const metadata = { title: "Hours" };
export const instant = false;

export default async function AdminAvailabilityPage() {
  const [availability, blocked] = await Promise.all([
    readAvailability(),
    readBlockedDates(),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Hours"
        description="Weekly open days, preferred time slots, and dates blocked from online booking."
      />
      <AvailabilityManager availability={availability} blocked={blocked} />
    </div>
  );
}
