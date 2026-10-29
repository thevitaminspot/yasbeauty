"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Analytics } from "@vercel/analytics/next";
import {
  allowsAnalytics,
  readConsentFromDocument,
  writeConsentCookie,
  type ConsentChoice,
} from "@/lib/cookie-consent";

type ConsentContextValue = {
  consent: ConsentChoice | null;
  setConsent: (choice: ConsentChoice) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsentState(readConsentFromDocument());
    setReady(true);
  }, []);

  const setConsent = useCallback((choice: ConsentChoice) => {
    writeConsentCookie(choice);
    setConsentState(choice);
  }, []);

  const value = useMemo(() => ({ consent, setConsent }), [consent, setConsent]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {allowsAnalytics(consent) ? <Analytics /> : null}
      {ready && consent === null ? <CookieBanner onChoose={setConsent} /> : null}
    </ConsentContext.Provider>
  );
}

function CookieBanner({ onChoose }: { onChoose: (choice: ConsentChoice) => void }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral-200 bg-white/95 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0 text-sm leading-relaxed text-neutral-600">
          <p id="cookie-banner-title" className="font-medium text-black">
            Cookies on this site
          </p>
          <p id="cookie-banner-desc" className="mt-1">
            Essential cookies keep sign-in, bag, and checkout working. Optional
            analytics help us see how the shop is used.{" "}
            <Link
              href="/privacy"
              className="text-black underline decoration-neutral-300 underline-offset-2 hover:decoration-black"
            >
              Privacy & cookies
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onChoose("essential")}
            className="border border-neutral-300 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 transition hover:border-black hover:text-black"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => onChoose("all")}
            className="border border-black bg-black px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

export function useCookieConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
