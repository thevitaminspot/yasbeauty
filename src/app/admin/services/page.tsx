import { ServicesManager } from "@/components/admin/services-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { readServices } from "@/lib/services-store";

export const metadata = { title: "Services" };
export const instant = false;

export default async function AdminServicesPage() {
  const services = await readServices();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Services"
        description="Manage studio procedures and training."
      />
      <ServicesManager services={services} />
    </div>
  );
}
