import { Suspense } from "react";
import { ShopContent } from "@/app/(store)/shop/shop-content";
import { PageHeader } from "@/components/page-header";
import { site, whatsappHref } from "@/lib/site";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Shop",
  description:
    "Nano pigments, brow & lash kits, and aftercare from Yas Beauty Allure — photographed from the stock we sell.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

async function ShopGrid({ searchParams }: Props) {
  const { category } = await searchParams;
  return <ShopContent category={category} />;
}

export default function ShopPage(props: Props) {
  return (
    <div className={ui.pageShell}>
      <PageHeader
        eyebrow="Retail"
        title="Shop"
        lede="Nano pigments, kits, and aftercare — photographed from the stock we sell."
      />

      <Suspense
        fallback={
          <div className="mt-10 h-40 animate-pulse bg-neutral-100" aria-hidden />
        }
      >
        <ShopGrid searchParams={props.searchParams} />
      </Suspense>

      <aside className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:mt-20 sm:grid-cols-3">
        {[
          {
            title: "Professional use",
            body: "Pigments and kits for trained artists — not retail cosmetics.",
          },
          {
            title: "Photographed stock",
            body: "Every product shot is from inventory we actually sell.",
          },
          {
            title: "WhatsApp support",
            body: (
              <>
                Shade questions?{" "}
                <a
                  href={whatsappHref(
                    "Hi Yas — I have a question about a product in the shop.",
                  )}
                  className="underline underline-offset-4 hover:text-ink"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message {site.instagramHandle.replace("@", "")}
                </a>
              </>
            ),
          },
        ].map((item) => (
          <div key={item.title} className="bg-surface px-5 py-6 sm:px-6 sm:py-8">
            <p className={ui.eyebrow}>{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.body}
            </p>
          </div>
        ))}
      </aside>
    </div>
  );
}
