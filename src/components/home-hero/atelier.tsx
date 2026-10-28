import Image from "next/image";
import Link from "next/link";
import { brandImages } from "@/lib/product-images";

/**
 * Hero variant: `atelier`
 * Studio atmosphere under the black nav — editorial bottom lockup, quiet motion.
 */
export function HomeHeroAtelier() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto h-[100dvh] md:h-[calc(100dvh-4.75rem)] md:min-h-[28rem] md:max-h-[46rem] min-[1728px]:h-[min(44rem,calc(100svh-4.75rem))] min-[1728px]:max-h-none">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={brandImages.studio}
            alt=""
            fill
            priority
            className="hero-media object-cover object-[center_28%] sm:object-[center_32%]"
            sizes="100vw"
          />

          <div className="hero-atelier-top pointer-events-none absolute inset-0" />
          <div className="hero-atelier-grade pointer-events-none absolute inset-0" />
          <div className="hero-atelier-sheen pointer-events-none absolute inset-0" />
          <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-soft-light" />
        </div>

        <div className="relative z-[1] mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8 md:pb-20">
          <div className="hero-copy max-w-2xl">
            <h1 className="font-serif text-[clamp(3.25rem,11vw,6.25rem)] font-medium leading-[0.88] tracking-[-0.035em] text-white">
              Yas Beauty Allure
            </h1>
            <span
              className="hero-atelier-rule mt-6 block h-px w-16 bg-white/70"
              aria-hidden
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-300 md:text-[15px]">
              Pigments and permanent makeup in Abuja — crafted for artists,
              worn in the studio.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center border border-white bg-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
              >
                Shop pigments
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center border border-white/50 bg-transparent px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10"
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
