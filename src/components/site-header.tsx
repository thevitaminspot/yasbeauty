"use client";

import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { SiteSearch } from "@/components/site-search";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { useCart } from "@/context/cart-context";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, ready: cartReady } = useCart();
  const bagCount = cartReady ? itemCount : 0;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3.5 sm:h-[4.25rem] sm:gap-4 sm:px-5 md:h-[4.5rem] md:gap-6 md:px-8">
        <Logo className="min-w-0 flex-1 pr-1" variant="inverse" />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  active ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions shrink-0">
          <SiteSearch tone="dark" className="hidden w-48 xl:block xl:w-56" />

          <AccountMenu inverse />

          <Link
            href="/cart"
            className="nav-icon relative text-white transition hover:opacity-60"
            aria-label={
              bagCount > 0 ? `Bag, ${bagCount} items` : "Bag"
            }
          >
            <BagIcon />
            {bagCount > 0 ? (
              <span className="nav-bag-badge">
                {bagCount > 99 ? "99+" : bagCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="nav-menu-toggle text-white transition hover:opacity-60 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="nav-mobile-drawer fixed inset-0 z-[60] flex flex-col bg-black lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3.5 sm:h-[4.25rem] sm:px-5">
            <Logo className="min-w-0 flex-1 pr-2" variant="inverse" />
            <button
              ref={closeRef}
              type="button"
              className="nav-icon text-white transition hover:opacity-60"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <CloseIcon />
            </button>
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8"
            aria-label="Mobile"
          >
            <ul className="flex flex-col">
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block border-b border-white/10 py-5 font-serif text-[1.75rem] italic leading-none tracking-tight transition sm:text-[2rem] ${
                        active ? "text-white" : "text-neutral-400"
                      }`}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-8 space-y-1">
              <li>
                <Link
                  href="/search"
                  className="flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
                  onClick={closeMenu}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
                  onClick={closeMenu}
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
                  onClick={closeMenu}
                >
                  Bag
                  {bagCount > 0 ? (
                    <span className="ml-2 text-white">({bagCount})</span>
                  ) : null}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="shrink-0 border-t border-white/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
            <Link
              href="/book"
              onClick={closeMenu}
              className="flex min-h-11 w-full items-center justify-center border border-white bg-white px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
            >
              Book studio
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path
        d="M6.5 8.5h11l-.7 10.2a1.5 1.5 0 0 1-1.5 1.4H8.7a1.5 1.5 0 0 1-1.5-1.4L6.5 8.5Z"
        strokeLinejoin="round"
      />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
    </svg>
  );
}
