import { HomeClients } from "@/components/home-clients";
import { HomeCollections } from "@/components/home-collections";
import { HomeContact } from "@/components/home-contact";
import { HomeCtaBanner } from "@/components/home-cta-banner";
import { HomeHero } from "@/components/home-hero";
import { HomeStudio } from "@/components/home-studio";
import { getProducts } from "@/lib/products";
import { homeStudioSlugs } from "@/lib/services";
import { getServices } from "@/lib/studio-services";

export default async function HomePage() {
  const products = await getProducts();
  const services = await getServices();
  const carousel = products.slice(0, 8);
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
      <HomeStudio services={studio} />
      <HomeClients />
      <HomeCtaBanner />
      <HomeContact />
    </>
  );
}
