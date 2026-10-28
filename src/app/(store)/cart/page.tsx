"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { ui } from "@/lib/ui";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, ready } = useCart();

  if (!ready) {
    return (
      <div className={`${ui.pageShell}`} aria-busy>
        <div className="h-10 w-32 animate-pulse bg-neutral-100" />
        <div className="mt-12 h-40 animate-pulse bg-neutral-100" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <PageHeader
          title="Your bag is empty"
          lede="Explore lip pigments, brow shades, and aftercare."
          align="center"
        />
        <Link href="/shop" className={`${ui.btnPrimary} mt-8`}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={`${ui.pageShell}`}>
      <PageHeader title="Bag" />
      <div className="mt-8 grid min-w-0 gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="min-w-0 divide-y divide-neutral-200 border-y border-neutral-200">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex min-w-0 gap-3 py-6 sm:gap-6 sm:py-8">
              <div className="relative h-24 w-20 shrink-0 bg-neutral-100 sm:h-28 sm:w-24">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-serif text-xl font-medium italic hover:underline sm:text-2xl"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-neutral-500">
                      {product.volume}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatNaira(product.price * quantity)}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap items-end gap-4 pt-4">
                  <QuantityStepper
                    value={quantity}
                    onChange={(next) => setQuantity(product.id, next)}
                    label="Qty"
                    max={Math.max(1, product.stock ?? 1)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className={`${ui.btnGhost} mb-3`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className={`${ui.panel} h-fit`}>
          <h2 className={`${ui.eyebrow} text-black`}>Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-600">Subtotal</dt>
              <dd className="font-medium">{formatNaira(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-600">Delivery</dt>
              <dd className="text-neutral-600">Calculated at checkout</dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-neutral-200 pt-6 text-lg font-medium">
            {formatNaira(subtotal)}
          </p>
          <Link href="/checkout" className={`${ui.btnPrimary} mt-6 w-full`}>
            Checkout
          </Link>
          <Link href="/shop" className={`${ui.btnGhost} mt-4 w-full`}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
