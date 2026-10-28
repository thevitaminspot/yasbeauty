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
    summary: row.summary,
    description: row.description,
    image: row.image,
    featured: row.featured || undefined,
  };
}

function serviceToRow(service: StudioService) {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    duration: service.duration,
    fromPrice: service.fromPrice,
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
  if (existing.length > 0) {
    return existing.map(rowToService);
  }
  const seeded = [...defaultStudioServices];
  await db.insert(servicesTable).values(seeded.map(serviceToRow));
  return seeded;
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
    return parsed;
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
    await db
      .insert(servicesTable)
      .values(serviceToRow(service))
      .onConflictDoUpdate({
        target: servicesTable.id,
        set: serviceToRow(service),
      });
    return service;
  }

  const services = await readServicesFile();
  const index = services.findIndex((s) => s.id === service.id);
  if (index >= 0) services[index] = service;
  else services.unshift(service);
  await writeServicesFile(services);
  return service;
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
