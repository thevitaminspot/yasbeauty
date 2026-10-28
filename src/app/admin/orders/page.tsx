import { OrdersList } from "@/components/admin/orders-list";
import { AdminPageHeader } from "@/components/admin/ui";
import { readOrders } from "@/lib/orders-store";

export const metadata = { title: "Orders" };
export const instant = false;

export default async function AdminOrdersPage() {
  const orders = await readOrders();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Shop"
        title="Orders"
        description="Move paid orders through confirmed → packed → sent → delivered."
      />
      <OrdersList orders={orders} />
    </div>
  );
}
