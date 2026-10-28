import { NextResponse } from "next/server";
import { getPaystackPublicKey, isPaystackConfigured } from "@/lib/paystack";

export async function GET() {
  return NextResponse.json({
    enabled: isPaystackConfigured(),
    publicKey: getPaystackPublicKey() ?? null,
  });
}
