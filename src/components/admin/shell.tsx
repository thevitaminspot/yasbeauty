"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AdminMobileBar,
  AdminSidebar,
  currentAdminPage,
  useAdminMobileNav,
} from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mobile = useAdminMobileNav();
  const page = currentAdminPage(pathname);
  const onHelp = pathname === "/admin/help";

  return (
    <div className="min-h-screen bg-neutral-50 md:flex">
      <AdminSidebar
        mobileOpen={mobile.open}
        onMobileClose={mobile.closeMenu}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileBar
          onOpen={mobile.openMenu}
          groupLabel={page?.group}
          pageLabel={page?.label}
        />

        <div className="hidden items-center justify-between gap-4 border-b border-neutral-200 bg-white/80 px-10 py-3.5 backdrop-blur-sm md:flex">
          {page ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              {page.group}
              <span className="mx-2 text-neutral-300">/</span>
              <span className="text-neutral-600">{page.label}</span>
            </p>
          ) : (
            <span />
          )}
          {!onHelp ? (
            <Link
              href="/admin/help"
              className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:border-black hover:text-black"
            >
              Help
            </Link>
          ) : null}
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
