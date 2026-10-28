import { Suspense } from "react";
import { ShopContent } from "@/app/(store)/shop/shop-content";
import { PageHeader } from "@/components/page-header";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "Shop",
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
    <div className={`${ui.pageShell}`}>
      <PageHeader
        eyebrow="Retail"
        title="Shop"
        lede="Semi-permanent nano pigments and aftercare. Product photos match the shade printed on each bottle."
      />

      <Suspense
        fallback={
          <div className="mt-14 h-40 animate-pulse bg-neutral-100" aria-hidden />
        }
      >
        <ShopGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
