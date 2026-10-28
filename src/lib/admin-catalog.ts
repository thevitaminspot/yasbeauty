import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateCatalog() {
  revalidateTag("catalog-products", "max");
  revalidateTag("catalog-services", "max");
  revalidateTag("catalog-prices", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/services");
  revalidatePath("/shop");
  revalidatePath("/services");
  revalidatePath("/book");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
