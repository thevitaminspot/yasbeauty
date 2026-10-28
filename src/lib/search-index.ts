import { catalogBase } from "@/lib/catalog-base";
import { defaultStudioServices } from "@/lib/services";

export type SearchHit = {
  type: "product" | "service" | "page";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export const staticSearchPages: SearchHit[] = [
  {
    type: "page",
    id: "shop",
    title: "Shop",
    subtitle: "All pigments & aftercare",
    href: "/shop",
  },
  {
    type: "page",
    id: "services",
    title: "Services",
    subtitle: "Studio procedures & training",
    href: "/services",
  },
  {
    type: "page",
    id: "book",
    title: "Book",
    subtitle: "Request an appointment",
    href: "/book",
  },
  {
    type: "page",
    id: "contact",
    title: "Contact",
    subtitle: "Email, Instagram, send a note",
    href: "/contact",
  },
  {
    type: "page",
    id: "cart",
    title: "Bag",
    subtitle: "Your cart",
    href: "/cart",
  },
];

/** Fallback corpus (seed) until live catalog loads on the client. */
export function getSearchCorpus(extra: SearchHit[] = []): SearchHit[] {
  if (extra.length) return [...extra, ...staticSearchPages];

  const products: SearchHit[] = catalogBase.map((p) => ({
    type: "product",
    id: p.id,
    title: p.name,
    subtitle: `${p.shade ? `${p.shade} · ` : ""}${p.tagline}`,
    href: `/products/${p.slug}`,
  }));

  const services: SearchHit[] = defaultStudioServices.map((s) => ({
    type: "service",
    id: s.id,
    title: s.name,
    subtitle: s.summary,
    href: `/book?service=${s.slug}`,
  }));

  return [...products, ...services, ...staticSearchPages];
}

export function searchSite(
  query: string,
  limit = 8,
  corpus?: SearchHit[],
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const source = corpus?.length ? getSearchCorpus(corpus) : getSearchCorpus();

  return source
    .map((hit) => {
      const hay = `${hit.title} ${hit.subtitle} ${hit.type}`.toLowerCase();
      const score = tokens.reduce((acc, token) => {
        if (hit.title.toLowerCase().includes(token)) return acc + 3;
        if (hay.includes(token)) return acc + 1;
        return acc;
      }, 0);
      return { hit, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title))
    .slice(0, limit)
    .map((row) => row.hit);
}
