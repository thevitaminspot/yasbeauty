import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatNaira } from "@/lib/format";
import type { StudioService } from "@/lib/services";
import { ui } from "@/lib/ui";

export function ServiceCard({
  service,
  delay = 0,
}: {
  service: StudioService;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col">
        <Link
          href={`/book?service=${service.slug}`}
          className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
        >
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </Link>
        <div className="mt-4 flex flex-1 flex-col border-t border-neutral-200 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            {service.duration}
          </p>
          <h3 className="mt-2 font-serif text-xl font-medium italic tracking-tight text-black">
            {service.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
            {service.summary}
          </p>
          <p className="mt-4 text-sm font-medium">
            From {formatNaira(service.fromPrice)}
          </p>
          <Link
            href={`/book?service=${service.slug}`}
            className={`${ui.btnSecondary} mt-6 w-fit`}
          >
            Book
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
