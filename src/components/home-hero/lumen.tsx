import Image from "next/image";
import Link from "next/link";
import { brandImages } from "@/lib/product-images";

/**
 * Hero variant: `lumen`
 * Full-viewport pigment field under the black nav — stacked brand, edge caption, strong motion.
 */
export function HomeHeroLumen() {
  return (
    <section className="hero-lumen relative -mt-14 h-[100dvh] min-h-[100dvh] overflow-hidden bg-black text-white sm:-mt-[3.75rem]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={brandImages.collectionLips}
          alt=""
          fill
          priority
          className="hero-media object-cover object-[72%_24%] sm:object-[60%_30%]"
          sizes="(min-width: 768px) 1px, 100vw"
        />
        <div className="hero-lumen-veil pointer-events-none absolute inset-0" />
        <div className="hero-lumen-glow pointer-events-none absolute inset-0" />
        <div className="hero-lumen-sheen pointer-events-none absolute inset-0" />
        <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-soft-light" />
      </div>

      <div className="relative z-[1] mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[4.75rem] sm:px-8 sm:pb-16">
        <div className="hero-copy max-w-3xl">
          <h1 className="font-serif text-[clamp(2.85rem,13vw,7rem)] font-medium leading-[0.88] tracking-[-0.04em] text-white">
            <span className="block">Yas Beauty</span>
            <span className="mt-1 block italic text-white/90">Allure</span>
          </h1>
          <span
            className="hero-lumen-rule mt-5 block h-px w-16 bg-white/75 sm:mt-7 sm:w-28"
            aria-hidden
          />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-200 sm:mt-6">
            Professional lip and brow nano pigments — the shades from our Abuja
            studio.
          </p>
          <div className="mt-7 flex w-full flex-col gap-2.5 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200 sm:px-7"
            >
              Shop pigments
            </Link>
            <Link
              href="/book"
              className="inline-flex min-h-12 items-center justify-center border border-white/55 bg-transparent px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10 sm:px-7"
            >
              Book studio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
