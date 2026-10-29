import Link from "next/link";
import { FooterAccountLinks } from "@/components/footer-account-links";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const explore = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
] as const;

const legal = [
  { href: "/shipping", label: "Shipping & returns" },
  { href: "/privacy", label: "Privacy & cookies" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-8 md:pt-20 md:pb-12">
        <Reveal className="flex flex-col gap-10 border-b border-white/15 pb-12 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-xl">
            <Logo variant="inverse" size="lg" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
              Nano pigments and PMU studio appointments in {site.address.label}.
              Est. 2019.
            </p>
          </div>

          <Link
            href="/book"
            className="inline-flex w-fit border border-white/70 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Book a chair
          </Link>
        </Reveal>

        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
              Explore
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-300 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <FooterAccountLinks />
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
              Studio
            </p>
            <ul className="mt-5 space-y-3 text-sm text-neutral-300">
              <li>{site.address.full}</li>
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  WhatsApp {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition hover:text-white"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
              Policies
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-300 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-neutral-500">
              Pigments are for professional use only.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-neutral-300 transition hover:text-white"
            >
              Instagram {site.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[11px] uppercase tracking-[0.18em] text-neutral-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© 2026 {site.name}</p>
          <p>Abuja · Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
