import { NextResponse } from "next/server";
import { bookingDepositNaira } from "@/lib/booking-deposit";
import { appendBooking } from "@/lib/bookings-store";
import { nairaToKobo } from "@/lib/paystack";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getServiceBySlug } from "@/lib/studio-services";

type Body = {
  serviceSlug: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "booking");
  if (limited) return limited;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const service = await getServiceBySlug(body.serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.phone?.trim() || !body.preferredDate) {
    return NextResponse.json(
      { error: "Name, phone, and preferred date are required" },
      { status: 400 },
    );
  }

  const email = body.email?.trim() ?? "";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Email is required to pay your deposit." },
      { status: 400 },
    );
  }

  const booking = await appendBooking({
    serviceId: service.id,
    serviceName: service.name,
    name: body.name.trim(),
    phone: body.phone.trim(),
    email,
    preferredDate: body.preferredDate,
    preferredTime: body.preferredTime?.trim() ?? "",
    notes: body.notes?.trim() ?? "",
    depositAmount: nairaToKobo(bookingDepositNaira(service)),
    depositReference: null,
  });

  return NextResponse.json({
    ok: true,
    booking,
    depositNaira: bookingDepositNaira(service),
  });
}
