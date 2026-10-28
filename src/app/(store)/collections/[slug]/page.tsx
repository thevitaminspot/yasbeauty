import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import type { ProductCategory } from "@/lib/product-types";
import { ui } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return { title: cat.name };
}

async function CollectionDetail({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const items = await getProductsByCategory(slug as ProductCategory);

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title={category.headline}
        lede={category.description}
      />
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            delay={Math.min(index, 7) * 50}
          />
        ))}
      </div>
    </>
  );
}

export default function CollectionPage(props: Props) {
  return (
    <div className={`${ui.pageShell}`}>
      <Suspense
        fallback={
          <div aria-hidden>
            <div className="h-3 w-24 animate-pulse bg-neutral-100" />
            <div className="mt-3 h-12 w-2/3 animate-pulse bg-neutral-100" />
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse bg-neutral-100"
                />
              ))}
            </div>
          </div>
        }
      >
        <CollectionDetail params={props.params} />
      </Suspense>
    </div>
  );
}
