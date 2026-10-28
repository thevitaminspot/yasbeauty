"use server";

import {
  isDateBookable,
  readAvailability,
} from "@/lib/availability-store";
import { bookingDepositNaira } from "@/lib/booking-deposit";
import { appendBooking } from "@/lib/bookings-store";
import { nairaToKobo } from "@/lib/paystack";
import { getServiceBySlug } from "@/lib/studio-services";

export async function createBookingRequest(input: {
  serviceSlug: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}) {
  const service = await getServiceBySlug(input.serviceSlug);
  if (!service) {
    return { error: "That service isn’t available." };
  }

  const name = input.name?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const preferredDate = input.preferredDate?.trim() ?? "";
  const preferredTime = input.preferredTime?.trim() ?? "";

  if (name.length < 2) return { error: "Enter your full name." };
  if (phone.length < 7) return { error: "Enter a valid phone number." };
  if (!email || !email.includes("@")) {
    return { error: "Email is required to pay your deposit." };
  }
  if (!preferredDate) return { error: "Choose a preferred date." };
  if (!preferredTime) return { error: "Choose a preferred time." };

  const bookable = await isDateBookable(preferredDate);
  if (!bookable.ok) return { error: bookable.error };

  const availability = await readAvailability();
  if (
    !availability.slots.some(
      (slot) => slot.id === preferredTime || slot.label === preferredTime,
    )
  ) {
    return { error: "Choose a preferred time from the list." };
  }

  const depositNaira = bookingDepositNaira(service);

  const booking = await appendBooking({
    serviceId: service.id,
    serviceName: service.name,
    name,
    phone,
    email,
    preferredDate,
    preferredTime:
      availability.slots.find((slot) => slot.id === preferredTime)?.label ??
      preferredTime,
    notes: input.notes?.trim() ?? "",
    depositAmount: nairaToKobo(depositNaira),
    depositReference: null,
  });

  return {
    ok: true as const,
    booking,
    depositNaira,
  };
}

export async function listPreferredSlots(date: string) {
  const bookable = await isDateBookable(date);
  if (!bookable.ok) {
    return {
      ok: false as const,
      error: bookable.error,
      slots: [] as { id: string; label: string }[],
    };
  }

  const availability = await readAvailability();
  return { ok: true as const, slots: availability.slots, error: "" };
}
