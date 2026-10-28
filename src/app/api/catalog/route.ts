import { NextResponse } from "next/server";
import { readProducts } from "@/lib/products-store";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json({ products });
}
