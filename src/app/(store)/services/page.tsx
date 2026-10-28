import { ClientWorkStrip } from "@/components/client-work-strip";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { getServices } from "@/lib/studio-services";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Studio Services",
  description:
    "Book nano brows, lip blush, permanent eyeliner, consultations, and PMU training at Yas Beauty Allure Abuja.",
};

export default async function ServicesPage() {
  const studioServices = await getServices();

  return (
    <div className={`${ui.pageShell}`}>
      <PageHeader
        eyebrow="Abuja studio"
        title="Services"
        lede="Procedures and training at Yas Beauty Allure — the same pigments you shop online, applied in-studio by our team."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {studioServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            delay={Math.min(index, 5) * 70}
          />
        ))}
      </div>
      <ClientWorkStrip />
    </div>
  );
}
