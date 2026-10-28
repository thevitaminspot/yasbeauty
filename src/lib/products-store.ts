import "server-only";
import { asc, eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { catalogBase } from "@/lib/catalog-base";
import { getDb, isDatabaseConfigured } from "@/db";
import { products as productsTable } from "@/db/schema";
import { productsFilePath } from "@/lib/data-paths";
import type { Product } from "@/lib/product-types";

const DEFAULT_STOCK = 24;

function seedProducts(): Product[] {
  return catalogBase.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.defaultPrice,
    volume: item.volume,
    stock: DEFAULT_STOCK,
    tagline: item.tagline,
    description: item.description,
    image: item.image,
    images: item.images.length ? item.images : [item.image],
    featured: item.featured,
    bestseller: item.bestseller,
    shade: item.shade,
    ingredients: item.ingredients,
    usage: item.usage,
    cautions: item.cautions,
  }));
}

function normalizeProduct(product: Product): Product {
  const rawStock = product.stock;
  // Missing stock (legacy JSON / old cart snapshots) ≠ sold out.
  const stock =
    rawStock === undefined || rawStock === null || rawStock === ("" as never)
      ? DEFAULT_STOCK
      : Math.max(0, Math.round(Number(rawStock)));
  return {
    ...product,
    stock: Number.isFinite(stock) ? stock : DEFAULT_STOCK,
    images: product.images?.length ? product.images : [product.image],
  };
}

function rowToProduct(row: typeof productsTable.$inferSelect): Product {
  return normalizeProduct({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    volume: row.volume,
    stock: row.stock ?? 0,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    images: row.images ?? [],
    featured: row.featured || undefined,
    bestseller: row.bestseller || undefined,
    shade: row.shade ?? undefined,
    ingredients: row.ingredients,
    usage: row.usage,
    cautions: row.cautions ?? [],
  });
}

function productToRow(product: Product) {
  const normalized = normalizeProduct(product);
  return {
    id: normalized.id,
    slug: normalized.slug,
    name: normalized.name,
    category: normalized.category,
    price: normalized.price,
    volume: normalized.volume,
    stock: normalized.stock,
    tagline: normalized.tagline,
    description: normalized.description,
    image: normalized.image,
    images: normalized.images,
    featured: Boolean(normalized.featured),
    bestseller: Boolean(normalized.bestseller),
    shade: normalized.shade ?? null,
    ingredients: normalized.ingredients,
    usage: normalized.usage,
    cautions: normalized.cautions,
    updatedAt: new Date(),
  };
}
async function ensureProductsSeeded(): Promise<Product[]> {
  const db = getDb();
  const existing = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.name));
  if (existing.length > 0) {
    return existing.map(rowToProduct);
  }
  const seeded = seedProducts();
  await db.insert(productsTable).values(seeded.map(productToRow));
  return seeded;
}

async function readProductsFile(): Promise<Product[]> {
  try {
    const raw = await readFile(productsFilePath, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedProducts();
      await writeProductsFile(seeded);
      return seeded;
    }
    return parsed.map((product) =>
      normalizeProduct({
        ...product,
        stock:
          typeof product.stock === "number" ? product.stock : DEFAULT_STOCK,
      }),
    );
  } catch {
    const seeded = seedProducts();
    await writeProductsFile(seeded);
    return seeded;
  }
}

async function writeProductsFile(products: Product[]): Promise<void> {
  await writeFile(
    productsFilePath,
    `${JSON.stringify(products, null, 2)}\n`,
    "utf8",
  );
}

export async function readProducts(): Promise<Product[]> {
  if (isDatabaseConfigured()) {
    return ensureProductsSeeded();
  }
  return readProductsFile();
}

export async function writeProducts(products: Product[]): Promise<void> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db.delete(productsTable);
    if (products.length > 0) {
      await db.insert(productsTable).values(products.map(productToRow));
    }
    return;
  }
  await writeProductsFile(products);
}

export async function upsertProduct(product: Product): Promise<Product> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db
      .insert(productsTable)
      .values(productToRow(product))
      .onConflictDoUpdate({
        target: productsTable.id,
        set: productToRow(product),
      });
    return product;
  }

  const products = await readProductsFile();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) products[index] = product;
  else products.unshift(product);
  await writeProductsFile(products);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const removed = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning({ id: productsTable.id });
    return removed.length > 0;
  }

  const products = await readProductsFile();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await writeProductsFile(next);
  return true;
}

/** Reduce remaining stock after a paid order. Never goes below zero. */
export async function decrementStock(
  items: { id: string; quantity: number }[],
): Promise<void> {
  if (!items.length) return;
  const products = await readProducts();
  let changed = false;
  const next = products.map((product) => {
    const sold = items
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
    if (!sold) return product;
    changed = true;
    return {
      ...product,
      stock: Math.max(0, product.stock - sold),
    };
  });
  if (changed) await writeProducts(next);
}
