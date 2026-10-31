"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { AccountIcon } from "@/components/account-icon";

function AccountIconButton({
  inverse,
  ...props
}: {
  inverse: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`nav-icon transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      {...props}
    >
      <AccountIcon />
    </button>
  );
}

function AccountIconLink({
  inverse,
  href = "/sign-in",
}: {
  inverse: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`nav-icon transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      aria-label="Account"
    >
      <AccountIcon />
    </Link>
  );
}

export function AccountMenuClerk({ inverse = false }: { inverse?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();
  const clerk = useClerk();
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

  const panel = inverse
    ? "border-white/15 bg-neutral-950 text-white"
    : "border-neutral-200 bg-white text-black";
  const item = inverse
    ? "text-neutral-300 hover:bg-white/5 hover:text-white"
    : "text-neutral-700 hover:bg-neutral-50 hover:text-black";

  // Keep the outline icon stable while Clerk boots / refreshes user data.
  if (!isLoaded) {
    return <AccountIconLink inverse={inverse} />;
  }

  if (!isSignedIn) {
    return <AccountIconLink inverse={inverse} />;
  }

  return (
    <div ref={rootRef} className="relative">
      <AccountIconButton
        inverse={inverse}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      />

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute right-0 top-[calc(100%+0.25rem)] z-[70] w-44 border py-1 shadow-lg ${panel}`}
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
              try {
                clerk.openUserProfile();
              } catch {
                // Profile UI can 404 if Clerk resources are still warming up.
              }
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
              void clerk.signOut({ redirectUrl: "/" });
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
