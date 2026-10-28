import { NextResponse } from "next/server";
import { readDeliverySettings } from "@/lib/delivery-store";

export async function GET() {
  const settings = await readDeliverySettings();
  return NextResponse.json(settings);
}
