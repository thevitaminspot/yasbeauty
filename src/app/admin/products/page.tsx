import { ProductsManager } from "@/components/admin/products-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { readProducts } from "@/lib/products-store";

export const metadata = { title: "Products" };
export const instant = false;

export default async function AdminProductsPage() {
  const products = await readProducts();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Shop"
        title="Products"
        description="Add, edit, or remove catalog items. Stock updates when orders are paid."
      />
      <ProductsManager products={products} />
    </div>
  );
}
