/**
 * Resend receipt + fulfillment emails for an existing order (bypasses Next server-only).
 * Usage: npx dotenv run -f .env -- npx tsx scripts/send-order-email.ts YBA-...
 * Optional 2nd arg: confirmed | packed | sent | delivered | all (default: all)
 */
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const reference = process.argv[2]?.trim();
const mode = (process.argv[3]?.trim() || "all") as
  | "confirmed"
  | "packed"
  | "sent"
  | "delivered"
  | "all";

if (!reference) {
  console.error(
    "Usage: tsx scripts/send-order-email.ts <order-reference> [confirmed|packed|sent|delivered|all]",
  );
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

function resolveFrom() {
  const configured =
    process.env.RESEND_FROM?.trim() ||
    "Yas Beauty Allure <onboarding@resend.dev>";
  if (process.env.RESEND_USE_DEV_FROM === "1") {
    return "Yas Beauty Allure <onboarding@resend.dev>";
  }
  return configured;
}

const from = resolveFrom();
const adminTo = (
  process.env.RESEND_ADMIN_TO ||
  process.env.STORE_ADMIN_EMAILS ||
  ""
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const replyTo = "yasbeautyallure6@gmail.com";
const configuredSite = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
// Email clients cannot load localhost images — prefer production when local.
const siteUrl =
  /localhost|127\.0\.0\.1/.test(configuredSite)
    ? "https://www.yasbeautyallure.com"
    : configuredSite;
const brandName = "Yas Beauty Allure";
const logo = `${siteUrl}/brand/yba-logo.png`;

function naira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<body style="margin:0;background:#fafafa;font-family:Georgia,'Times New Roman',serif;color:#111">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fff;border:1px solid #e5e5e5;padding:28px 24px">
          <tr>
            <td style="padding-bottom:20px;border-bottom:1px solid #f0f0f0">
              <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;color:#111">
                <img src="${escapeHtml(logo)}" width="56" height="56" alt="${escapeHtml(brandName)}" style="display:block;border:0;border-radius:999px;background:#fff" />
                <span style="display:inline-block;margin-top:10px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#737373">${escapeHtml(brandName)}</span>
              </a>
            </td>
          </tr>
          <tr><td style="padding-top:20px;font-size:28px;font-style:italic;line-height:1.2">${escapeHtml(title)}</td></tr>
          <tr><td style="padding-top:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#404040">${bodyHtml}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const fulfillmentCopy = {
  packed: {
    title: "Order packed",
    customerLead: "Your order is packed and ready for dispatch.",
    adminLead: "Order marked packed.",
    label: "Packed",
  },
  sent: {
    title: "Out for delivery",
    customerLead:
      "Your package has been sent for delivery. Please keep your phone nearby.",
    adminLead: "Order marked sent for delivery.",
    label: "Sent",
  },
  delivered: {
    title: "Order delivered",
    customerLead:
      "Your order has been marked as delivered. We hope you love it.",
    adminLead: "Order marked delivered.",
    label: "Delivered",
  },
} as const;

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
    .map((i) => `${i.quantity}× ${i.name} — ${naira(i.unitPrice * i.quantity)}`)
    .join("\n");
  const delivery = order.delivery
    ? `Delivery (${order.delivery.areaName}): ${naira(order.delivery.fee)}`
    : "";
  const name = order.customer.name || "there";
  const resend = new Resend(apiKey);

  console.log("From:", from);
  console.log("Logo:", logo);
  console.log("Customer:", order.email);
  console.log("Admin:", adminTo.join(", ") || "(none)");
  console.log("Mode:", mode);

  async function sendPair(opts: {
    customerSubject: string;
    customerTitle: string;
    customerBody: string;
    customerText: string;
    adminSubject: string;
    adminTitle: string;
    adminBody: string;
    adminText: string;
  }) {
    const customer = await resend.emails.send({
      from,
      to: order!.email,
      replyTo,
      subject: opts.customerSubject,
      html: layout(opts.customerTitle, opts.customerBody),
      text: opts.customerText,
    });
    console.log("customer:", customer.error ?? customer.data);

    if (adminTo.length) {
      const admin = await resend.emails.send({
        from,
        to: adminTo,
        replyTo,
        subject: opts.adminSubject,
        html: layout(opts.adminTitle, opts.adminBody),
        text: opts.adminText,
      });
      console.log("admin:", admin.error ?? admin.data);
    }
  }

  const sendConfirmed = mode === "all" || mode === "confirmed";
  if (sendConfirmed) {
    console.log("\n— confirmed —");
    await sendPair({
      customerSubject: `Order confirmed · ${order.reference}`,
      customerTitle: "Order confirmed",
      customerBody: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for your order with ${escapeHtml(brandName)}. We’ve received payment and will prepare your package.</p><p><strong>Reference:</strong> ${escapeHtml(order.reference)}<br/><strong>Total:</strong> ${escapeHtml(total)}</p><p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p><p>Ship to:<br/>${escapeHtml(order.customer.address)}<br/>${escapeHtml(order.customer.city)}</p><p><a href="${escapeHtml(`${siteUrl}/account/orders/${order.reference}`)}" style="color:#111">View order</a></p>`,
      customerText: `Hi ${name},\n\nOrder ${order.reference} · ${total}\n\n${items}\n${delivery}`,
      adminSubject: `New order · ${order.reference} · ${total}`,
      adminTitle: "New order",
      adminBody: `<p>New paid order.</p><p><strong>${escapeHtml(order.customer.name)}</strong><br/>${escapeHtml(order.email)} · ${escapeHtml(order.customer.phone)}</p><p><strong>Reference:</strong> ${escapeHtml(order.reference)}<br/><strong>Total:</strong> ${escapeHtml(total)}</p><p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p><p><a href="${escapeHtml(`${siteUrl}/admin/orders`)}" style="color:#111">Open admin orders</a></p>`,
      adminText: `New order ${order.reference} · ${total}\n${order.email}\n${items}`,
    });
  }

  const statuses = (["packed", "sent", "delivered"] as const).filter(
    (s) => mode === "all" || mode === s,
  );

  for (const status of statuses) {
    const copy = fulfillmentCopy[status];
    console.log(`\n— ${status} —`);
    await sendPair({
      customerSubject: `${copy.title} · ${order.reference}`,
      customerTitle: copy.title,
      customerBody: `<p>Hi ${escapeHtml(name)},</p><p>${escapeHtml(copy.customerLead)}</p><p><strong>Status:</strong> ${escapeHtml(copy.label)}<br/><strong>Reference:</strong> ${escapeHtml(order.reference)}<br/><strong>Total:</strong> ${escapeHtml(total)}</p><p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p><p><a href="${escapeHtml(`${siteUrl}/account/orders/${order.reference}`)}" style="color:#111">Track order</a></p>`,
      customerText: `Hi ${name},\n\n${copy.customerLead}\n\nStatus: ${copy.label}\nReference: ${order.reference}\nTotal: ${total}`,
      adminSubject: `${copy.title} · ${order.reference}`,
      adminTitle: copy.title,
      adminBody: `<p>${escapeHtml(copy.adminLead)}</p><p><strong>${escapeHtml(order.customer.name || "Customer")}</strong><br/>${escapeHtml(order.email)} · ${escapeHtml(order.customer.phone || "—")}</p><p><strong>Status:</strong> ${escapeHtml(copy.label)}<br/><strong>Reference:</strong> ${escapeHtml(order.reference)}</p><p><a href="${escapeHtml(`${siteUrl}/admin/orders`)}" style="color:#111">Open admin orders</a></p>`,
      adminText: `${copy.adminLead}\n${order.reference}\n${order.email}`,
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
