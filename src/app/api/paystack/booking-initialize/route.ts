import { NextResponse } from "next/server";
import {
  getBookingById,
  setBookingDepositReference,
} from "@/lib/bookings-store";
import {
  getSiteUrl,
  isPaystackConfigured,
  paystackRequest,
  type PaystackInitializeResponse,
} from "@/lib/paystack";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "checkout");
  if (limited) return limited;

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online deposits aren’t available right now. Please try again later.",
      },
      { status: 503 },
    );
  }

  let body: { bookingId?: string };
  try {
    body = (await request.json()) as { bookingId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const bookingId = body.bookingId?.trim() ?? "";
  if (!bookingId) {
    return NextResponse.json({ error: "Missing booking." }, { status: 400 });
  }

  const booking = await getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.depositPaid) {
    return NextResponse.json(
      { error: "Deposit already paid for this booking." },
      { status: 400 },
    );
  }
  if (booking.depositAmount < 10000) {
    return NextResponse.json(
      { error: "This booking has no deposit due." },
      { status: 400 },
    );
  }
  if (!booking.email.trim()) {
    return NextResponse.json(
      { error: "Email is required to pay the deposit." },
      { status: 400 },
    );
  }

  const reference =
    booking.depositReference ||
    `YBA-BK-${booking.id}-${Math.random().toString(36).slice(2, 7)}`;

  await setBookingDepositReference(booking.id, reference);

  try {
    const result = await paystackRequest<PaystackInitializeResponse>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email: booking.email,
          amount: booking.depositAmount,
          currency: "NGN",
          reference,
          callback_url: `${getSiteUrl()}/book/complete?reference=${encodeURIComponent(reference)}`,
          metadata: {
            kind: "booking_deposit",
            booking_id: booking.id,
            service_name: booking.serviceName,
            customer_name: booking.name,
            customer_phone: booking.phone,
            preferred_date: booking.preferredDate,
            preferred_time: booking.preferredTime,
          },
        }),
      },
    );

    if (!result.status || !result.data?.authorization_url) {
      return NextResponse.json(
        { error: result.message ?? "Could not start deposit payment" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: result.data.reference,
      amount: booking.depositAmount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Deposit initialization failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
