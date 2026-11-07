import "server-only";
import { asc, eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { services as servicesTable } from "@/db/schema";
import { servicesFilePath } from "@/lib/data-paths";
import {
  defaultStudioServices,
  type StudioService,
} from "@/lib/services";

function rowToService(row: typeof servicesTable.$inferSelect): StudioService {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    duration: row.duration,
    fromPrice: row.fromPrice,
    wasPrice: row.wasPrice ?? undefined,
    deposit: row.deposit ?? undefined,
    summary: row.summary,
    description: row.description,
    image: row.image,
    featured: row.featured || undefined,
  };
}

function serviceToRow(service: StudioService) {
  const wasPrice =
    typeof service.wasPrice === "number" &&
    Number.isFinite(service.wasPrice) &&
    service.wasPrice > service.fromPrice
      ? Math.round(service.wasPrice)
      : null;
  const deposit =
    typeof service.deposit === "number" && Number.isFinite(service.deposit)
      ? Math.round(service.deposit)
      : null;
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    duration: service.duration,
    fromPrice: service.fromPrice,
    wasPrice,
    deposit,
    summary: service.summary,
    description: service.description,
    image: service.image,
    featured: Boolean(service.featured),
    updatedAt: new Date(),
  };
}

async function ensureServicesSeeded(): Promise<StudioService[]> {
  const db = getDb();
  const existing = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.name));
  if (existing.length === 0) {
    const seeded = [...defaultStudioServices];
    await db.insert(servicesTable).values(seeded.map(serviceToRow));
    return seeded;
  }

  const byId = new Map(existing.map((row) => [row.id, rowToService(row)]));
  const missing = defaultStudioServices.filter((s) => !byId.has(s.id));
  if (missing.length > 0) {
    await db.insert(servicesTable).values(missing.map(serviceToRow));
    for (const service of missing) byId.set(service.id, service);
  }

  // Keep seed copy/media in sync — never overwrite admin pricing fields.
  const stale = defaultStudioServices.filter((s) => {
    const current = byId.get(s.id);
    return (
      current &&
      (current.image !== s.image ||
        current.summary !== s.summary ||
        current.description !== s.description ||
        current.name !== s.name ||
        current.duration !== s.duration ||
        Boolean(current.featured) !== Boolean(s.featured))
    );
  });
  for (const service of stale) {
    const current = byId.get(service.id)!;
    const merged: StudioService = {
      ...service,
      fromPrice: current.fromPrice,
      wasPrice: current.wasPrice,
      deposit: current.deposit,
    };
    await db
      .insert(servicesTable)
      .values(serviceToRow(merged))
      .onConflictDoUpdate({
        target: servicesTable.id,
        set: serviceToRow(merged),
      });
    byId.set(service.id, merged);
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

async function readServicesFile(): Promise<StudioService[]> {
  try {
    const raw = await readFile(servicesFilePath, "utf8");
    const parsed = JSON.parse(raw) as StudioService[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = [...defaultStudioServices];
      await writeServicesFile(seeded);
      return seeded;
    }
    const byId = new Map(parsed.map((s) => [s.id, s]));
    let changed = false;
    for (const service of defaultStudioServices) {
      const current = byId.get(service.id);
      if (!current) {
        byId.set(service.id, service);
        changed = true;
        continue;
      }
      if (
        current.image !== service.image ||
        current.name !== service.name ||
        current.summary !== service.summary ||
        current.description !== service.description ||
        current.duration !== service.duration ||
        Boolean(current.featured) !== Boolean(service.featured)
      ) {
        byId.set(service.id, {
          ...service,
          fromPrice: current.fromPrice,
          wasPrice: current.wasPrice,
          deposit: current.deposit,
        });
        changed = true;
      }
    }
    const next = [...byId.values()];
    if (changed) await writeServicesFile(next);
    return next;
  } catch {
    const seeded = [...defaultStudioServices];
    await writeServicesFile(seeded);
    return seeded;
  }
}

async function writeServicesFile(services: StudioService[]): Promise<void> {
  await writeFile(
    servicesFilePath,
    `${JSON.stringify(services, null, 2)}\n`,
    "utf8",
  );
}

export async function readServices(): Promise<StudioService[]> {
  if (isDatabaseConfigured()) {
    return ensureServicesSeeded();
  }
  return readServicesFile();
}

export async function writeServices(services: StudioService[]): Promise<void> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db.delete(servicesTable);
    if (services.length > 0) {
      await db.insert(servicesTable).values(services.map(serviceToRow));
    }
    return;
  }
  await writeServicesFile(services);
}

export async function upsertService(
  service: StudioService,
): Promise<StudioService> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const row = serviceToRow(service);
    const { id: _id, ...update } = row;
    await db
      .insert(servicesTable)
      .values(row)
      .onConflictDoUpdate({
        target: servicesTable.id,
        set: update,
      });
    return {
      ...service,
      wasPrice: row.wasPrice ?? undefined,
      deposit: row.deposit ?? undefined,
    };
  }

  const services = await readServicesFile();
  const index = services.findIndex((s) => s.id === service.id);
  const next: StudioService = {
    ...service,
    wasPrice:
      typeof service.wasPrice === "number" &&
      service.wasPrice > service.fromPrice
        ? service.wasPrice
        : undefined,
    deposit:
      typeof service.deposit === "number" ? service.deposit : undefined,
  };
  if (index >= 0) services[index] = next;
  else services.unshift(next);
  await writeServicesFile(services);
  return next;
}

export async function deleteService(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const removed = await db
      .delete(servicesTable)
      .where(eq(servicesTable.id, id))
      .returning({ id: servicesTable.id });
    return removed.length > 0;
  }

  const services = await readServicesFile();
  const next = services.filter((s) => s.id !== id);
  if (next.length === services.length) return false;
  await writeServicesFile(next);
  return true;
}

export async function getServiceBySlug(
  slug: string,
): Promise<StudioService | undefined> {
  const services = await readServices();
  return services.find((s) => s.slug === slug);
}
