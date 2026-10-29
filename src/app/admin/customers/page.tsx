import { CustomersList } from "@/components/admin/customers-list";
import { AdminPageHeader } from "@/components/admin/ui";
import { listCustomers } from "@/lib/customers";

export const metadata = { title: "Customers" };
export const instant = false;

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Customers"
        description="Everyone who ordered, booked, or messaged — copy emails for broadcasts."
      />
      <CustomersList rows={customers} />
    </div>
  );
}
