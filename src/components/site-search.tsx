"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchSite, type SearchHit } from "@/lib/search-index";

export function SiteSearch({
  className = "",
  onNavigate,
  tone = "light",
  autoFocus = false,
}: {
  className?: string;
  onNavigate?: () => void;
  tone?: "light" | "dark";
  autoFocus?: boolean;
}) {
  const dark = tone === "dark";
  const router = useRouter();
  const listId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [corpus, setCorpus] = useState<SearchHit[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-corpus")
      .then((res) => res.json())
      .then((data: { hits?: SearchHit[] }) => {
        if (!cancelled) setCorpus(data.hits ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setHits(searchSite(query, 8, corpus));
  }, [query, corpus]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goSearchPage() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="sr-only" htmlFor={inputId}>
        Search
      </label>
      <div
        className={`flex items-center border focus-within:border-white ${
          dark
            ? "border-white/25 bg-black text-white"
            : "border-neutral-300 bg-white focus-within:border-black"
        }`}
      >
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder="Search pigments, services…"
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={open && (hits.length > 0 || query.length > 0)}
          aria-controls={listId}
          aria-autocomplete="list"
          className={`w-full min-w-0 bg-transparent px-3 py-3 text-base outline-none sm:py-2 sm:text-sm ${
            dark
              ? "text-white placeholder:text-neutral-500"
              : "placeholder:text-neutral-400"
          }`}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goSearchPage();
            }
            if (e.key === "Escape") {
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
        <button
          type="button"
          aria-label="Search"
          className={`icon-hit inline-flex shrink-0 border-l transition ${
            dark
              ? "border-white/25 text-neutral-300 hover:bg-white hover:text-black"
              : "border-neutral-300 text-neutral-600 hover:bg-black hover:text-white"
          }`}
          onClick={goSearchPage}
        >
          <SearchIcon />
        </button>
      </div>

      {open && query.trim() ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto border border-neutral-200 bg-white shadow-sm"
        >
          {hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500">No matches</p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={`${hit.type}-${hit.id}`}>
                  <Link
                    href={hit.href}
                    role="option"
                    className="block px-4 py-3 transition hover:bg-neutral-50"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      onNavigate?.();
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      {hit.type}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-black">
                      {hit.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-neutral-500">
                      {hit.subtitle}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="w-full border-t border-neutral-200 px-4 py-2.5 text-left text-xs uppercase tracking-[0.2em] text-neutral-600 transition hover:bg-neutral-50 hover:text-black"
            onClick={goSearchPage}
          >
            View all results
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 20 20" strokeLinecap="round" />
    </svg>
  );
}
