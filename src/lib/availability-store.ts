import "server-only";
import { asc, eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import {
  availability as availabilityTable,
  blockedDates as blockedDatesTable,
} from "@/db/schema";
import {
  availabilityFilePath,
  blockedDatesFilePath,
} from "@/lib/data-paths";
import {
  defaultAvailability,
  parseIsoDate,
  weekdayIndex,
  weekdayLabel,
  type AvailabilityConfig,
  type BlockedDate,
} from "@/lib/availability-types";

export type {
  AvailabilityConfig,
  BlockedDate,
  TimeSlot,
} from "@/lib/availability-types";
export {
  defaultAvailability,
  weekdayLabel,
  weekdayIndex,
  parseIsoDate,
} from "@/lib/availability-types";

async function readBlockedDatesFile(): Promise<BlockedDate[]> {
  try {
    const raw = await readFile(blockedDatesFilePath, "utf8");
    const parsed = JSON.parse(raw) as BlockedDate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBlockedDatesFile(rows: BlockedDate[]): Promise<void> {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  await writeFile(
    blockedDatesFilePath,
    `${JSON.stringify(sorted, null, 2)}\n`,
    "utf8",
  );
}

export async function readBlockedDates(): Promise<BlockedDate[]> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(blockedDatesTable)
      .orderBy(asc(blockedDatesTable.date));
    return rows.map((row) => ({
      id: row.id,
      date: row.date,
      reason: row.reason,
    }));
  }
  return readBlockedDatesFile();
}

export async function writeBlockedDates(rows: BlockedDate[]): Promise<void> {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));

  if (isDatabaseConfigured()) {
    const db = getDb();
    await db.delete(blockedDatesTable);
    if (sorted.length > 0) {
      await db.insert(blockedDatesTable).values(
        sorted.map((row) => ({
          id: row.id,
          date: row.date,
          reason: row.reason,
        })),
      );
    }
    return;
  }

  await writeBlockedDatesFile(sorted);
}

async function readAvailabilityFile(): Promise<AvailabilityConfig> {
  try {
    const raw = await readFile(availabilityFilePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AvailabilityConfig>;
    const openWeekdays =
      Array.isArray(parsed.openWeekdays) && parsed.openWeekdays.length === 7
        ? parsed.openWeekdays.map(Boolean)
        : [...defaultAvailability.openWeekdays];
    const slots =
      Array.isArray(parsed.slots) && parsed.slots.length > 0
        ? parsed.slots
        : [...defaultAvailability.slots];
    return { openWeekdays, slots };
  } catch {
    return {
      openWeekdays: [...defaultAvailability.openWeekdays],
      slots: [...defaultAvailability.slots],
    };
  }
}

export async function readAvailability(): Promise<AvailabilityConfig> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(availabilityTable)
      .where(eq(availabilityTable.id, "default"))
      .limit(1);

    if (rows[0]) {
      const openWeekdays =
        Array.isArray(rows[0].openWeekdays) && rows[0].openWeekdays.length === 7
          ? rows[0].openWeekdays.map(Boolean)
          : [...defaultAvailability.openWeekdays];
      const slots =
        Array.isArray(rows[0].slots) && rows[0].slots.length > 0
          ? rows[0].slots
          : [...defaultAvailability.slots];
      return { openWeekdays, slots };
    }

    const seeded = {
      openWeekdays: [...defaultAvailability.openWeekdays],
      slots: [...defaultAvailability.slots],
    };
    await db.insert(availabilityTable).values({
      id: "default",
      openWeekdays: seeded.openWeekdays,
      slots: seeded.slots,
      updatedAt: new Date(),
    });
    return seeded;
  }

  return readAvailabilityFile();
}

export async function writeAvailability(
  config: AvailabilityConfig,
): Promise<void> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db
      .insert(availabilityTable)
      .values({
        id: "default",
        openWeekdays: config.openWeekdays,
        slots: config.slots,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: availabilityTable.id,
        set: {
          openWeekdays: config.openWeekdays,
          slots: config.slots,
          updatedAt: new Date(),
        },
      });
    return;
  }

  await writeFile(
    availabilityFilePath,
    `${JSON.stringify(config, null, 2)}\n`,
    "utf8",
  );
}

export async function isDateBookable(
  date: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!parseIsoDate(date)) {
    return { ok: false, error: "Choose a valid date." };
  }

  const weekday = weekdayIndex(date);
  if (weekday === null) {
    return { ok: false, error: "Choose a valid date." };
  }

  const [availability, blocked] = await Promise.all([
    readAvailability(),
    readBlockedDates(),
  ]);

  if (!availability.openWeekdays[weekday]) {
    return {
      ok: false,
      error: `We’re closed on ${weekdayLabel(weekday)}s.`,
    };
  }

  const hit = blocked.find((row) => row.date === date);
  if (hit) {
    return {
      ok: false,
      error: hit.reason
        ? `That date is blocked (${hit.reason}).`
        : "That date is blocked.",
    };
  }

  return { ok: true };
}
