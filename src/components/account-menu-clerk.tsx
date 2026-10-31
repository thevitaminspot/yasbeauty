"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { AccountIcon } from "@/components/account-icon";

function AccountAvatar({
  imageUrl,
  inverse,
}: {
  imageUrl?: string | null;
  inverse: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(imageUrl) && !failed;

  if (showPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Clerk CDN avatars; avoid next/image remote config churn
      <img
        src={imageUrl!}
        alt=""
        width={22}
        height={22}
        className="nav-avatar"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={inverse ? "text-white" : "text-black"}>
      <AccountIcon />
    </span>
  );
}

function AccountIconButton({
  inverse,
  imageUrl,
  ...props
}: {
  inverse: boolean;
  imageUrl?: string | null;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`nav-icon transition hover:opacity-60 ${
        inverse ? "text-white" : "text-black"
      }`}
      {...props}
    >
      <AccountAvatar imageUrl={imageUrl} inverse={inverse} />
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
  const { user, isLoaded: userLoaded } = useUser();
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

  // Outline icon while Clerk / user profile is still loading.
  if (!isLoaded || !userLoaded) {
    return <AccountIconLink inverse={inverse} />;
  }

  if (!isSignedIn) {
    return <AccountIconLink inverse={inverse} />;
  }

  const imageUrl = user?.imageUrl ?? null;

  return (
    <div ref={rootRef} className="relative">
      <AccountIconButton
        inverse={inverse}
        imageUrl={imageUrl}
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
