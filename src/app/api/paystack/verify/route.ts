import { NextResponse } from "next/server";
import { fulfillBookingDeposit } from "@/lib/paystack-fulfill-booking";
import { fulfillPaidPaystackOrder } from "@/lib/paystack-fulfill";
import {
  isPaystackConfigured,
  paystackRequest,
  type PaystackVerifyResponse,
} from "@/lib/paystack";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "verify");
  if (limited) return limited;

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: "Payment verification isn't available right now." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const result = await paystackRequest<PaystackVerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );

    if (!result.status || !result.data) {
      return NextResponse.json(
        { error: result.message ?? "Verification failed" },
        { status: 400 },
      );
    }

    const meta = (result.data.metadata ?? {}) as Record<string, unknown>;
    const kind = String(meta.kind ?? "");

    if (result.data.status === "success") {
      if (kind === "booking_deposit") {
        await fulfillBookingDeposit({
          reference: result.data.reference,
          amount: result.data.amount,
          metadata: meta,
        });
      } else {
        await fulfillPaidPaystackOrder({
          reference: result.data.reference,
          status: result.data.status,
          amount: result.data.amount,
          currency: result.data.currency,
          email: result.data.customer.email,
          metadata: meta,
        });
      }
    }

    const payStatus = result.data.status;

    return NextResponse.json({
      status: payStatus,
      reference: result.data.reference,
      amount: result.data.amount,
      currency: result.data.currency,
      kind: kind === "booking_deposit" ? "booking_deposit" : "order",
      bookingId:
        kind === "booking_deposit" ? String(meta.booking_id ?? "") : undefined,
      ...(payStatus !== "success"
        ? {
            error:
              payStatus === "abandoned"
                ? "Payment was abandoned before completion."
                : payStatus === "failed"
                  ? "Payment was not successful."
                  : payStatus === "reversed"
                    ? "Payment was reversed."
                    : undefined,
          }
        : {}),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
