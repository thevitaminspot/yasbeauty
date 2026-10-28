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
  const [searchOpen, setSearchOpen] = useState(false);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
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
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-[3.75rem] sm:gap-3 sm:px-5 md:h-16 md:gap-6 md:px-8">
        <Logo className="min-w-0 flex-1" variant="inverse" />

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

        <div className="flex shrink-0 items-center">
          <SiteSearch tone="dark" className="hidden w-48 xl:block xl:w-56" />

          <button
            type="button"
            className="nav-search-toggle text-white transition hover:opacity-60 xl:hidden"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setOpen(false);
            }}
          >
            <SearchIcon />
          </button>

          <div className="hidden sm:block">
            <AccountMenu inverse />
          </div>

          <Link
            href="/cart"
            className="icon-hit relative inline-flex text-white transition hover:opacity-60"
            aria-label={
              bagCount > 0 ? `Bag, ${bagCount} items` : "Bag"
            }
          >
            <BagIcon />
            {bagCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-medium leading-none text-black">
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
            onClick={() => {
              setOpen((v) => !v);
              setSearchOpen(false);
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="nav-search-panel border-t border-white/10 bg-black px-3 py-3 sm:px-5 md:px-8 xl:hidden">
          <SiteSearch
            tone="dark"
            onNavigate={() => setSearchOpen(false)}
            className="w-full"
            autoFocus
          />
        </div>
      ) : null}

      {open ? (
        <div
          id={menuId}
          className="nav-mobile-drawer fixed inset-0 z-[60] flex flex-col bg-black lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 sm:h-[3.75rem] sm:px-5">
            <Logo className="min-w-0" variant="inverse" />
            <button
              ref={closeRef}
              type="button"
              className="icon-hit inline-flex text-white transition hover:opacity-60"
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
                  className="flex min-h-12 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
                  onClick={closeMenu}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="flex min-h-12 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white sm:hidden"
                  onClick={closeMenu}
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex min-h-12 items-center text-sm uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
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

          <div className="shrink-0 border-t border-white/10 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
            <Link
              href="/book"
              onClick={closeMenu}
              className="flex min-h-12 w-full items-center justify-center border border-white bg-white px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition hover:bg-neutral-200"
            >
              Book studio
            </Link>
          </div>
        </div>
      ) : null}
    </header>
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
