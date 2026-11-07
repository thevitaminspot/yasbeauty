"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/categories";
import type { Product } from "@/lib/product-types";
import { ui } from "@/lib/ui";

type Props = {
  products: Product[];
  category?: string;
};

type SortKey = "featured" | "name" | "price-asc" | "price-desc";

function matchesQuery(product: Product, q: string) {
  if (!q) return true;
  const hay = [
    product.name,
    product.tagline,
    product.description,
    product.shade ?? "",
    product.volume,
    product.category,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

function sortProducts(list: Product[], sort: SortKey) {
  const next = [...list];
  switch (sort) {
    case "name":
      return next.sort((a, b) => a.name.localeCompare(b.name, "en"));
    case "price-asc":
      return next.sort((a, b) => a.price - b.price);
    case "price-desc":
      return next.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return next.sort((a, b) => {
        const score = (p: Product) =>
          (p.bestseller ? 2 : 0) + (p.featured ? 1 : 0);
        const diff = score(b) - score(a);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name, "en");
      });
  }
}

const searchPlaceholders: Record<string, string> = {
  "lip-pigments": "Search lip shades…",
  "brow-pigments": "Search brow & liner shades…",
  aftercare: "Search aftercare…",
  kits: "Search kits & tools…",
};

export function ShopCatalog({ products, category }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const byCategory = category
      ? products.filter((p) => p.category === category)
      : products;
    const matched = byCategory.filter((p) => matchesQuery(p, query.trim()));
    return sortProducts(matched, sort);
  }, [products, category, query, sort]);

  const placeholder =
    (category && searchPlaceholders[category]) ||
    "Search pigments, kits, aftercare…";

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 mt-8 border-b border-line bg-paper/95 px-4 backdrop-blur-md sm:top-[4.25rem] sm:-mx-5 sm:mt-10 sm:px-5 md:top-[4.5rem] md:-mx-8 md:px-8">
        <div className="flex flex-col gap-4 py-4 sm:gap-5 sm:py-5">
          <nav className="flex flex-wrap gap-2" aria-label="Filter by category">
            <Link
              href="/shop"
              className={`${ui.chip} ${!category ? ui.chipActive : ui.chipIdle}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`${ui.chip} ${
                  category === cat.slug ? ui.chipActive : ui.chipIdle
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <label className="relative block min-w-0 flex-1 sm:max-w-md">
              <span className="sr-only">Search shop</span>
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-neutral-400">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full border-0 border-b border-neutral-300 bg-transparent py-2.5 pl-7 pr-2 text-base font-normal normal-case tracking-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
              />
            </label>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className={`${ui.eyebrow} tabular-nums`}>
                {filtered.length} item{filtered.length === 1 ? "" : "s"}
              </p>
              <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                <span className="sr-only sm:not-sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="min-h-10 border border-neutral-300 bg-white px-3 py-2 text-base font-normal normal-case tracking-normal text-black outline-none focus:border-black sm:text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name</option>
                  <option value="price-asc">Price · low</option>
                  <option value="price-desc">Price · high</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-sm text-neutral-600">
          No products match
          {query.trim() ? ` “${query.trim()}”` : ""}.{" "}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={Math.min(index, 7) * 45}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 20 20" strokeLinecap="square" />
    </svg>
  );
}
