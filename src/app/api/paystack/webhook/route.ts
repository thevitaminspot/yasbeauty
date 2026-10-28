import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { fulfillBookingDeposit } from "@/lib/paystack-fulfill-booking";
import { fulfillPaidPaystackOrder } from "@/lib/paystack-fulfill";

function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Paystack Dashboard → Settings → API Keys & Webhooks
 * Webhook URL: https://YOUR_DOMAIN/api/paystack/webhook
 * Events: at least charge.success
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      customer?: { email?: string };
      metadata?: Record<string, unknown>;
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const meta = event.data.metadata ?? {};
    const kind = String(meta.kind ?? "");

    if (kind === "booking_deposit") {
      await fulfillBookingDeposit({
        reference: event.data.reference,
        amount: event.data.amount ?? 0,
        metadata: meta,
      });
    } else {
      await fulfillPaidPaystackOrder({
        reference: event.data.reference,
        status: event.data.status ?? "success",
        amount: event.data.amount ?? 0,
        currency: event.data.currency ?? "NGN",
        email: event.data.customer?.email ?? "",
        metadata: meta,
      });
    }
  }

  return NextResponse.json({ received: true });
}
