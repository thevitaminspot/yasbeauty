"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/product-types";
import { useCart } from "@/context/cart-context";

/** Keeps cart line prices aligned with admin-updated catalog. */
export function CatalogPriceSync() {
  const { lines, syncProductPrices } = useCart();

  useEffect(() => {
    if (lines.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { products: Product[] };
        if (!cancelled) syncProductPrices(data.products);
      } catch {
        /* ignore network errors on sync */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lines.length, syncProductPrices]);

  return null;
}
