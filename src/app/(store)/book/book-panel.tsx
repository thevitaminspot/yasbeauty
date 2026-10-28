import { BookingFlow } from "@/components/booking/booking-flow";
import { getServices } from "@/lib/studio-services";
import { readTrainingSettings } from "@/lib/training-store";

export async function BookPanel({
  initialServiceSlug,
}: {
  initialServiceSlug?: string;
}) {
  const [services, trainingSettings] = await Promise.all([
    getServices(),
    readTrainingSettings(),
  ]);
  return (
    <BookingFlow
      key={initialServiceSlug ?? "pick-service"}
      services={services}
      initialServiceSlug={initialServiceSlug}
      trainingSettings={trainingSettings}
    />
  );
}
