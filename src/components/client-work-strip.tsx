import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { clientWork } from "@/lib/client-work";
import { ui } from "@/lib/ui";

/** Compact previous-client strip for services / studio pages. */
export function ClientWorkStrip({
  limit = 4,
}: {
  limit?: number;
}) {
  const shots = clientWork.slice(0, limit);

  return (
    <section className="mt-16 border-t border-neutral-200 pt-14 sm:mt-20 sm:pt-16">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className={ui.eyebrow}>Previous clients</p>
          <h2 className="mt-3 font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium tracking-[-0.02em]">
            Recent results
          </h2>
        </div>
        <Link href="/#clients" className={`${ui.btnGhost} w-fit`}>
          See more →
        </Link>
      </Reveal>

      <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6">
        {shots.map((shot, index) => (
          <li key={shot.id}>
            <Reveal delay={Math.min(index, 5) * 40}>
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover object-[50%_18%]"
                  sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, 16vw"
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
