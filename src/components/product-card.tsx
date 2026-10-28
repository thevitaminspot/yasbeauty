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
      <article className="group flex h-full flex-col">
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
            <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
              Bestseller
            </span>
          ) : null}
        </Link>
        <div className="mt-4 flex flex-1 flex-col border-t border-neutral-200 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            {product.volume} · Nano pigment
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-serif text-xl font-medium italic tracking-tight text-black">
              {product.name}
            </h3>
          </Link>
          {product.shade ? (
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-neutral-500">
              {product.shade}
            </p>
          ) : null}
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
            {product.tagline}
          </p>
          <p className="mt-auto pt-4 text-sm font-medium tracking-wide">
            {formatNaira(product.price)}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
