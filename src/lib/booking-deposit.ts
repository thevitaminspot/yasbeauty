import type { StudioService } from "@/lib/services";

/** Standard procedure / consult deposit (₦). */
export const BOOKING_DEPOSIT_NAIRA = 15_000;

/** Artist training deposit (₦) — full training fee held as deposit. */
export const TRAINING_DEPOSIT_NAIRA = 250_000;

export function isTrainingService(
  service: Pick<StudioService, "id" | "slug" | "name">,
) {
  const id = service.id.toLowerCase();
  const slug = service.slug.toLowerCase();
  const name = service.name.toLowerCase();
  return (
    id.includes("training") ||
    slug.includes("training") ||
    name.includes("training")
  );
}

/** Deposit due to hold the booking (₦). */
export function bookingDepositNaira(
  service: Pick<StudioService, "id" | "slug" | "name" | "fromPrice">,
) {
  if (isTrainingService(service)) {
    return TRAINING_DEPOSIT_NAIRA;
  }
  // Never charge a deposit above the listed from-price (e.g. consult at ₦15k).
  return Math.min(BOOKING_DEPOSIT_NAIRA, Math.max(0, service.fromPrice));
}
