import Image from "next/image";
import Link from "next/link";
import { brandImages } from "@/lib/product-images";

/**
 * Hero variant: `chroma`
 * Single pigment field, brand stack.
 */

export function HomeHeroChroma() {
  return (
    <section className="hero-chroma relative -mt-16 flex h-[100dvh] min-h-[32rem] flex-col overflow-hidden bg-black text-white sm:-mt-[4.25rem] md:-mt-[4.5rem] md:min-h-[36rem] md:max-h-[52rem]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={brandImages.collectionLips}
          alt=""
          fill
          priority
          className="hero-media object-cover object-[68%_28%] sm:object-[58%_32%] md:object-[52%_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
      </div>

      <div className="relative z-[1] mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-4 pt-[4.75rem] sm:px-8">
        <p className="hero-chroma-edge pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45 md:right-8 lg:block">
          Abuja · Est. 2019
        </p>

        <div className="mt-auto flex flex-col gap-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:gap-7 sm:pb-9 md:gap-8 md:pb-10">
          <div className="hero-copy max-w-3xl">
            <h1 className="font-serif text-[clamp(2.6rem,11vw,6.25rem)] font-medium leading-[0.88] tracking-[-0.04em] text-white">
              <span className="block">Yas Beauty</span>
              <span className="mt-1 block italic text-white/92">Allure</span>
            </h1>
            <span
              className="hero-chroma-rule mt-4 block h-px w-14 bg-white/70 sm:mt-5 sm:w-24"
              aria-hidden
            />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-200 sm:mt-4">
              Lip and brow shades we mix in-chair — ready for your kit, or a
              seat in the studio.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
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
      </div>
    </section>
  );
}
