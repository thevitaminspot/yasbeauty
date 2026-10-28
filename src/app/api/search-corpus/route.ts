import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import type { SearchHit } from "@/lib/search-index";
import { getServices } from "@/lib/studio-services";

export async function GET() {
  const [products, services] = await Promise.all([
    getProducts(),
    getServices(),
  ]);

  const hits: SearchHit[] = [
    ...products.map((p) => ({
      type: "product" as const,
      id: p.id,
      title: p.name,
      subtitle: `${p.shade ? `${p.shade} · ` : ""}${p.tagline}`,
      href: `/products/${p.slug}`,
    })),
    ...services.map((s) => ({
      type: "service" as const,
      id: s.id,
      title: s.name,
      subtitle: s.summary,
      href: `/book?service=${s.slug}`,
    })),
  ];

  return NextResponse.json({ hits });
}
