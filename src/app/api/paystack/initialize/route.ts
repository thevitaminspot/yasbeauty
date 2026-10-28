import { NextResponse } from "next/server";
import {
  readDeliverySettings,
  resolveDeliverySelection,
} from "@/lib/delivery-store";
import type { DeliveryZone } from "@/lib/delivery-types";
import { getProducts } from "@/lib/products";
import {
  getSiteUrl,
  isPaystackConfigured,
  nairaToKobo,
  paystackRequest,
  type PaystackInitializeResponse,
} from "@/lib/paystack";

type LineInput = { id: string; quantity: number };

type InitializeBody = {
  email: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  deliveryZone: DeliveryZone;
  deliveryAreaId?: string;
  lines: LineInput[];
};

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online checkout isn't available right now. Please try again later.",
      },
      { status: 503 },
    );
  }

  let body: InitializeBody;
  try {
    body = (await request.json()) as InitializeBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.email || !body.lines?.length) {
    return NextResponse.json(
      { error: "Email and cart lines are required" },
      { status: 400 },
    );
  }

  const settings = await readDeliverySettings();
  const delivery = resolveDeliverySelection(settings, {
    zone: body.deliveryZone,
    areaId: body.deliveryAreaId,
  });
  if ("error" in delivery) {
    return NextResponse.json({ error: delivery.error }, { status: 400 });
  }

  const catalog = await getProducts();
  let resolved: {
    product: (typeof catalog)[number];
    quantity: number;
  }[];
  try {
    resolved = body.lines.map((line) => {
      const product = catalog.find((p) => p.id === line.id);
      if (!product) throw new Error(`Unknown product: ${line.id}`);
      const stock = Math.max(0, Math.floor(product.stock ?? 0));
      if (stock <= 0) {
        throw new Error(`${product.name} is out of stock.`);
      }
      const quantity = Math.min(Math.max(line.quantity, 1), 20, stock);
      if (quantity < line.quantity) {
        throw new Error(
          `Only ${stock} left of ${product.name}. Update your bag and try again.`,
        );
      }
      return { product, quantity };
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid cart contents",
      },
      { status: 400 },
    );
  }

  const subtotal = resolved.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0,
  );
  const total = subtotal + delivery.fee;

  if (subtotal < 100) {
    return NextResponse.json({ error: "Order total too low" }, { status: 400 });
  }

  const reference = `YBA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const result = await paystackRequest<PaystackInitializeResponse>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email: body.email,
          amount: nairaToKobo(total),
          currency: "NGN",
          reference,
          callback_url: `${getSiteUrl()}/checkout/complete?reference=${reference}`,
          metadata: {
            customer_name: body.name,
            customer_phone: body.phone,
            customer_city: body.city,
            customer_address: body.address,
            notes: body.notes ?? "",
            delivery,
            subtotal,
            delivery_fee: delivery.fee,
            items: resolved.map(({ product, quantity }) => ({
              id: product.id,
              name: product.name,
              quantity,
              unitPrice: product.price,
            })),
          },
        }),
      },
    );

    if (!result.status || !result.data?.authorization_url) {
      return NextResponse.json(
        { error: result.message ?? "Could not start payment" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: result.data.reference,
      subtotal,
      deliveryFee: delivery.fee,
      total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
