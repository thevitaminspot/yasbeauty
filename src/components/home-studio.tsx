import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { ServicePrice } from "@/components/service-price";
import type { StudioService } from "@/lib/services";
import { ui } from "@/lib/ui";

export function HomeStudio({ services }: { services: StudioService[] }) {
  const [lead, ...rest] = services;
  if (!lead) return null;

  return (
    <section className={ui.sectionPad}>
      <div className={ui.sectionShell}>
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={ui.eyebrow}>Studio</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>Book a chair</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
              PMU services using the same Yas Beauty Allure pigments we sell.
            </p>
          </div>
          <Link href="/services" className={ui.btnGhost}>
            All services →
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:items-start">
          <Reveal>
            <Link
              href={`/book?service=${lead.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-paper-2 sm:aspect-[5/6] lg:aspect-[4/5]"
            >
              <Image
                src={lead.image}
                alt={lead.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:1024px) 100vw, 55vw"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                  {lead.duration}
                </p>
                <h3 className="mt-1 font-serif text-2xl italic text-white sm:text-3xl">
                  {lead.name}
                </h3>
                <p className="mt-2 text-sm text-white/85">
                  <ServicePrice service={lead} prefix="From " />
                </p>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <ul className="divide-y divide-line border-y border-line">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition sm:py-5"
                  >
                    <span className="min-w-0">
                      <span className="block font-serif text-xl italic text-ink transition group-hover:opacity-70 sm:text-2xl">
                        {service.name}
                      </span>
                      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                        {service.duration}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                      <ServicePrice service={service} prefix="From " />
                      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400 transition group-hover:text-ink">
                        Book →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/book" className={`${ui.btnPrimary} mt-6 w-full sm:w-fit`}>
              Book a chair
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
