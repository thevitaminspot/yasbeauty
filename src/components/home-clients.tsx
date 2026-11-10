"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { clientWork } from "@/lib/client-work";
import { ui } from "@/lib/ui";

const PREVIEW = 6;

function stageFor(treatment: string) {
  if (treatment === "In chair") return "Day of";
  if (treatment === "Soft glam") return "Finish";
  return "Healed look";
}

export function HomeClients() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? clientWork : clientWork.slice(0, PREVIEW);
  const hasMore = clientWork.length > PREVIEW;
  const [lead, ...rest] = visible;

  if (!lead) return null;

  return (
    <section id="clients" className={ui.sectionPad}>
      <div className={ui.sectionShell}>
        <Reveal className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl min-w-0">
            <p className={ui.eyebrow}>Healed work</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>In the chair.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4">
              Nano brows, lashes, and soft finishes from recent Abuja studio
              appointments — the same pigments we sell.
            </p>
          </div>

          <Link
            href="/book"
            className={`${ui.btnGhost} hidden w-fit md:inline-flex`}
          >
            Book a chair →
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:mt-12 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-7">
            <figure className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-2 sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={lead.src}
                  alt={lead.alt}
                  fill
                  className="object-cover object-[50%_18%] transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width:1024px) 100vw, 58vw"
                  priority={false}
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  {lead.treatment}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {stageFor(lead.treatment)}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {rest.slice(0, 4).map((shot, index) => (
              <Reveal key={shot.id} delay={(index + 1) * 50}>
                <figure className="group">
                  <div
                    className={`relative overflow-hidden bg-paper-2 ${
                      index === 0
                        ? "aspect-[4/5] lg:aspect-[5/4]"
                        : "aspect-[3/4] lg:aspect-[5/3]"
                    }`}
                  >
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      className="object-cover object-[50%_18%] transition duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width:1024px) 50vw, 28vw"
                    />
                  </div>
                  <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                      {shot.treatment}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                      {stageFor(shot.treatment)}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {visible.length > 5 ? (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-4 lg:mt-5">
            {visible.slice(5).map((shot, index) => (
              <li key={shot.id}>
                <Reveal delay={index * 40}>
                  <figure className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        className="object-cover object-[50%_18%] transition duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
                    </div>
                    <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                        {shot.treatment}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                        {stageFor(shot.treatment)}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={ui.btnSecondary}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "See more work"}
            </button>
          ) : null}
          <Link href="/book" className={`${ui.btnPrimary} w-full sm:w-fit md:hidden`}>
            Book a chair
          </Link>
        </div>
      </div>
    </section>
  );
}
