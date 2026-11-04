import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatNaira } from "@/lib/format";
import { ui } from "@/lib/ui";

const legacy = [
  "Pre-mix cream + developer",
  "Oxidation after opening",
  "Unstable healed results",
  "Long chair time",
] as const;

const next = [
  "2-in-1 no-mix formula",
  "Vacuum freshness lock",
  "Stable 4–6 week wear",
  "Four full-coverage shades",
] as const;

/**
 * Innovative comparison band — traditional tint vs ReBrows system, Yas B&W.
 */
export function HomeTintEdge({ price }: { price: number }) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <Reveal className="relative min-h-[20rem] overflow-hidden bg-neutral-200 lg:min-h-[32rem]">
          <Image
            src="/products/kits/brow-tint-shades.jpg"
            alt="ReBrows brow tint shades on models"
            fill
            className="object-cover object-[center_30%]"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </Reveal>

        <Reveal
          delay={80}
          className="flex flex-col justify-center px-5 py-14 sm:px-8 md:px-12 md:py-20"
        >
          <p className={ui.eyebrow}>Brow tint</p>
          <h2 className={`${ui.sectionTitle} mt-3`}>
            Less mixing. More control.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            The ReBrows tint kit we stock skips the old mix-and-wait routine —
            so artists stay faster without trading stability.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="border border-line bg-surface p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Traditional
              </p>
              <ul className="mt-4 space-y-2.5">
                {legacy.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted">
                    <span aria-hidden className="text-line">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ink bg-ink p-5 text-paper">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-paper/50">
                In our kit
              </p>
              <ul className="mt-4 space-y-2.5">
                {next.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-paper/85">
                    <span aria-hidden className="text-paper">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="font-serif text-2xl italic tabular-nums text-ink">
              From {formatNaira(price)}
            </p>
            <Link
              href="/products/rebrows-brow-tint-kit"
              className={ui.btnPrimary}
            >
              Shop brow tint kit
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
