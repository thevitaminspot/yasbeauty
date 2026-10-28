import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { getProducts } from "@/lib/products";
import { searchSite, type SearchHit } from "@/lib/search-index";
import { getServices } from "@/lib/studio-services";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Search",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchResults({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [products, services] = await Promise.all([
    getProducts(),
    getServices(),
  ]);
  const corpus: SearchHit[] = [
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
  const hits = query ? searchSite(query, 40, corpus) : [];

  return (
    <>
      <form
        action="/search"
        method="get"
        className="mt-8 flex max-w-xl border border-neutral-300 focus-within:border-black"
      >
        <input
          name="q"
          defaultValue={query}
          type="search"
          placeholder="Search pigments, services, pages…"
          className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          autoFocus
        />
        <button type="submit" className={`${ui.btnPrimary} shrink-0 rounded-none border-0 border-l border-neutral-300`}>
          Search
        </button>
      </form>

      {!query ? (
        <p className="mt-10 text-sm text-neutral-500">
          Try “Amoré”, “nano brows”, or “aftercare”.
        </p>
      ) : hits.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-600">
          No results for “{query}”.{" "}
          <Link href="/shop" className="underline underline-offset-4">
            Browse shop
          </Link>
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
          {hits.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <Link
                href={hit.href}
                className="flex flex-col gap-1 py-5 transition hover:bg-neutral-50 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    {hit.type}
                  </span>
                  <span className="mt-1 block font-serif text-2xl font-medium italic">
                    {hit.title}
                  </span>
                </span>
                <span className="text-sm text-neutral-500 md:max-w-md md:text-right">
                  {hit.subtitle}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function SearchPage(props: Props) {
  return (
    <div className={`${ui.pageShell} max-w-3xl`}>
      <PageHeader eyebrow="Search" title="Find something" />
      <Suspense
        fallback={
          <div className="mt-8 h-12 animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <SearchResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
