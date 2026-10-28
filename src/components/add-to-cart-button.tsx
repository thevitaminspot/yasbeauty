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
  const stock = Math.max(0, Math.floor(product.stock ?? 0));
  const inBag =
    lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, stock - inBag);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
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
    <div
      className={`flex flex-col items-start gap-4 sm:flex-row sm:items-end ${className}`}
    >
      <QuantityStepper
        value={Math.min(quantity, maxAdd)}
        onChange={setQuantity}
        max={maxAdd}
        disabled={remaining <= 0}
      />
      <button
        type="button"
        disabled={remaining <= 0}
        className={`${ui.btnPrimary} w-full sm:min-h-[2.75rem] sm:w-auto sm:flex-1`}
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
              ? `Added ${Math.min(quantity, remaining)} to bag`
              : "Added to bag"
            : "Add to bag"}
      </button>
    </div>
  );
}
