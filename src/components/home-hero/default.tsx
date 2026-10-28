import Image from "next/image";
import Link from "next/link";
import { brandImages } from "@/lib/product-images";
import { ui } from "@/lib/ui";

/**
 * Hero variant: `default`
 * Soft light rose veil, centered black type on pigment photo.
 * Switch back via ACTIVE_HERO in `./index.tsx`.
 */
export function HomeHeroDefault() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-neutral-100 text-black">
      {/* Below 2xl: full 100dvh. 2xl+: capped fold. Ultra-wide: rem cap. */}
      <div className="relative mx-auto h-[100dvh] min-h-[100dvh] 2xl:h-[calc(100dvh-4.75rem)] 2xl:min-h-[26rem] 2xl:max-h-[42rem] min-[1728px]:h-[min(40rem,calc(100svh-4.75rem))] min-[1728px]:min-h-0 min-[1728px]:max-h-none">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={brandImages.collectionLips}
            alt=""
            fill
            priority
            className="hero-media object-cover object-center"
            sizes="(max-width: 767px) 1px, 100vw"
          />

          {/* Soft rose wash — beauty tint without crushing the photo */}
          <div className="hero-veil pointer-events-none absolute inset-0" />

          {/* Center bloom so black type sits on light */}
          <div className="hero-bloom pointer-events-none absolute inset-0" />

          {/* Edge falloff — keeps corners photographic */}
          <div className="hero-vignette pointer-events-none absolute inset-0" />

          {/* Slow light sweep */}
          <div className="hero-sheen pointer-events-none absolute inset-0" />

          {/* Fine grain for print-like finish */}
          <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-soft-light" />
        </div>

        <div className="relative z-[1] mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-5 text-center sm:px-8">
          <div className="hero-copy">
            <h1 className="font-serif text-[clamp(2.75rem,9vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.03em]">
              Yas Beauty Allure
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-neutral-800 md:text-[15px]">
              Lip and brow pigments for professional PMU — the shades we use in
              the Abuja studio.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className={`${ui.btnPrimary} shadow-[0_10px_30px_rgba(0,0,0,0.18)]`}
              >
                Shop pigments
              </Link>
              <Link
                href="/book"
                className={`${ui.btnSecondary} bg-white/80 backdrop-blur-[2px]`}
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
