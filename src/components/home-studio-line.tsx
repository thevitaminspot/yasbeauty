import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/ui/reveal";
import { brandImages } from "@/lib/product-images";
import type { Product } from "@/lib/product-types";
import { ui } from "@/lib/ui";

/** Studio line — oversized lead + quiet product grid (Woodwrights, simplified). */
export function HomeStudioLine({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper">
      <div className="relative min-h-[58vh] overflow-hidden sm:min-h-[68vh]">
        <Image
          src={brandImages.kits}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-5 sm:pb-12 md:px-8">
          <Reveal>
            <p className={ui.eyebrow}>Studio line</p>
            <h2 className="mt-3 max-w-[11ch] font-serif text-[clamp(2.5rem,8vw,4.5rem)] font-medium leading-[0.94] tracking-[-0.03em] text-ink">
              Kits beside the pigments.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-14 md:px-8 md:py-16">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Lamination, tint, aftercare, and tools we keep next to the
            pigments — priced for the chair.
          </p>
          <Link href="/shop?category=kits" className={`${ui.btnGhost} w-fit`}>
            Shop the line →
          </Link>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-5 md:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={Math.min(index, 3) * 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
