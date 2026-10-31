/**
 * Resend receipt emails for an existing order (bypasses Next server-only).
 * Usage: npx dotenv -e .env -- npx tsx scripts/send-order-email.ts YBA-...
 */
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const reference = process.argv[2]?.trim();
if (!reference) {
  console.error("Usage: tsx scripts/send-order-email.ts <order-reference>");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error(
    "RESEND_API_KEY is empty. Paste re_… into .env (and Vercel), save, retry.",
  );
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const from =
  process.env.RESEND_FROM?.trim() ||
  "Yas Beauty Allure <onboarding@resend.dev>";
const adminTo = (
  process.env.RESEND_ADMIN_TO ||
  process.env.STORE_ADMIN_EMAILS ||
  ""
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const replyTo = "yasbeautyallure6@gmail.com";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

function naira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

async function main() {
  const sql = neon(databaseUrl!);
  const rows = await sql`
    SELECT reference, email, amount, currency, status, customer, items, delivery, notes
    FROM orders
    WHERE reference = ${reference}
    LIMIT 1
  `;
  const order = rows[0] as
    | {
        reference: string;
        email: string;
        amount: number;
        customer: {
          name: string;
          phone: string;
          city: string;
          address: string;
        };
        items: { name: string; quantity: number; unitPrice: number }[];
        delivery: { areaName: string; fee: number } | null;
        notes: string;
      }
    | undefined;

  if (!order) {
    console.error("Order not found:", reference);
    process.exit(1);
  }

  const total = naira(order.amount / 100);
  const items = order.items
    .map(
      (i) =>
        `${i.quantity}× ${i.name} — ${naira(i.unitPrice * i.quantity)}`,
    )
    .join("\n");
  const delivery = order.delivery
    ? `Delivery (${order.delivery.areaName}): ${naira(order.delivery.fee)}`
    : "";
  const name = order.customer.name || "there";

  const resend = new Resend(apiKey);
  const customerHtml = `<p>Hi ${name},</p><p>Thanks for your order with Yas Beauty Allure. We’ve received payment and will prepare your package.</p><p><strong>Reference:</strong> ${order.reference}<br/><strong>Total:</strong> ${total}</p><pre style="font-family:inherit;white-space:pre-line">${items}${delivery ? `\n${delivery}` : ""}</pre><p>Ship to:<br/>${order.customer.address}<br/>${order.customer.city}</p><p><a href="${siteUrl}/account/orders/${order.reference}">View order</a></p>`;

  const adminHtml = `<p>New paid order.</p><p><strong>${order.customer.name}</strong><br/>${order.email} · ${order.customer.phone}</p><p><strong>Reference:</strong> ${order.reference}<br/><strong>Total:</strong> ${total}</p><pre style="font-family:inherit;white-space:pre-line">${items}${delivery ? `\n${delivery}` : ""}</pre><p><a href="${siteUrl}/admin/orders">Open admin orders</a></p>`;

  console.log("From:", from);
  console.log("Customer:", order.email);
  console.log("Admin:", adminTo.join(", ") || "(none)");

  const customer = await resend.emails.send({
    from,
    to: order.email,
    replyTo,
    subject: `Order confirmed · ${order.reference}`,
    html: customerHtml,
    text: `Hi ${name},\n\nOrder ${order.reference} · ${total}\n\n${items}\n${delivery}`,
  });
  console.log("customer:", customer);

  if (adminTo.length) {
    const admin = await resend.emails.send({
      from,
      to: adminTo,
      replyTo,
      subject: `New order · ${order.reference} · ${total}`,
      html: adminHtml,
      text: `New order ${order.reference} · ${total}\n${order.email}\n${items}`,
    });
    console.log("admin:", admin);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
