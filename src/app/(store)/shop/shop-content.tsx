import { ShopCatalog } from "@/app/(store)/shop/shop-catalog";
import { getProducts } from "@/lib/products";

type Props = {
  category?: string;
};

export async function ShopContent({ category }: Props) {
  const products = await getProducts();
  return <ShopCatalog products={products} category={category} />;
}
