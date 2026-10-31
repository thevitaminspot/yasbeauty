import Image from "next/image";
import Link from "next/link";
import { ContactIconRow } from "@/components/contact-icons";
import { Reveal } from "@/components/ui/reveal";
import { brandImages } from "@/lib/product-images";
import { site, whatsappHref } from "@/lib/site";
import { ui } from "@/lib/ui";

/** Closing contact band — one visual plane, one ask */
export function HomeContact() {
  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <Reveal className="relative min-h-[22rem] overflow-hidden bg-neutral-100 lg:min-h-[32rem]">
          <Image
            src={brandImages.studio}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/10"
            aria-hidden
          />
          <p className="absolute bottom-6 left-5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 md:left-8">
            {site.address.label} · Est. 2019
          </p>
        </Reveal>

        <Reveal
          delay={80}
          className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-20 lg:px-14"
        >
          <p className={ui.eyebrow}>Contact</p>
          <h2 className={`${ui.sectionTitle} mt-3`}>Talk to the studio</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            Wholesale kits, pigment questions, or a chair booking — WhatsApp is
            the fastest line. Prefer a written note? Use the contact form.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref("Hi Yas Beauty Allure.")}
              target="_blank"
              rel="noopener noreferrer"
              className={ui.btnPrimary}
            >
              WhatsApp us
            </a>
            <Link href="/contact" className={ui.btnSecondary}>
              Write a note
            </Link>
          </div>

          <div className="mt-12 border-t border-neutral-200 pt-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Studio
            </p>
            <p className="mt-1.5 font-serif text-xl italic text-black">
              {site.address.full}
            </p>
            <ContactIconRow
              tone="onLight"
              includeCall
              className="mt-7"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
