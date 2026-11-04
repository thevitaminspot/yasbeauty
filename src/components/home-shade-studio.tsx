"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import {
  shadesForLine,
  type ShadeLine,
} from "@/lib/shade-palette";
import { ui } from "@/lib/ui";

/**
 * Interactive pigment explorer — pick a line, read the shade, open the bottle.
 * Color is the feature; the rest stays black & white.
 */
export function HomeShadeStudio() {
  const [line, setLine] = useState<ShadeLine>("lips");
  const shades = useMemo(() => shadesForLine(line), [line]);
  const [activeId, setActiveId] = useState(shades[0]?.id ?? "");
  const active =
    shades.find((s) => s.id === activeId) ?? shades[0] ?? null;

  function switchLine(next: ShadeLine) {
    setLine(next);
    const first = shadesForLine(next)[0];
    if (first) setActiveId(first.id);
  }

  if (!active) return null;

  return (
    <section className="border-b border-line bg-paper py-14 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl min-w-0">
            <p className={ui.eyebrow}>Shade studio</p>
            <h2 className={`${ui.sectionTitle} mt-3`}>Find the tone.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4">
              Tap a shade the way we brief in-chair — then open the bottle we
              actually use.
            </p>
          </div>

          <div
            className="flex w-fit border border-neutral-300"
            role="tablist"
            aria-label="Pigment line"
          >
            {(
              [
                { id: "lips", label: "Lips" },
                { id: "brows", label: "Brows" },
              ] as const
            ).map((tab) => {
              const on = line === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => switchLine(tab.id)}
                  className={`min-h-11 px-5 text-[11px] font-medium uppercase tracking-[0.18em] transition ${
                    on
                      ? "bg-ink text-paper"
                      : "bg-surface text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <Reveal className="relative min-h-[22rem] overflow-hidden bg-neutral-200 sm:min-h-[26rem] lg:min-h-[32rem]">
            <Image
              key={active.id}
              src={active.image}
              alt={active.name}
              fill
              className="object-cover transition duration-700"
              sizes="(max-width:1024px) 100vw, 55vw"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
              aria-hidden
            />
            <p className="absolute bottom-5 left-5 font-serif text-2xl italic text-white sm:bottom-6 sm:left-6 sm:text-3xl">
              {active.name}
            </p>
          </Reveal>

          <Reveal delay={80} className="flex flex-col justify-between gap-8 bg-surface p-5 sm:p-8 lg:p-10">
            <div>
              <div
                className="aspect-[5/2] w-full border border-line transition-[background-color] duration-500"
                style={{ backgroundColor: active.hex }}
                aria-hidden
              />
              <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                {active.shade}
              </p>
              <h3 className="mt-2 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-medium italic leading-tight tracking-tight text-black">
                {active.tagline}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
                Studio-mixed nano pigment. Healed results guide every bottle we
                put on the shelf.
              </p>
            </div>

            <div>
              <ul
                className="flex flex-wrap gap-2"
                role="listbox"
                aria-label={`${line} shades`}
              >
                {shades.map((shade) => {
                  const selected = shade.id === active.id;
                  return (
                    <li key={shade.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        aria-label={shade.name}
                        title={shade.name}
                        onClick={() => setActiveId(shade.id)}
                        className={`size-10 border transition sm:size-11 ${
                          selected
                            ? "border-black ring-1 ring-black ring-offset-2"
                            : "border-neutral-300 hover:border-neutral-500"
                        }`}
                        style={{ backgroundColor: shade.hex }}
                      />
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/products/${active.slug}`}
                  className={ui.btnPrimary}
                >
                  View {active.name}
                </Link>
                <Link
                  href={
                    line === "lips"
                      ? "/collections/lip-pigments"
                      : "/collections/brow-pigments"
                  }
                  className={ui.btnGhost}
                >
                  Full {line} line →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
