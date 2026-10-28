import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/paystack";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const products = await getProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/services",
    "/book",
    "/contact",
    "/privacy",
    "/terms",
    "/shipping",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
