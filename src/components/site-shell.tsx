import { Suspense } from "react";
import { CatalogPriceSync } from "@/components/catalog-price-sync";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CatalogPriceSync />
      <Suspense
        fallback={
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black px-4 py-4 md:px-8">
            <div className="mx-auto h-10 max-w-7xl bg-white/10" />
          </header>
        }
      >
        <SiteHeader />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      <SiteFooter />
    </CartProvider>
  );
}
