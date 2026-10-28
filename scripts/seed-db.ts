/**
 * Push catalog + availability into Neon.
 * Usage: npm run db:seed
 * Demo orders/bookings/messages only when SEED_DEMO=1 (never on live by default).
 * Requires DATABASE_URL from `neon deploy` / `neon env pull`.
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { catalogBase } from "../src/lib/catalog-base";
import { defaultStudioServices } from "../src/lib/services";
import { defaultAvailability } from "../src/lib/availability-types";
import { nairaToKobo } from "../src/lib/paystack";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

function daysFromNow(days: number) {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function main() {
  const url =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("Set DATABASE_URL via `neon deploy` or `neon env pull`.");
  }

  const db = drizzle(neon(url), { schema });

  const productRows = catalogBase.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.defaultPrice,
    volume: item.volume,
    stock: 24,
    tagline: item.tagline,
    description: item.description,
    image: item.image,
    images: item.images.length ? item.images : [item.image],
    featured: Boolean(item.featured),
    bestseller: Boolean(item.bestseller),
    shade: item.shade ?? null,
    ingredients: item.ingredients,
    usage: item.usage,
    cautions: item.cautions,
    updatedAt: new Date(),
  }));

  const serviceRows = defaultStudioServices.map((service) => ({
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
  }));

  for (const row of productRows) {
    await db
      .insert(schema.products)
      .values(row)
      .onConflictDoUpdate({
        target: schema.products.id,
        set: row,
      });
  }

  for (const row of serviceRows) {
    await db
      .insert(schema.services)
      .values(row)
      .onConflictDoUpdate({
        target: schema.services.id,
        set: row,
      });
  }

  await db
    .insert(schema.availability)
    .values({
      id: "default",
      openWeekdays: [...defaultAvailability.openWeekdays],
      slots: [...defaultAvailability.slots],
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.availability.id,
      set: {
        openWeekdays: [...defaultAvailability.openWeekdays],
        slots: [...defaultAvailability.slots],
        updatedAt: new Date(),
      },
    });

  const seedDemo = process.env.SEED_DEMO === "1";

  if (!seedDemo) {
    console.log(
      `Seeded ${productRows.length} products, ${serviceRows.length} services, and availability. (Skipped demo orders/bookings — set SEED_DEMO=1 to include.)`,
    );
    return;
  }

  const orderRows = [
    {
      reference: "demo_ps_amore_serum",
      status: "success",
      amount: nairaToKobo(18500 + 24000),
      currency: "NGN",
      email: "ada.okonkwo@example.com",
      customer: {
        name: "Ada Okonkwo",
        phone: "+2348012345678",
        city: "Abuja",
        address: "12 Maitama Crescent, Abuja",
      },
      items: [
        {
          id: "lip-amore",
          name: "Amoré",
          quantity: 1,
          unitPrice: 18500,
        },
        {
          id: "aftercare-bright-serum",
          name: "Bright Serum",
          quantity: 1,
          unitPrice: 24000,
        },
      ],
      channel: "paystack" as const,
      createdAt: hoursAgo(6),
    },
    {
      reference: "demo_wa_brow_kit",
      status: "paid",
      amount: nairaToKobo(19500 * 2),
      currency: "NGN",
      email: "chioma.eze@example.com",
      customer: {
        name: "Chioma Eze",
        phone: "+2348098765432",
        city: "Lagos",
        address: "8 Admiralty Way, Lekki Phase 1",
      },
      items: [
        {
          id: "brow-melanin-brown",
          name: "Melanin Brown",
          quantity: 2,
          unitPrice: 19500,
        },
      ],
      channel: "whatsapp" as const,
      createdAt: hoursAgo(28),
    },
    {
      reference: "demo_ps_pending_lips",
      status: "abandoned",
      amount: nairaToKobo(18500),
      currency: "NGN",
      email: "tunde.bakare@example.com",
      customer: {
        name: "Tunde Bakare",
        phone: "+2347011122233",
        city: "Abuja",
        address: "Wuse Zone 2",
      },
      items: [
        {
          id: "lip-bloody-mary",
          name: "Bloody Mary",
          quantity: 1,
          unitPrice: 18500,
        },
      ],
      channel: "paystack" as const,
      createdAt: hoursAgo(50),
    },
  ];

  for (const row of orderRows) {
    await db
      .insert(schema.orders)
      .values(row)
      .onConflictDoUpdate({
        target: schema.orders.reference,
        set: row,
      });
  }

  const bookingRows = [
    {
      id: "demo_bk_nano_pending",
      serviceId: "svc-nano-brows",
      serviceName: "Nano Brows",
      name: "Fatima Bello",
      phone: "+2348033344455",
      email: "fatima.bello@example.com",
      preferredDate: daysFromNow(3),
      preferredTime: "10:30",
      notes: "First PMU — prefers soft natural brows.",
      depositAmount: nairaToKobo(15_000),
      depositPaid: true,
      depositReference: "demo_dep_nano",
      status: "pending" as const,
      createdAt: hoursAgo(4),
    },
    {
      id: "demo_bk_lip_confirmed",
      serviceId: "svc-lip-blush",
      serviceName: "Lip Blush",
      name: "Ngozi Adeyemi",
      phone: "+2348055566677",
      email: "ngozi.adeyemi@example.com",
      preferredDate: daysFromNow(5),
      preferredTime: "13:30",
      notes: "Wants soft nude blush, healed look.",
      depositAmount: nairaToKobo(15_000),
      depositPaid: true,
      depositReference: "demo_dep_lip",
      status: "confirmed" as const,
      createdAt: hoursAgo(20),
    },
    {
      id: "demo_bk_consult_cancelled",
      serviceId: "svc-consultation",
      serviceName: "PMU Consultation",
      name: "Ibrahim Musa",
      phone: "+2348077788899",
      email: "ibrahim.musa@example.com",
      preferredDate: daysFromNow(-2),
      preferredTime: "09:00",
      notes: "Rescheduled — keep on file.",
      depositAmount: nairaToKobo(15_000),
      depositPaid: false,
      depositReference: null,
      status: "cancelled" as const,
      createdAt: hoursAgo(72),
    },
    {
      id: "demo_bk_lip_completed",
      serviceId: "svc-lip-blush",
      serviceName: "Lip Blush",
      name: "Blessing Okeke",
      phone: "+2348066655544",
      email: "blessing.okeke@example.com",
      preferredDate: daysFromNow(-5),
      preferredTime: "15:00",
      notes: "Healed soft nude — demo completed session.",
      depositAmount: nairaToKobo(15_000),
      depositPaid: true,
      depositReference: "demo_dep_lip_done",
      status: "completed" as const,
      createdAt: hoursAgo(120),
    },
    {
      id: "demo_bk_training_pending",
      serviceId: "svc-training",
      serviceName: "Artist Training",
      name: "Zainab Yusuf",
      phone: "+2347012349876",
      email: "zainab.yusuf@example.com",
      preferredDate: daysFromNow(14),
      preferredTime: "09:00",
      notes: "Interested in nano brow fundamentals cohort.",
      depositAmount: nairaToKobo(250_000),
      depositPaid: false,
      depositReference: null,
      status: "pending" as const,
      createdAt: hoursAgo(10),
    },
  ];

  for (const row of bookingRows) {
    await db
      .insert(schema.bookings)
      .values(row)
      .onConflictDoUpdate({
        target: schema.bookings.id,
        set: row,
      });
  }

  const messageRows = [
    {
      id: "demo_msg_wholesale",
      name: "Halima Lawal",
      email: "halima.lawal@example.com",
      phone: "+2348022211100",
      message:
        "Do you offer studio wholesale pricing on the lip pigment set? Looking for 6 bottles.",
      createdAt: hoursAgo(2),
    },
    {
      id: "demo_msg_shipping",
      name: "Peace Okoro",
      email: "peace.okoro@example.com",
      phone: "",
      message:
        "Can you ship Melanin Brown and Bright Serum to Port Harcourt this week?",
      createdAt: hoursAgo(18),
    },
    {
      id: "demo_msg_training",
      name: "Amaka Nwosu",
      email: "amaka.nwosu@example.com",
      phone: "+2348099988776",
      message:
        "Is the artist training still open for November? I already work with nano brows.",
      createdAt: hoursAgo(40),
    },
  ];

  for (const row of messageRows) {
    await db
      .insert(schema.messages)
      .values(row)
      .onConflictDoUpdate({
        target: schema.messages.id,
        set: row,
      });
  }

  const blockedRows = [
    {
      id: "demo_block_holiday",
      date: daysFromNow(10),
      reason: "Studio holiday — demo block",
    },
    {
      id: "demo_block_event",
      date: daysFromNow(21),
      reason: "Private event — demo block",
    },
  ];

  for (const row of blockedRows) {
    await db
      .insert(schema.blockedDates)
      .values(row)
      .onConflictDoUpdate({
        target: schema.blockedDates.id,
        set: row,
      });
  }

  console.log(
    `Seeded ${productRows.length} products, ${serviceRows.length} services, availability, ${orderRows.length} orders, ${bookingRows.length} bookings, ${messageRows.length} messages, ${blockedRows.length} blocked dates.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
