import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { brandImages } from "@/lib/product-images";
import { ui } from "@/lib/ui";

const steps = [
  {
    n: "01",
    title: "Mixed in the chair",
    body: "Every shade starts in live PMU appointments — mapped to melanin-rich skin, not a lab swatch book alone.",
  },
  {
    n: "02",
    title: "Healed, then stocked",
    body: "We watch how color settles over weeks. Only tones that heal true make it into bottles for your kit.",
  },
  {
    n: "03",
    title: "Shipped for artists",
    body: "The same nano pigments on our Abuja trays — sterilized, labeled, ready for professional procedures.",
  },
] as const;

/**
 * Chair → kit provenance — why Yas pigments feel different from import-only brands.
 */
export function HomeCraft() {
  return (
    <section className="border-b border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <Reveal className="relative min-h-[22rem] overflow-hidden bg-neutral-900 lg:min-h-[36rem]">
          <Image
            src={brandImages.studio}
            alt=""
            fill
            className="object-cover object-[center_30%] opacity-90"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"
            aria-hidden
          />
          <p className="absolute bottom-6 left-5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/85 md:left-8">
            Abuja studio · Est. 2019
          </p>
        </Reveal>

        <Reveal
          delay={80}
          className="flex flex-col justify-center px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-14"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
            Craft
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.85rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
            From the chair to your kit.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            Yas Beauty Allure is a working PMU studio first. The bottles follow
            the work — not the other way around.
          </p>

          <ol className="mt-10 space-y-8 border-t border-white/15 pt-10">
            {steps.map((step) => (
              <li key={step.n} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="font-serif text-2xl italic text-white/35">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-serif text-xl italic text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/shop" className={ui.btnPrimaryOnInk}>
              Shop pigments
            </Link>
            <Link href="/book" className={ui.btnGhostOnInk}>
              Book the studio →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
