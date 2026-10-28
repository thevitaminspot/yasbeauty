import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/paystack";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/api/", "/checkout", "/cart", "/sign-in", "/sign-up"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
