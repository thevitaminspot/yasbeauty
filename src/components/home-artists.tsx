import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { ui } from "@/lib/ui";

const paths = [
  {
    eyebrow: "For artists",
    title: "Build your kit",
    body: "Lip, brow, and aftercare lines we trust in procedures — wholesale-ready bottles for working PMU artists.",
    href: "/shop",
    cta: "Shop the line",
  },
  {
    eyebrow: "Training",
    title: "Learn the chair",
    body: "Hands-on nano brow and pigment training with the same formulas clients heal with in our Abuja studio.",
    href: "/book?service=training",
    cta: "Reserve a cohort",
  },
  {
    eyebrow: "Studio clients",
    title: "Book a procedure",
    body: "Nano brows, lip blush, liner — mapped and pigmented in-house. Deposit holds your preferred slot.",
    href: "/book",
    cta: "Book a chair",
  },
] as const;

/**
 * Three clear paths — artists, trainees, clients — without a generic feature grid.
 */
export function HomeArtists() {
  return (
    <section className="border-b border-line bg-paper py-14 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className={ui.eyebrow}>Paths</p>
          <h2 className={`${ui.sectionTitle} mt-3`}>
            Who you are shapes the next step.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4">
            Stock a kit, train with us, or take a chair — each route uses the
            same Yas pigments.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-0 border border-neutral-200 md:mt-14 md:grid-cols-3">
          {paths.map((path, index) => (
            <li
              key={path.href}
              className={`border-neutral-200 ${
                index > 0 ? "border-t md:border-t-0 md:border-l" : ""
              }`}
            >
              <Reveal delay={index * 70} className="h-full">
                <Link
                  href={path.href}
                  className="group flex h-full flex-col p-6 transition hover:bg-neutral-50 sm:p-8"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl italic text-black sm:text-[1.75rem]">
                    {path.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {path.body}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 transition group-hover:text-black">
                    {path.cta}
                    <span aria-hidden className="transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
