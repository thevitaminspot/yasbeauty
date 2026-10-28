import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { formatNaira } from "@/lib/format";
import { ui } from "@/lib/ui";
import {
  getAllProductSlugs,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <nav className={`${ui.eyebrow}`}>
        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>
        <span className="mx-2 text-neutral-300">/</span>
        <Link
          href={`/collections/${product.category}`}
          className="hover:text-black"
        >
          {product.category.replace("-", " ")}
        </Link>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] bg-neutral-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className={`${ui.eyebrow}`}>
            {product.volume} · For professional use only
          </p>
          <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-medium italic leading-[1.05] tracking-[-0.02em]">
            {product.name}
          </h1>
          {product.shade ? (
            <p className="mt-2 text-sm text-neutral-600">Shade: {product.shade}</p>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            {product.tagline}
          </p>
          <p className="mt-6 text-2xl font-medium">
            {formatNaira(product.price)}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <p className="mt-8 text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <dl className="mt-10 space-y-6 border-t border-neutral-200 pt-10 text-sm">
            <div>
              <dt className={`${ui.eyebrow}`}>Ingredients</dt>
              <dd className="mt-2 text-neutral-700">{product.ingredients}</dd>
            </div>
            <div>
              <dt className={`${ui.eyebrow}`}>Usage</dt>
              <dd className="mt-2 text-neutral-700">{product.usage}</dd>
            </div>
            <div>
              <dt className={`${ui.eyebrow}`}>Cautions</dt>
              <dd className="mt-2">
                <ul className="list-inside list-disc space-y-1 text-neutral-700">
                  {product.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24 border-t border-neutral-200 pt-16">
          <h2 className={`${ui.sectionTitle}`}>You may also need</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, index) => (
              <ProductCard key={p.id} product={p} delay={index * 70} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default function ProductPage(props: Props) {
  return (
    <div className={`${ui.pageShell}`}>
      <Suspense
        fallback={
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16" aria-hidden>
            <div className="aspect-[4/5] animate-pulse bg-neutral-100" />
            <div className="space-y-4 pt-8">
              <div className="h-3 w-40 animate-pulse bg-neutral-100" />
              <div className="h-12 w-3/4 animate-pulse bg-neutral-100" />
              <div className="h-4 w-full animate-pulse bg-neutral-100" />
              <div className="h-4 w-2/3 animate-pulse bg-neutral-100" />
            </div>
          </div>
        }
      >
        <ProductDetail params={props.params} />
      </Suspense>
    </div>
  );
}
