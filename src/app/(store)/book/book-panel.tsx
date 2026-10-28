import { BookingFlow } from "@/components/booking/booking-flow";
import { getServices } from "@/lib/studio-services";

export async function BookPanel({
  initialServiceSlug,
}: {
  initialServiceSlug?: string;
}) {
  const services = await getServices();
  return (
    <BookingFlow
      key={initialServiceSlug ?? "pick-service"}
      services={services}
      initialServiceSlug={initialServiceSlug}
    />
  );
}
