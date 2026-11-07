"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductPrice } from "@/components/service-price";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/lib/product-types";

export function ProductCard({
  product,
  delay = 0,
}: {
  product: Product;
  delay?: number;
}) {
  const gallery =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const primary = gallery[0] ?? product.image;
  const hover = gallery.length > 1 ? gallery[1] : null;
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className="group flex h-full min-w-0 flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
        >
          <Image
            src={primary}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 ${
              hover && hovered ? "opacity-0 scale-105" : "opacity-100 group-hover:scale-[1.03]"
            }`}
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {hover ? (
            <Image
              src={hover}
              alt=""
              fill
              className={`object-cover transition duration-500 ${
                hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : null}
          {product.bestseller ? (
            <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-paper sm:left-3 sm:top-3 sm:text-[10px]">
              Bestseller
            </span>
          ) : null}
          {gallery.length > 1 ? (
            <span
              aria-hidden
              className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-0.5 text-[9px] font-medium tabular-nums tracking-wide text-neutral-600 sm:bottom-3 sm:right-3"
            >
              {gallery.length}
            </span>
          ) : null}
        </Link>
        <div className="mt-3 flex flex-1 flex-col border-t border-line pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
            {product.volume}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-1 font-serif text-base italic leading-snug tracking-tight text-ink sm:text-lg"
          >
            {product.name}
          </Link>
          <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
            <p className="text-sm font-medium tabular-nums tracking-wide">
              <ProductPrice product={product} />
            </p>
            {product.shade ? (
              <p className="truncate text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                {product.shade}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
