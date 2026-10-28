"use server";

import { revalidatePath } from "next/cache";
import { revalidateCatalog, slugify } from "@/lib/admin-catalog";
import {
  readAvailability,
  readBlockedDates,
  writeAvailability,
  writeBlockedDates,
  type AvailabilityConfig,
  type TimeSlot,
} from "@/lib/availability-store";
import { uploadImage } from "@/lib/images";
import {
  updateBookingStatus,
  type BookingRequest,
} from "@/lib/bookings-store";
import type { Product, ProductCategory } from "@/lib/product-types";
import {
  deleteProduct as removeProduct,
  readProducts,
  upsertProduct,
} from "@/lib/products-store";
import type { StudioService } from "@/lib/services";
import {
  deleteService as removeService,
  readServices,
  upsertService,
} from "@/lib/services-store";
import {
  readDeliverySettings,
  writeDeliverySettings,
} from "@/lib/delivery-store";
import type {
  DeliverySettings,
  FulfillmentStatus,
} from "@/lib/delivery-types";
import { fulfillmentStatuses } from "@/lib/delivery-types";
import { updateOrderFulfillment } from "@/lib/orders-store";
import { isStoreAdmin } from "@/lib/store-admin";
import {
  readTrainingSettings,
  writeTrainingSettings,
} from "@/lib/training-store";
import type { TrainingSettings } from "@/lib/training-types";
import { normalizeTrainingSettings } from "@/lib/training-types";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<ActionResult | null> {
  if (!(await isStoreAdmin())) return { ok: false, error: "Forbidden" };
  return null;
}

function revalidateAvailability() {
  revalidatePath("/admin");
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

const categories: ProductCategory[] = [
  "lip-pigments",
  "brow-pigments",
  "aftercare",
];

export type ProductInput = {
  id?: string;
  name: string;
  slug?: string;
  category: ProductCategory;
  price: number;
  volume: string;
  stock: number;
  tagline: string;
  description: string;
  image: string;
  shade?: string;
  ingredients: string;
  usage: string;
  cautionsText: string;
  featured?: boolean;
  bestseller?: boolean;
};

export type ServiceInput = {
  id?: string;
  name: string;
  slug?: string;
  duration: string;
  fromPrice: number;
  summary: string;
  description: string;
  image: string;
  featured?: boolean;
};

function parseCautions(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export async function saveProduct(
  input: ProductInput,
): Promise<ActionResult & { product?: Product }> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const name = input.name?.trim() ?? "";
  if (name.length < 2) return { ok: false, error: "Enter a product name." };

  const category = input.category;
  if (!categories.includes(category)) {
    return { ok: false, error: "Choose a valid category." };
  }

  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 100) {
    return { ok: false, error: "Price must be at least ₦100." };
  }

  const stock = Math.max(0, Math.round(Number(input.stock)));
  if (!Number.isFinite(stock)) {
    return { ok: false, error: "Enter how many units remain in stock." };
  }

  const slug = slugify(input.slug?.trim() || name);
  if (!slug) return { ok: false, error: "Enter a valid slug." };

  const image = input.image?.trim() ?? "";
  if (!image) {
    return { ok: false, error: "Upload a product image." };
  }
  const products = await readProducts();
  const id = input.id?.trim() || `prod_${Date.now().toString(36)}`;

  if (products.some((p) => p.slug === slug && p.id !== id)) {
    return { ok: false, error: "Another product already uses that slug." };
  }

  const existing = products.find((p) => p.id === id);
  const product: Product = {
    id,
    slug,
    name,
    category,
    price: Math.round(price),
    volume: input.volume?.trim() || "10ml",
    stock,
    tagline: input.tagline?.trim() || "",
    description: input.description?.trim() || "",
    image,
    images: existing?.images?.length ? existing.images : [image],
    shade: input.shade?.trim() || undefined,
    ingredients: input.ingredients?.trim() || "",
    usage: input.usage?.trim() || "",
    cautions: parseCautions(input.cautionsText || ""),
    featured: Boolean(input.featured),
    bestseller: Boolean(input.bestseller),
  };

  if (product.images[0] !== image) {
    product.images = [image, ...product.images.filter((src) => src !== image)];
  }

  await upsertProduct(product);
  revalidateCatalog();
  return { ok: true, product };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!(await removeProduct(id))) {
    return { ok: false, error: "Product not found." };
  }
  revalidateCatalog();
  return { ok: true };
}

export async function saveService(
  input: ServiceInput,
): Promise<ActionResult & { service?: StudioService }> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const name = input.name?.trim() ?? "";
  if (name.length < 2) return { ok: false, error: "Enter a service name." };

  const fromPrice = Number(input.fromPrice);
  if (!Number.isFinite(fromPrice) || fromPrice < 0) {
    return { ok: false, error: "Enter a valid from-price." };
  }

  const slug = slugify(input.slug?.trim() || name);
  if (!slug) return { ok: false, error: "Enter a valid slug." };

  const services = await readServices();
  const id = input.id?.trim() || `svc_${Date.now().toString(36)}`;

  if (services.some((s) => s.slug === slug && s.id !== id)) {
    return { ok: false, error: "Another service already uses that slug." };
  }

  const image = input.image?.trim() ?? "";
  if (!image) {
    return { ok: false, error: "Upload a service image." };
  }

  const service: StudioService = {
    id,
    slug,
    name,
    duration: input.duration?.trim() || "1 hr",
    fromPrice: Math.round(fromPrice),
    summary: input.summary?.trim() || "",
    description: input.description?.trim() || "",
    image,
    featured: Boolean(input.featured),
  };

  await upsertService(service);
  revalidateCatalog();
  return { ok: true, service };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!(await removeService(id))) {
    return { ok: false, error: "Service not found." };
  }
  revalidateCatalog();
  return { ok: true };
}

export async function setBookingStatus(
  id: string,
  status: BookingRequest["status"],
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  const updated = await updateBookingStatus(id, status);
  if (!updated) return { ok: false, error: "Booking not found" };
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  return { ok: true };
}

export async function setOrderFulfillment(
  reference: string,
  fulfillmentStatus: FulfillmentStatus,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!fulfillmentStatuses.some((s) => s.value === fulfillmentStatus)) {
    return { ok: false, error: "Choose a valid order status." };
  }

  const updated = await updateOrderFulfillment(reference, fulfillmentStatus);
  if (!updated) return { ok: false, error: "Order not found." };
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");
  return { ok: true };
}

export async function saveDeliverySettingsAction(
  settings: DeliverySettings,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!Array.isArray(settings.abujaAreas) || settings.abujaAreas.length === 0) {
    return { ok: false, error: "Add at least one Abuja delivery area." };
  }

  await writeDeliverySettings(settings);
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function getDeliverySettingsAction() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return { ok: true as const, settings: await readDeliverySettings() };
}

export async function saveTrainingSettingsAction(
  settings: TrainingSettings,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const next = normalizeTrainingSettings(settings);
  if (next.mode === "cohorts" && next.cohorts.length === 0) {
    return {
      ok: false,
      error: "Add at least one cohort, or switch to “Will be announced”.",
    };
  }

  await writeTrainingSettings(next);
  revalidatePath("/admin/training");
  revalidatePath("/book");
  return { ok: true };
}

export async function getTrainingSettingsAction() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return { ok: true as const, settings: await readTrainingSettings() };
}

export async function uploadAdminImage(formData: FormData) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Choose an image to upload." };
  }
  return uploadImage(file, "yasbeauty");
}

export async function blockDate(
  date: string,
  reason = "",
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const iso = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { ok: false, error: "Choose a valid date." };
  }

  const rows = await readBlockedDates();
  if (rows.some((row) => row.date === iso)) {
    return { ok: false, error: "That date is already blocked." };
  }

  rows.push({
    id: `bd_${Date.now().toString(36)}`,
    date: iso,
    reason: reason.trim(),
  });
  await writeBlockedDates(rows);
  revalidateAvailability();
  return { ok: true };
}

export async function unblockDate(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const rows = await readBlockedDates();
  const next = rows.filter((row) => row.id !== id);
  if (next.length === rows.length) {
    return { ok: false, error: "Blocked date not found." };
  }
  await writeBlockedDates(next);
  revalidateAvailability();
  return { ok: true };
}

export async function saveWeeklyAvailability(
  openWeekdays: boolean[],
  slots: TimeSlot[],
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!Array.isArray(openWeekdays) || openWeekdays.length !== 7) {
    return { ok: false, error: "Weekly schedule must cover all 7 days." };
  }

  const cleanedSlots = slots
    .map((slot) => ({
      id: slot.id.trim(),
      label: slot.label.trim(),
    }))
    .filter((slot) => slot.id && slot.label);

  if (cleanedSlots.length === 0) {
    return { ok: false, error: "Add at least one time slot." };
  }

  const config: AvailabilityConfig = {
    openWeekdays: openWeekdays.map(Boolean),
    slots: cleanedSlots,
  };
  await writeAvailability(config);
  revalidateAvailability();
  return { ok: true };
}

export async function getAvailabilitySnapshot() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [availability, blocked] = await Promise.all([
    readAvailability(),
    readBlockedDates(),
  ]);
  return { ok: true as const, availability, blocked };
}
