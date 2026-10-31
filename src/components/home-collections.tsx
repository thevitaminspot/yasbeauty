"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/product-types";
import { ui } from "@/lib/ui";

export function HomeCollections({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(280, el.clientWidth * 0.78),
      behavior: "smooth",
    });
  }

  return (
    <section className="border-b border-neutral-200 bg-white py-14 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <Reveal className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl min-w-0">
            <p className={ui.eyebrow}>Shop</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>
              Lip, brow &amp; aftercare
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4">
              The same nano pigments we use in-chair, ready for your kit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/shop" className={`${ui.btnGhost} w-fit`}>
              View all →
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous products"
                onClick={() => scrollBy(-1)}
                className="icon-hit inline-flex border border-neutral-300 text-black transition hover:border-black"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next products"
                onClick={() => scrollBy(1)}
                className="icon-hit inline-flex border border-neutral-300 text-black transition hover:border-black"
              >
                →
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 max-w-7xl sm:mt-12">
        <div
          ref={scroller}
          className="overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Same inset as section headers (px-4 / sm:px-5 / md:px-8); on the
              scroll content so the last card matches the first. */}
          <div className="flex w-max gap-3 px-4 sm:gap-4 sm:px-5 md:gap-5 md:px-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative w-[min(68vw,15.5rem)] shrink-0 bg-neutral-50 sm:w-[17rem] md:w-[18.5rem]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  {product.bestseller ? (
                    <span className="absolute left-3 top-3 z-[1] bg-black px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                      Bestseller
                    </span>
                  ) : null}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="280px"
                  />
                </div>
                <div className="border-t border-neutral-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
                  <p className="truncate font-serif text-base italic text-black sm:text-lg">
                    {product.name}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium tabular-nums text-neutral-800">
                      {formatNaira(product.price)}
                    </p>
                    <span className="text-xs text-neutral-400 transition group-hover:text-black">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
