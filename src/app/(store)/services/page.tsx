import Image from "next/image";
import Link from "next/link";
import { ClientWorkStrip } from "@/components/client-work-strip";
import { ServicePrice } from "@/components/service-price";
import { site } from "@/lib/site";
import { getServices } from "@/lib/studio-services";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Studio Services",
  description:
    "Book nano brows, lip blush, permanent eyeliner, consultations, and PMU training at Yas Beauty Allure Abuja.",
};

export default async function ServicesPage() {
  const studioServices = await getServices();
  const hero = studioServices[0];

  return (
    <div>
      <section className="border-b border-neutral-200">
        <div className={`${ui.pageShell} grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-14`}>
          <div>
            <p className={ui.eyebrow}>Abuja studio</p>
            <h1 className={`${ui.pageTitle} max-w-[10ch]`}>Chair work.</h1>
            <p className={`${ui.pageLede} max-w-md`}>
              Procedures and training with the pigments we sell — booked with a
              deposit, confirmed by the studio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className={ui.btnPrimary}>
                Book a chair
              </Link>
              <a
                href={`mailto:${site.email}`}
                className={ui.btnSecondary}
              >
                Email the studio
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-6 text-sm sm:max-w-md">
              <div>
                <dt className={ui.eyebrow}>Location</dt>
                <dd className="mt-2 text-neutral-700">{site.address.full}</dd>
              </div>
              <div>
                <dt className={ui.eyebrow}>Deposit</dt>
                <dd className="mt-2 text-neutral-700">
                  ₦15k procedures · ₦250k training
                </dd>
              </div>
            </dl>
          </div>

          {hero ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 45vw"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className={`${ui.pageShell}`}>
        <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <p className={ui.eyebrow}>Menu</p>
            <h2 className="mt-2 font-serif text-[clamp(1.5rem,4vw,2rem)] font-medium tracking-[-0.02em]">
              {studioServices.length} services
            </h2>
          </div>
          <Link href="/book" className={`${ui.btnGhost} hidden sm:inline-flex`}>
            Skip to booking →
          </Link>
        </div>

        <ul className="divide-y divide-neutral-200">
          {studioServices.map((service) => (
            <li key={service.id}>
              <article className="grid gap-5 py-8 sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:gap-8 sm:py-9">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="relative aspect-[4/5] overflow-hidden bg-neutral-100 sm:aspect-square"
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                    sizes="120px"
                  />
                </Link>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    {service.duration}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-medium italic tracking-tight">
                    <Link
                      href={`/book?service=${service.slug}`}
                      className="hover:opacity-70"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
                    {service.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                  <p className="text-sm font-medium tabular-nums">
                    <ServicePrice service={service} />
                  </p>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className={`${ui.btnSecondary} !min-h-11 !px-5 !py-2.5`}
                  >
                    Book
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <ClientWorkStrip limit={6} />
      </div>
    </div>
  );
}
