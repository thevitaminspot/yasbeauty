import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category")
    .$type<"lip-pigments" | "brow-pigments" | "aftercare">()
    .notNull(),
  price: integer("price").notNull(),
  volume: text("volume").notNull(),
  stock: integer("stock").notNull().default(0),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  bestseller: boolean("bestseller").notNull().default(false),
  shade: text("shade"),
  ingredients: text("ingredients").notNull(),
  usage: text("usage").notNull(),
  cautions: jsonb("cautions").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  duration: text("duration").notNull(),
  fromPrice: integer("from_price").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  reference: text("reference").primaryKey(),
  /** Paystack payment status (e.g. success) */
  status: text("status").notNull(),
  /** Fulfilment workflow after payment */
  fulfillmentStatus: text("fulfillment_status")
    .$type<"confirmed" | "packed" | "sent" | "delivered">()
    .notNull()
    .default("confirmed"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  email: text("email").notNull(),
  customer: jsonb("customer")
    .$type<{
      name: string;
      phone: string;
      city: string;
      address: string;
    }>()
    .notNull(),
  items: jsonb("items")
    .$type<{ id: string; name: string; quantity: number; unitPrice: number }[]>()
    .notNull(),
  delivery: jsonb("delivery").$type<{
    zone: "abuja" | "nigeria" | "international";
    areaId?: string;
    areaName: string;
    fee: number;
  }>(),
  /** Checkout notes (landmark, gate code, etc.) */
  notes: text("notes").notNull().default(""),
  channel: text("channel").$type<"paystack" | "whatsapp">().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const deliverySettings = pgTable("delivery_settings", {
  id: text("id").primaryKey().default("default"),
  abujaAreas: jsonb("abuja_areas")
    .$type<{ id: string; name: string; price: number }[]>()
    .notNull(),
  outOfAbujaPrice: integer("out_of_abuja_price").notNull(),
  internationalPrice: integer("international_price").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  notes: text("notes").notNull().default(""),
  /** Deposit amount in kobo (Paystack). */
  depositAmount: integer("deposit_amount").notNull().default(0),
  depositPaid: boolean("deposit_paid").notNull().default(false),
  depositReference: text("deposit_reference"),
  status: text("status")
    .$type<"pending" | "confirmed" | "completed" | "cancelled">()
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const blockedDates = pgTable("blocked_dates", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(),
  reason: text("reason").notNull().default(""),
});

export const availability = pgTable("availability", {
  id: text("id").primaryKey().default("default"),
  openWeekdays: jsonb("open_weekdays").$type<boolean[]>().notNull(),
  slots: jsonb("slots")
    .$type<{ id: string; label: string }[]>()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
