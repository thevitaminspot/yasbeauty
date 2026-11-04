"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: Props) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)] ?? "";

  if (!current) {
    return <div className="relative aspect-[4/5] bg-neutral-100" />;
  }

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/5] bg-neutral-100">
        <Image
          key={current}
          src={current}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      </div>
      {gallery.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
          {gallery.map((src, index) => {
            const selected = index === active;
            return (
              <li key={`${src}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`View image ${index + 1} of ${gallery.length}`}
                  aria-pressed={selected}
                  className={`relative aspect-square w-full overflow-hidden bg-neutral-100 transition ${
                    selected
                      ? "ring-1 ring-black ring-offset-2"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
