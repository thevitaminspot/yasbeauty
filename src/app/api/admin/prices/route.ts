import { NextResponse } from "next/server";
import { revalidateCatalog } from "@/lib/admin-catalog";
import { readProducts, writeProducts } from "@/lib/products-store";
import { isStoreAdmin } from "@/lib/store-admin";

export async function GET() {
  if (!(await isStoreAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await readProducts();
  const items = products.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    defaultPrice: item.price,
    price: item.price,
  }));

  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  if (!(await isStoreAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let updates: { id: string; price: number }[] = [];
  try {
    const body = (await request.json()) as {
      updates?: { id: string; price: number }[];
    };
    updates = body.updates ?? [];
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const products = await readProducts();
  for (const row of updates) {
    const index = products.findIndex((p) => p.id === row.id);
    if (index < 0) {
      return NextResponse.json(
        { error: `Unknown product id: ${row.id}` },
        { status: 400 },
      );
    }
    if (!Number.isFinite(row.price) || row.price < 100) {
      return NextResponse.json(
        { error: "Price must be at least ₦100" },
        { status: 400 },
      );
    }
    products[index] = {
      ...products[index],
      price: Math.round(row.price),
    };
  }

  await writeProducts(products);
  revalidateCatalog();

  return NextResponse.json({
    ok: true,
    prices: Object.fromEntries(products.map((p) => [p.id, p.price])),
  });
}
