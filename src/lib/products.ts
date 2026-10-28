import "server-only";
import { unstable_cache } from "next/cache";
import { readProducts } from "@/lib/products-store";
import type { Product, ProductCategory } from "@/lib/product-types";

export type { Product, ProductCategory } from "@/lib/product-types";

export const getProducts = unstable_cache(
  () => readProducts(),
  ["yasbeauty-product-catalog-v3"],
  { tags: ["catalog-products"] },
);

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === category);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}
