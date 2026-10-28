export type BookingQueue =
  | "requests"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "all";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export function bookingQueue(
  status: string,
): Exclude<BookingQueue, "all"> {
  if (status === "cancelled") return "cancelled";
  if (status === "completed") return "completed";
  if (status === "pending") return "requests";
  return "upcoming";
}

/** Preferred date (YYYY-MM-DD) + slot id like "10:30". */
export function isOverdueBooking(
  status: string,
  preferredDate: string,
  preferredTime: string,
  now = Date.now(),
) {
  if (status !== "confirmed") return false;
  const start = Date.parse(`${preferredDate}T${preferredTime}:00`);
  if (Number.isNaN(start)) return false;
  return start < now;
}
