import { readFile, writeFile } from "fs/promises";
import { catalogBase } from "@/lib/catalog-base";
import { pricesFilePath } from "@/lib/data-paths";
import type { Product } from "@/lib/product-types";

export type PriceMap = Record<string, number>;

function defaultPrices(): PriceMap {
  return Object.fromEntries(
    catalogBase.map((item) => [item.id, item.defaultPrice]),
  );
}

export async function readPriceMap(): Promise<PriceMap> {
  try {
    const raw = await readFile(pricesFilePath, "utf8");
    const parsed = JSON.parse(raw) as PriceMap;
    return { ...defaultPrices(), ...parsed };
  } catch {
    return defaultPrices();
  }
}

export async function writePriceMap(prices: PriceMap): Promise<void> {
  const merged = { ...defaultPrices(), ...prices };
  await writeFile(pricesFilePath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

export async function mergeCatalogWithPrices(): Promise<Product[]> {
  const prices = await readPriceMap();
  return catalogBase.map((item) => ({
    ...item,
    price: prices[item.id] ?? item.defaultPrice,
    stock: 24,
  }));
}

export function mergeCatalogWithPricesSync(prices: PriceMap): Product[] {
  return catalogBase.map((item) => ({
    ...item,
    price: prices[item.id] ?? item.defaultPrice,
    stock: 24,
  }));
}
