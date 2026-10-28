"use client";

import { useState } from "react";
import type { Product } from "@/lib/product-types";
import { useCart } from "@/context/cart-context";
import { QuantityStepper } from "@/components/quantity-stepper";
import { ui } from "@/lib/ui";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem, lines } = useCart();
  const stockKnown =
    typeof product.stock === "number" && Number.isFinite(product.stock);
  const stock = Math.max(0, Math.floor(stockKnown ? product.stock : 24));
  const inBag =
    lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, stock - inBag);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (stockKnown && stock <= 0) {
    return (
      <p
        className={`text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 ${className}`}
      >
        Out of stock
      </p>
    );
  }

  const maxAdd = Math.max(1, remaining || stock);

  return (
    <div className={`flex items-stretch gap-2 ${className}`}>
      <QuantityStepper
        value={Math.min(quantity, maxAdd)}
        onChange={setQuantity}
        max={maxAdd}
        label=""
        compact
        disabled={remaining <= 0}
        className="shrink-0"
      />
      <button
        type="button"
        disabled={remaining <= 0}
        className={`${ui.btnPrimary} h-10 min-h-10 flex-1 px-4 sm:px-7`}
        onClick={() => {
          const qty = Math.min(quantity, remaining);
          if (qty < 1) return;
          addItem(product, qty);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2000);
        }}
      >
        {remaining <= 0
          ? "Bag limit reached"
          : added
            ? quantity > 1
              ? `Added ${Math.min(quantity, remaining)}`
              : "Added to bag"
            : "Add to bag"}
      </button>
    </div>
  );
}
