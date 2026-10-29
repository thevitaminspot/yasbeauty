"use server";

import { headers } from "next/headers";
import {
  isDateBookable,
  readAvailability,
} from "@/lib/availability-store";
import { bookingDepositNaira, isTrainingService } from "@/lib/booking-deposit";
import { appendBooking } from "@/lib/bookings-store";
import { nairaToKobo } from "@/lib/paystack";
import { enforceRateLimitFromHeaders } from "@/lib/rate-limit";
import { getServiceBySlug } from "@/lib/studio-services";
import { readTrainingSettings } from "@/lib/training-store";
import { cohortLabel } from "@/lib/training-types";

export async function createBookingRequest(input: {
  serviceSlug: string;
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  /** Training only — cohort id, or omit when mode is TBA */
  cohortId?: string;
  notes?: string;
}) {
  const rate = enforceRateLimitFromHeaders(await headers(), "booking");
  if (!rate.ok) return { error: rate.error };

  const service = await getServiceBySlug(input.serviceSlug);
  if (!service) {
    return { error: "That service isn’t available." };
  }

  const name = input.name?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const email = input.email?.trim() ?? "";

  if (name.length < 2) return { error: "Enter your full name." };
  if (phone.length < 7) return { error: "Enter a valid phone number." };
  if (!email || !email.includes("@")) {
    return { error: "Email is required to pay your deposit." };
  }

  let preferredDate = "";
  let preferredTime = "";

  if (isTrainingService(service)) {
    const training = await readTrainingSettings();
    if (training.mode === "tba") {
      preferredDate = "Will be announced";
      preferredTime = "Next cohort";
    } else {
      const cohortId = input.cohortId?.trim() ?? "";
      const cohort = training.cohorts.find((c) => c.id === cohortId);
      if (!cohort) {
        return { error: "Choose a training cohort." };
      }
      preferredDate = cohortLabel(cohort);
      preferredTime = "Cohort";
    }
  } else {
    preferredDate = input.preferredDate?.trim() ?? "";
    preferredTime = input.preferredTime?.trim() ?? "";

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

    preferredTime =
      availability.slots.find((slot) => slot.id === preferredTime)?.label ??
      preferredTime;
  }

  const depositNaira = bookingDepositNaira(service);

  const booking = await appendBooking({
    serviceId: service.id,
    serviceName: service.name,
    name,
    phone,
    email,
    preferredDate,
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
