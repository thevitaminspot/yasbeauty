import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatNaira } from "@/lib/format";
import type { StudioService } from "@/lib/services";
import { ui } from "@/lib/ui";

export function HomeStudio({ services }: { services: StudioService[] }) {
  return (
    <section className="border-b border-neutral-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={`${ui.eyebrow}`}>Studio</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>Book a chair</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
              PMU services using the same Yas Beauty Allure pigments we sell.
            </p>
          </div>
          <Link href="/services" className={`${ui.btnGhost}`}>
            All services →
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 80}>
              <article className="group">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </Link>
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <h3 className="font-serif text-xl italic text-black">
                    {service.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                    {service.summary}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
                    {service.duration} · from {formatNaira(service.fromPrice)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
