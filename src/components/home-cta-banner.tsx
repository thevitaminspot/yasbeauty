import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { brandImages } from "@/lib/product-images";
import { ui } from "@/lib/ui";

const lines = [
  {
    href: "/collections/lip-pigments",
    label: "Lip pigments",
    detail: "Blush & permanent lip shades",
    image: brandImages.collectionLips,
  },
  {
    href: "/collections/brow-pigments",
    label: "Brow pigments",
    detail: "Nano brows & liner tones",
    image: brandImages.collectionBrows,
  },
  {
    href: "/collections/aftercare",
    label: "Aftercare",
    detail: "Post-procedure essentials",
    image: brandImages.studio,
  },
] as const;

export function HomeCtaBanner() {
  return (
    <section className="border-t border-neutral-200 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`${ui.sectionTitle}`}>Shop by line</h2>
            <p className="mt-3 max-w-md text-sm text-neutral-600">
              Browse lips, brows, and aftercare — the same stock we use in
              studio.
            </p>
          </div>
          <Link href="/shop" className={`${ui.btnPrimary} w-fit`}>
            View all
          </Link>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {lines.map((line, index) => (
            <li key={line.href}>
              <Reveal delay={index * 80}>
                <Link href={line.href} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </span>
                  <span className="mt-4 flex items-baseline justify-between gap-3 border-t border-neutral-200 pt-4">
                    <span>
                      <span className="block font-serif text-xl italic text-black">
                        {line.label}
                      </span>
                      <span className="mt-1 block text-sm text-neutral-500">
                        {line.detail}
                      </span>
                    </span>
                    <span className="text-sm text-neutral-400 transition group-hover:text-black">
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
