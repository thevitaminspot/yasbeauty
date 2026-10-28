"use client";

import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { SiteSearch } from "@/components/site-search";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5 md:gap-6 md:px-8 md:py-4">
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

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <SiteSearch tone="dark" className="hidden w-48 xl:block xl:w-56" />

          <button
            type="button"
            className="nav-search-toggle text-white transition hover:opacity-60"
            aria-label="Open search"
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
              <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-medium leading-none text-black">
                {bagCount > 99 ? "99+" : bagCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="nav-menu-toggle text-white transition hover:opacity-60 lg:hidden"
            aria-expanded={open}
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

      {searchOpen && (
        <div className="nav-search-panel border-t border-white/10 bg-black px-4 py-3 sm:px-5 md:px-8">
          <SiteSearch
            tone="dark"
            onNavigate={() => setSearchOpen(false)}
            className="w-full"
          />
        </div>
      )}

      {open && (
        <nav
          className="nav-mobile-panel border-t border-white/10 bg-black lg:hidden"
          aria-label="Mobile"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-1 sm:px-5 md:px-8">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block border-b border-white/10 py-3.5 text-sm uppercase tracking-[0.2em] ${
                      active ? "text-white" : "text-neutral-400"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/search"
                className="block border-b border-white/10 py-3.5 text-sm uppercase tracking-[0.2em] text-neutral-400 sm:hidden"
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="block py-3.5 text-sm uppercase tracking-[0.2em] text-neutral-400 sm:hidden"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
            </li>
          </ul>
        </nav>
      )}
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
