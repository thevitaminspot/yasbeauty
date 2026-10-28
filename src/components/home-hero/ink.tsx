import Image from "next/image";
import Link from "next/link";
import { brandImages } from "@/lib/product-images";

/**
 * Hero variant: `ink`
 * Continues the black navbar — dark grade, white brand, full-bleed pigment field.
 */
export function HomeHeroInk() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto h-[100dvh] md:h-[calc(100dvh-4.75rem)] md:min-h-[28rem] md:max-h-[44rem] min-[1728px]:h-[min(42rem,calc(100svh-4.75rem))] min-[1728px]:max-h-none">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={brandImages.heroDark}
            alt=""
            fill
            priority
            className="hero-media object-cover object-[center_35%] md:object-center"
            sizes="100vw"
          />

          {/* Top dissolve into navbar black */}
          <div className="hero-ink-top pointer-events-none absolute inset-0" />

          {/* Legibility wash over the photo — keeps pigment visible */}
          <div className="hero-ink-grade pointer-events-none absolute inset-0" />

          {/* Slow horizontal sheen */}
          <div className="hero-ink-sheen pointer-events-none absolute inset-0" />

          <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-soft-light" />
        </div>

        <div className="relative z-[1] mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 pt-24 sm:px-8 md:justify-center md:pb-20 md:pt-16">
          <div className="hero-copy max-w-xl md:max-w-2xl">
            <h1 className="font-serif text-[clamp(3rem,10vw,5.75rem)] font-medium leading-[0.9] tracking-[-0.03em] text-white">
              Yas Beauty Allure
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-300 md:text-[15px]">
              Professional lip and brow pigments — the shades from our Abuja
              studio, shipped for PMU artists.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center border border-white bg-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
              >
                Shop pigments
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center border border-white/55 bg-transparent px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10"
              >
                Book studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
