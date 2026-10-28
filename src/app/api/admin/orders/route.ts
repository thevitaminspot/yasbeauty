import { NextResponse } from "next/server";
import { isStoreAdmin } from "@/lib/store-admin";
import { readOrders } from "@/lib/orders-store";

export async function GET() {
  if (!(await isStoreAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await readOrders();
  return NextResponse.json({ orders: orders.slice(0, 50) });
}
