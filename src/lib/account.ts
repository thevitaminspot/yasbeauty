import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAuthEnabled } from "@/lib/auth-config";
import type { BookingRequest } from "@/lib/bookings-store";
import type { FulfillmentStatus } from "@/lib/delivery-types";

/** Require a signed-in Clerk user; redirect to sign-in with return path. */
export async function requireAccountUser(redirectPath: string) {
  if (!isAuthEnabled()) {
    redirect("/sign-in");
  }
  const user = await currentUser();
  if (!user) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`);
  }
  return user;
}

export function accountEmailsFromUser(user: {
  primaryEmailAddress?: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
}): string[] {
  const emails = [
    user.primaryEmailAddress?.emailAddress,
    ...user.emailAddresses.map((e) => e.emailAddress),
  ].filter((e): e is string => Boolean(e));

  const seen = new Set<string>();
  return emails.filter((email) => {
    const key = email.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function emailMatchesAccount(
  orderEmail: string,
  accountEmails: string[],
): boolean {
  const normalized = orderEmail.trim().toLowerCase();
  return accountEmails.some((e) => e.trim().toLowerCase() === normalized);
}

export function formatAccountDate(iso: string, withTime = false) {
  try {
    return new Intl.DateTimeFormat(
      "en-GB",
      withTime
        ? {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        : { day: "numeric", month: "short", year: "numeric" },
    ).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatPreferredSlot(date: string, time: string) {
  const datePart = date?.trim() ?? "";
  const timePart = time?.trim() ?? "";
  // Training cohorts / TBA — not a calendar day
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    if (!timePart || /^cohort$/i.test(timePart)) return datePart;
    if (!datePart) return timePart;
    return `${datePart} · ${timePart}`;
  }
  try {
    const timeLooksClock = /^\d{1,2}:\d{2}/.test(timePart);
    if (!timeLooksClock) {
      return timePart ? `${datePart} · ${timePart}` : datePart;
    }
    const parsed = new Date(`${datePart}T${timePart}:00`);
    if (Number.isNaN(parsed.getTime())) {
      return timePart ? `${datePart} · ${timePart}` : datePart;
    }
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  } catch {
    return timePart ? `${datePart} · ${timePart}` : datePart;
  }
}

export function bookingStatusLabel(status: BookingRequest["status"]) {
  switch (status) {
    case "pending":
      return "Requested";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
  }
}

export const fulfillmentSteps: {
  value: FulfillmentStatus;
  label: string;
  hint: string;
}[] = [
  { value: "confirmed", label: "Confirmed", hint: "Payment received" },
  { value: "packed", label: "Packed", hint: "Preparing your order" },
  { value: "sent", label: "On the way", hint: "Out for delivery" },
  { value: "delivered", label: "Delivered", hint: "Order complete" },
];

export function fulfillmentStepIndex(status: FulfillmentStatus) {
  return Math.max(
    0,
    fulfillmentSteps.findIndex((step) => step.value === status),
  );
}
