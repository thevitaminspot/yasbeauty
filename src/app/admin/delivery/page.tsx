import { DeliveryManager } from "@/components/admin/delivery-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { readDeliverySettings } from "@/lib/delivery-store";

export const metadata = { title: "Delivery" };
export const instant = false;

export default async function AdminDeliveryPage() {
  const settings = await readDeliverySettings();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Shop"
        title="Delivery"
        description="Search and edit Abuja area fees, plus outside-Abuja and international prices."
      />
      <DeliveryManager initial={settings} />
    </div>
  );
}
