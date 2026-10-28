"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { ui } from "@/lib/ui";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, ready } = useCart();

  if (!ready) {
    return (
      <div className={ui.pageShell} aria-busy>
        <div className="h-8 w-28 animate-pulse bg-neutral-100" />
        <div className="mt-8 h-36 animate-pulse bg-neutral-100" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={ui.pageShellNarrow}>
        <p className={ui.eyebrow}>Bag</p>
        <h1 className={`${ui.pageTitle} mt-3`}>Your bag is empty</h1>
        <p className={`${ui.pageLede} mx-auto`}>
          Explore lip pigments, brow shades, and aftercare.
        </p>
        <Link href="/shop" className={`${ui.btnPrimary} mt-8`}>
          Continue shopping
        </Link>
      </div>
    );
  }

  const itemLabel = lines.length === 1 ? "1 item" : `${lines.length} items`;

  return (
    <div className={ui.pageShell}>
      <header className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4">
        <h1 className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-medium tracking-[-0.02em] text-black">
          Bag
        </h1>
        <p className="text-sm text-neutral-500">{itemLabel}</p>
      </header>

      <div className="mt-5 grid min-w-0 gap-10 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        <ul className="min-w-0 divide-y divide-neutral-200">
          {lines.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3.5 gap-y-0 py-5 first:pt-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-5 sm:py-6"
            >
              <Link
                href={`/products/${product.slug}`}
                className="relative row-span-2 aspect-[4/5] self-stretch bg-neutral-100"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="104px"
                />
              </Link>

              <div className="min-w-0 self-start">
                <Link
                  href={`/products/${product.slug}`}
                  className="block font-serif text-lg italic leading-tight text-black hover:underline sm:text-xl"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-xs leading-none text-neutral-500">
                  {product.volume}
                </p>
                <p className="mt-2 text-sm font-medium tabular-nums text-black">
                  {formatNaira(product.price * quantity)}
                  {quantity > 1 ? (
                    <span className="ml-1.5 font-normal text-neutral-400">
                      ({formatNaira(product.price)} each)
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="col-start-2 mt-3 self-end">
                <QuantityStepper
                  value={quantity}
                  onChange={(next) => setQuantity(product.id, next)}
                  label=""
                  compact
                  max={Math.max(1, product.stock ?? 1)}
                  endSlot={
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="flex h-full items-center px-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-600 transition hover:bg-neutral-50 hover:text-black sm:px-4"
                    >
                      Remove
                    </button>
                  }
                />
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border-t border-neutral-200 pt-6 lg:border lg:border-neutral-200 lg:bg-neutral-50 lg:p-5 lg:pt-5">
          <h2 className={`${ui.eyebrow} text-black`}>Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="font-medium tabular-nums">
                {formatNaira(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Delivery</dt>
              <dd className="text-neutral-500">At checkout</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className={`${ui.btnPrimary} mt-5 w-full`}>
            Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 flex min-h-10 w-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 underline-offset-4 transition hover:text-black hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
