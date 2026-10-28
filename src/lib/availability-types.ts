export type BlockedDate = {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
};

export type TimeSlot = { id: string; label: string };

export type AvailabilityConfig = {
  /** Sunday = 0 … Saturday = 6 */
  openWeekdays: boolean[];
  slots: TimeSlot[];
};

export const defaultAvailability: AvailabilityConfig = {
  openWeekdays: [false, true, true, true, true, true, true],
  slots: [
    { id: "09:00", label: "9:00 AM" },
    { id: "10:30", label: "10:30 AM" },
    { id: "12:00", label: "12:00 PM" },
    { id: "13:30", label: "1:30 PM" },
    { id: "15:00", label: "3:00 PM" },
    { id: "16:30", label: "4:30 PM" },
  ],
};

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function weekdayLabel(day: number) {
  return weekdayNames[day] ?? `Day ${day}`;
}

export function parseIsoDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const value = new Date(Date.UTC(year, month - 1, day));
  if (
    value.getUTCFullYear() !== year ||
    value.getUTCMonth() !== month - 1 ||
    value.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

export function weekdayIndex(date: string) {
  const value = parseIsoDate(date);
  return value ? value.getUTCDay() : null;
}
