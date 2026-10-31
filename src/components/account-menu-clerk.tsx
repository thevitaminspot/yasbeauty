"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AccountIcon } from "@/components/account-icon";

export function AccountMenuClerk({ inverse = false }: { inverse?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointer(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el || !(e.target instanceof Node) || el.contains(e.target)) return;
      setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tone = inverse ? "text-white" : "text-black";
  const panel = inverse
    ? "border-white/15 bg-neutral-950 text-white"
    : "border-neutral-200 bg-white text-black";
  const item = inverse
    ? "text-neutral-300 hover:bg-white/5 hover:text-white"
    : "text-neutral-700 hover:bg-neutral-50 hover:text-black";

  if (!isLoaded) {
    return (
      <span
        className={`icon-hit inline-flex animate-pulse ${
          inverse ? "bg-white/10" : "bg-neutral-200"
        }`}
        aria-hidden
      />
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className={`icon-hit inline-flex transition hover:opacity-60 ${tone}`}
        aria-label="Account"
      >
        <AccountIcon />
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`icon-hit inline-flex transition hover:opacity-60 ${tone}`}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <AccountIcon />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute right-0 top-full z-[70] mt-1 w-48 border py-1 shadow-lg ${panel}`}
        >
          <Link
            role="menuitem"
            href="/account/orders"
            className={`block px-4 py-2.5 text-sm ${item}`}
            onClick={() => setOpen(false)}
          >
            My orders
          </Link>
          <Link
            role="menuitem"
            href="/account/bookings"
            className={`block px-4 py-2.5 text-sm ${item}`}
            onClick={() => setOpen(false)}
          >
            My bookings
          </Link>
          <button
            type="button"
            role="menuitem"
            className={`block w-full px-4 py-2.5 text-left text-sm ${item}`}
            onClick={() => {
              setOpen(false);
              openUserProfile();
            }}
          >
            Manage account
          </button>
          <button
            type="button"
            role="menuitem"
            className={`block w-full px-4 py-2.5 text-left text-sm ${item}`}
            onClick={() => {
              setOpen(false);
              void signOut({ redirectUrl: "/" });
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
