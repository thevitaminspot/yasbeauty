import { HomeClients } from "@/components/home-clients";
import { HomeCollections } from "@/components/home-collections";
import { HomeContact } from "@/components/home-contact";
import { HomeCraft } from "@/components/home-craft";
import { HomeHero } from "@/components/home-hero";
import { HomeShadeStudio } from "@/components/home-shade-studio";
import { HomeStudio } from "@/components/home-studio";
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

  const preferred = homeStudioSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const studio =
    preferred.length >= 3
      ? preferred
      : featuredServices.length >= 3
        ? featuredServices
        : services.slice(0, 4);

  return (
    <>
      <HomeHero />
      <HomeCollections products={carousel} />
      <HomeShadeStudio />
      <HomeCraft />
      <HomeStudio services={studio} />
      <HomeClients />
      <HomeContact />
    </>
  );
}
