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
    el.scrollBy({ left: dir * Math.min(340, el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section className="border-b border-neutral-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={`${ui.eyebrow}`}>Shop</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>Lip, brow &amp; aftercare</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
              The same nano pigments we use in-chair, ready for your kit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className={`${ui.btnGhost}`}
            >
              View all
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollBy(-1)}
                className="icon-hit inline-flex border border-neutral-300 text-black transition hover:border-black"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollBy(1)}
                className="icon-hit inline-flex border border-neutral-300 text-black transition hover:border-black"
              >
                →
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => (
            <Reveal
              key={product.id}
              delay={Math.min(index, 5) * 60}
              className="w-[min(78vw,17rem)] shrink-0 snap-start md:w-[19rem]"
            >
            <Link
              href={`/products/${product.slug}`}
              className="group relative block bg-neutral-50"
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
                  sizes="304px"
                />
              </div>
              <div className="flex items-end justify-between gap-3 border-t border-neutral-200 bg-white px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg italic text-black">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {formatNaira(product.price)}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-black text-white transition group-hover:bg-neutral-800">
                  →
                </span>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
