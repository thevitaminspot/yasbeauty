"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconDashboard(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}

function IconBag(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6.5 8.5h11l-.7 10.2a1.5 1.5 0 0 1-1.5 1.4H8.7a1.5 1.5 0 0 1-1.5-1.4L6.5 8.5Z" strokeLinejoin="round" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPackage(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" strokeLinejoin="round" />
      <path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
    </svg>
  );
}

function IconSpark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

function IconCalendar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" strokeLinecap="round" />
    </svg>
  );
}

function IconClock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

function IconMail(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconTruck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 7.5h11v8H3z" strokeLinejoin="round" />
      <path d="M14 10.5h4.2L21 13.2v2.3h-7v-5Z" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </svg>
  );
}

function IconMenu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="square" />
    </svg>
  );
}

function IconClose(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="square" />
    </svg>
  );
}

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
  icon: ComponentType<{ className?: string }>;
};

const navGroups: { label: string; links: NavLink[] }[] = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Today", exact: true, icon: IconDashboard }],
  },
  {
    label: "Shop",
    links: [
      { href: "/admin/orders", label: "Orders", icon: IconBag },
      { href: "/admin/products", label: "Products", icon: IconPackage },
      { href: "/admin/delivery", label: "Delivery", icon: IconTruck },
    ],
  },
  {
    label: "Studio",
    links: [
      { href: "/admin/bookings", label: "Bookings", icon: IconCalendar },
      { href: "/admin/services", label: "Services", icon: IconSpark },
      { href: "/admin/availability", label: "Hours", icon: IconClock },
    ],
  },
  {
    label: "Inbox",
    links: [{ href: "/admin/messages", label: "Messages", icon: IconMail }],
  },
];

export const adminNavLinks = navGroups.flatMap((group) =>
  group.links.map((link) => ({ ...link, group: group.label })),
);

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-2">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.links.map((link) => {
              const active = isActive(pathname, link.href, link.exact);
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`group flex items-center gap-3 px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white/10 font-medium text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`size-4 shrink-0 ${
                        active
                          ? "text-white"
                          : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                    />
                    <span>{link.label}</span>
                    {active ? (
                      <span
                        className="ml-auto size-1.5 rounded-full bg-white"
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto shrink-0 border-t border-white/10 px-4 py-4">
      <Link
        href="/shop"
        className="flex items-center justify-between border border-white/20 px-3 py-2.5 text-sm text-neutral-200 transition hover:border-white hover:text-white"
      >
        View shop
        <span aria-hidden>→</span>
      </Link>
      <Link
        href="/"
        className="mt-2 block px-1 py-2 text-xs uppercase tracking-[0.16em] text-neutral-500 transition hover:text-neutral-300"
      >
        Storefront
      </Link>
    </div>
  );
}

function SidebarBrand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-5 py-6">
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
        <Image
          src="/brand/yba-logo.png"
          alt=""
          width={36}
          height={36}
          className="size-9 object-contain"
        />
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-lg leading-tight text-white">
          Yas Beauty Allure
        </span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          Admin
        </span>
      </span>
    </Link>
  );
}

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside className="relative hidden md:sticky md:top-0 md:flex md:h-screen md:w-[16.5rem] md:shrink-0 md:flex-col md:border-r md:border-white/10 md:bg-black">
        <div className="relative flex h-full min-h-0 flex-1 flex-col">
          <div className="shrink-0">
            <SidebarBrand />
          </div>
          <SidebarNav pathname={pathname} />
          <SidebarFooter />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full min-h-0 w-[min(100%,17rem)] flex-col bg-black shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 pr-3">
              <SidebarBrand />
              <button
                type="button"
                aria-label="Close"
                onClick={onMobileClose}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <IconClose className="size-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={onMobileClose} />
            <SidebarFooter />
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function AdminMobileBar({
  onOpen,
  pageLabel,
  groupLabel,
}: {
  onOpen: () => void;
  pageLabel?: string;
  groupLabel?: string;
}) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
      <button
        type="button"
        aria-label="Open admin menu"
        onClick={onOpen}
        className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-3 py-2 text-sm"
      >
        <IconMenu className="size-4" aria-hidden />
        Menu
      </button>
      {pageLabel ? (
        <p className="truncate text-right text-[11px] uppercase tracking-[0.12em] text-neutral-500">
          {groupLabel ? `${groupLabel} · ` : null}
          {pageLabel}
        </p>
      ) : null}
    </div>
  );
}

export function useAdminMobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return {
    open,
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
  };
}

export function currentAdminPage(pathname: string) {
  const exact = adminNavLinks.find((link) => link.href === pathname);
  if (exact) return exact;
  return adminNavLinks.find((link) => pathname.startsWith(`${link.href}/`));
}
