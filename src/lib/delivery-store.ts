import "server-only";
import { eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { deliverySettings as deliveryTable } from "@/db/schema";
import { deliveryFilePath } from "@/lib/data-paths";
import {
  defaultDeliverySettings,
  type DeliverySettings,
  type DeliveryZone,
  type OrderDelivery,
} from "@/lib/delivery-types";

function slugifyArea(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function normalizeSettings(raw: Partial<DeliverySettings> | null): DeliverySettings {
  const areas = Array.isArray(raw?.abujaAreas)
    ? raw!.abujaAreas
        .map((area) => ({
          id: String(area.id || slugifyArea(area.name) || `area_${Date.now()}`),
          name: String(area.name ?? "").trim(),
          price: Math.max(0, Math.round(Number(area.price) || 0)),
        }))
        .filter((area) => area.name.length > 0)
    : defaultDeliverySettings.abujaAreas;

  return {
    abujaAreas: areas.length ? areas : defaultDeliverySettings.abujaAreas,
    outOfAbujaPrice: Math.max(
      0,
      Math.round(
        Number(raw?.outOfAbujaPrice ?? defaultDeliverySettings.outOfAbujaPrice),
      ),
    ),
    internationalPrice: Math.max(
      0,
      Math.round(
        Number(
          raw?.internationalPrice ?? defaultDeliverySettings.internationalPrice,
        ),
      ),
    ),
  };
}

async function readDeliveryFile(): Promise<DeliverySettings> {
  try {
    const raw = await readFile(deliveryFilePath, "utf8");
    return normalizeSettings(JSON.parse(raw) as DeliverySettings);
  } catch {
    const seeded = defaultDeliverySettings;
    await writeFile(
      deliveryFilePath,
      `${JSON.stringify(seeded, null, 2)}\n`,
      "utf8",
    );
    return seeded;
  }
}

export async function readDeliverySettings(): Promise<DeliverySettings> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(deliveryTable)
      .where(eq(deliveryTable.id, "default"))
      .limit(1);
    if (rows[0]) {
      return normalizeSettings({
        abujaAreas: rows[0].abujaAreas,
        outOfAbujaPrice: rows[0].outOfAbujaPrice,
        internationalPrice: rows[0].internationalPrice,
      });
    }
    const seeded = defaultDeliverySettings;
    await db.insert(deliveryTable).values({
      id: "default",
      abujaAreas: seeded.abujaAreas,
      outOfAbujaPrice: seeded.outOfAbujaPrice,
      internationalPrice: seeded.internationalPrice,
      updatedAt: new Date(),
    });
    return seeded;
  }
  return readDeliveryFile();
}

export async function writeDeliverySettings(
  settings: DeliverySettings,
): Promise<DeliverySettings> {
  const next = normalizeSettings(settings);
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db
      .insert(deliveryTable)
      .values({
        id: "default",
        abujaAreas: next.abujaAreas,
        outOfAbujaPrice: next.outOfAbujaPrice,
        internationalPrice: next.internationalPrice,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: deliveryTable.id,
        set: {
          abujaAreas: next.abujaAreas,
          outOfAbujaPrice: next.outOfAbujaPrice,
          internationalPrice: next.internationalPrice,
          updatedAt: new Date(),
        },
      });
    return next;
  }
  await writeFile(
    deliveryFilePath,
    `${JSON.stringify(next, null, 2)}\n`,
    "utf8",
  );
  return next;
}

export function resolveDeliverySelection(
  settings: DeliverySettings,
  input: {
    zone: DeliveryZone;
    areaId?: string;
  },
): OrderDelivery | { error: string } {
  if (input.zone === "abuja") {
    const area =
      settings.abujaAreas.find((a) => a.id === input.areaId) ??
      settings.abujaAreas[0];
    if (!area) {
      return { error: "Choose an Abuja delivery area." };
    }
    return {
      zone: "abuja",
      areaId: area.id,
      areaName: area.name,
      fee: area.price,
    };
  }
  if (input.zone === "nigeria") {
    return {
      zone: "nigeria",
      areaName: "Outside Abuja (Nigeria)",
      fee: settings.outOfAbujaPrice,
    };
  }
  if (input.zone === "international") {
    return {
      zone: "international",
      areaName: "International",
      fee: settings.internationalPrice,
    };
  }
  return { error: "Choose a delivery option." };
}
