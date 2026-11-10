import { HomeArtists } from "@/components/home-artists";
import { HomeClients } from "@/components/home-clients";
import { HomeCollections } from "@/components/home-collections";
import { HomeContact } from "@/components/home-contact";
import { HomeCraft } from "@/components/home-craft";
import { HomeHero } from "@/components/home-hero";
import { HomeShadeStudio } from "@/components/home-shade-studio";
import { HomeStudio } from "@/components/home-studio";
import { HomeStudioLine } from "@/components/home-studio-line";
import { HomeTintEdge } from "@/components/home-tint-edge";
import { getProducts } from "@/lib/products";
import { homeStudioSlugs } from "@/lib/services";
import { getServices } from "@/lib/studio-services";

export default async function HomePage() {
  const products = await getProducts();
  const services = await getServices();
  const carousel = [
    ...products.filter((p) => p.category === "kits" || p.category === "aftercare"),
    ...products.filter((p) => p.featured || p.bestseller),
  ]
    .filter(
      (product, index, list) =>
        list.findIndex((item) => item.id === product.id) === index,
    )
    .slice(0, 10);

  const studioLineIds = [
    "kit-lamination",
    "kit-brow-tint",
    "aftercare-calming-gel",
    "aftercare-advanced-serum",
  ] as const;
  const studioLine = studioLineIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const tintKit = products.find((p) => p.id === "kit-brow-tint");

  const preferred = homeStudioSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const featuredServices = services.filter((s) => s.featured).slice(0, 3);
  const studio =
    preferred.length >= 3
      ? preferred
      : featuredServices.length >= 3
        ? featuredServices
        : services.slice(0, 3);

  return (
    <>
      <HomeHero />
      <HomeCollections products={carousel} />
      <HomeStudioLine products={studioLine} />
      <HomeShadeStudio />
      <HomeTintEdge price={tintKit?.price ?? 45000} />
      <HomeCraft />
      <HomeStudio services={studio} />
      <HomeClients />
      <HomeArtists />
      <HomeContact />
    </>
  );
}
