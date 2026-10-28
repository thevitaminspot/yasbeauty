"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { clientWork } from "@/lib/client-work";
import { ui } from "@/lib/ui";

const PREVIEW = 4;

export function HomeClients() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? clientWork : clientWork.slice(0, PREVIEW);
  const hasMore = clientWork.length > PREVIEW;

  return (
    <section
      id="clients"
      className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <Reveal className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl min-w-0">
            <p className={ui.eyebrow}>Previous clients</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>In the chair.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4">
              Nano brows, lashes, and soft finishes from recent Abuja studio
              appointments — the same pigments we sell.
            </p>
          </div>

          <Link
            href="/book"
            className={`${ui.btnPrimary} hidden w-fit md:inline-flex`}
          >
            Book a chair
          </Link>
        </Reveal>

        <div className="mt-6 md:hidden">
          <Link href="/book" className={`${ui.btnPrimary} w-full`}>
            Book a chair
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 md:mt-12 md:grid-cols-4 md:gap-4">
          {visible.map((shot, index) => (
            <li key={shot.id}>
              <Reveal delay={Math.min(index, 7) * 45}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover object-[50%_18%]"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {hasMore ? (
          <div className="mt-8 flex justify-center sm:mt-10">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={ui.btnSecondary}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "See more"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
