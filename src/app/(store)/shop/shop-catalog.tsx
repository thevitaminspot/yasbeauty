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

export function ShopCatalog({ products, category }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byCategory = category
      ? products.filter((p) => p.category === category)
      : products;
    return byCategory.filter((p) => matchesQuery(p, query.trim()));
  }, [products, category, query]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Search shop</span>
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pigments, shades…"
            className={`${ui.fieldInput} !mt-0 py-2.5 pl-10 pr-3 placeholder:text-neutral-400`}
          />
        </label>
        {query.trim() ? (
          <p className={`${ui.eyebrow}`}>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      <nav
        className="mt-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-6"
        aria-label="Filter by category"
      >
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
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={Math.min(index, 7) * 50}
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
