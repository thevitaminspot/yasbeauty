import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/product-types";

export function ProductCard({
  product,
  delay = 0,
}: {
  product: Product;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full min-w-0 flex-col">
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {product.bestseller ? (
            <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-white sm:left-3 sm:top-3 sm:text-[10px]">
              Bestseller
            </span>
          ) : null}
        </Link>
        <div className="mt-3 flex flex-1 flex-col border-t border-neutral-200 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            {product.volume}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-1 font-serif text-base italic leading-snug tracking-tight text-black sm:text-lg"
          >
            {product.name}
          </Link>
          <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
            <p className="text-sm font-medium tabular-nums tracking-wide">
              {formatNaira(product.price)}
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
