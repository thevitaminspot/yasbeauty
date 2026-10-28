"use client";

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

        {page ? (
          <div className="hidden border-b border-neutral-200 bg-white/80 px-10 py-3.5 backdrop-blur-sm md:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              {page.group}
              <span className="mx-2 text-neutral-300">/</span>
              <span className="text-neutral-600">{page.label}</span>
            </p>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
