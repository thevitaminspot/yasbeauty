import "server-only";
import { Resend } from "resend";
import { formatNaira } from "@/lib/format";
import { getSiteUrl } from "@/lib/paystack";
import { site } from "@/lib/site";
import type { BookingRequest } from "@/lib/bookings-store";
import type { StoredOrder } from "@/lib/orders-store";

function resendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function fromAddress() {
  return (
    process.env.RESEND_FROM?.trim() ||
    `${site.name} <onboarding@resend.dev>`
  );
}

function adminRecipients(): string[] {
  const explicit = process.env.RESEND_ADMIN_TO?.trim();
  if (explicit) {
    return explicit
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  }
  const fromStore =
    process.env.STORE_ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  if (fromStore.length > 0) return fromStore;
  return [site.email];
}

async function sendMail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}) {
  const client = resendClient();
  if (!client) {
    console.warn("[mail] RESEND_API_KEY missing — skipped:", input.subject);
    return { ok: false as const, skipped: true as const };
  }

  const to = (Array.isArray(input.to) ? input.to : [input.to])
    .map((e) => e.trim())
    .filter(Boolean);
  if (to.length === 0) {
    return { ok: false as const, skipped: true as const };
  }

  const { error } = await client.emails.send(
    {
      from: fromAddress(),
      to,
      replyTo: site.email,
      subject: input.subject,
      html: input.html,
      text: input.text,
    },
    input.idempotencyKey
      ? { idempotencyKey: input.idempotencyKey }
      : undefined,
  );

  if (error) {
    console.error("[mail] send failed:", error);
    return { ok: false as const, error };
  }
  return { ok: true as const };
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
          <tr><td style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#737373">${escapeHtml(site.name)}</td></tr>
          <tr><td style="padding-top:12px;font-size:28px;font-style:italic;line-height:1.2">${escapeHtml(title)}</td></tr>
          <tr><td style="padding-top:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#404040">${bodyHtml}</td></tr>
          <tr><td style="padding-top:28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;line-height:1.5;color:#737373">
            ${escapeHtml(site.address.full)} · <a href="mailto:${escapeHtml(site.email)}" style="color:#111">${escapeHtml(site.email)}</a> · ${escapeHtml(site.phone)}
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function orderLines(order: StoredOrder) {
  const items = order.items
    .map(
      (item) =>
        `${item.quantity}× ${item.name} — ${formatNaira(item.unitPrice * item.quantity)}`,
    )
    .join("\n");
  const delivery = order.delivery
    ? `Delivery (${order.delivery.areaName}): ${formatNaira(order.delivery.fee)}`
    : null;
  return { items, delivery };
}

export async function sendOrderEmails(order: StoredOrder) {
  const siteUrl = getSiteUrl();
  const total = formatNaira(order.amount / 100);
  const { items, delivery } = orderLines(order);
  const name = order.customer.name || "there";

  const customerBody = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks for your order with ${escapeHtml(site.name)}. We’ve received payment and will prepare your package.</p>
    <p><strong>Reference:</strong> ${escapeHtml(order.reference)}<br/>
    <strong>Total:</strong> ${escapeHtml(total)}</p>
    <p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p>
    <p>Ship to:<br/>
    ${escapeHtml(order.customer.address)}<br/>
    ${escapeHtml(order.customer.city)}</p>
    <p><a href="${escapeHtml(`${siteUrl}/account/orders/${order.reference}`)}" style="color:#111">View order</a></p>
  `;

  const adminBody = `
    <p>New paid order.</p>
    <p><strong>${escapeHtml(order.customer.name || "Customer")}</strong><br/>
    ${escapeHtml(order.email)} · ${escapeHtml(order.customer.phone || "—")}</p>
    <p><strong>Reference:</strong> ${escapeHtml(order.reference)}<br/>
    <strong>Total:</strong> ${escapeHtml(total)}</p>
    <p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p>
    ${order.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>` : ""}
    <p><a href="${escapeHtml(`${siteUrl}/admin/orders`)}" style="color:#111">Open admin orders</a></p>
  `;

  await Promise.all([
    sendMail({
      to: order.email,
      subject: `Order confirmed · ${order.reference}`,
      html: layout("Order confirmed", customerBody),
      text: `Hi ${name},\n\nThanks for your order (${order.reference}). Total ${total}.\n\n${items}\n${delivery ?? ""}\n\nView: ${siteUrl}/account/orders/${order.reference}`,
      idempotencyKey: `order-customer/${order.reference}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `New order · ${order.reference} · ${total}`,
      html: layout("New order", adminBody),
      text: `New order ${order.reference} · ${total}\n${order.email}\n${items}`,
      idempotencyKey: `order-admin/${order.reference}`,
    }),
  ]);
}

export async function sendBookingEmails(booking: BookingRequest) {
  const siteUrl = getSiteUrl();
  const deposit = formatNaira(booking.depositAmount / 100);
  const when = `${booking.preferredDate}${booking.preferredTime ? ` · ${booking.preferredTime}` : ""}`;

  const customerBody = `
    <p>Hi ${escapeHtml(booking.name)},</p>
    <p>Your deposit for <strong>${escapeHtml(booking.serviceName)}</strong> is confirmed. We’ll hold your chair and follow up with details.</p>
    <p><strong>When:</strong> ${escapeHtml(when)}<br/>
    <strong>Deposit:</strong> ${escapeHtml(deposit)}<br/>
    <strong>Reference:</strong> ${escapeHtml(booking.depositReference ?? booking.id)}</p>
    <p><a href="${escapeHtml(`${siteUrl}/account/bookings/${booking.id}`)}" style="color:#111">View booking</a></p>
  `;

  const adminBody = `
    <p>Booking deposit paid.</p>
    <p><strong>${escapeHtml(booking.name)}</strong><br/>
    ${escapeHtml(booking.email)} · ${escapeHtml(booking.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(booking.serviceName)}<br/>
    <strong>When:</strong> ${escapeHtml(when)}<br/>
    <strong>Deposit:</strong> ${escapeHtml(deposit)}</p>
    ${booking.notes ? `<p><strong>Notes:</strong> ${escapeHtml(booking.notes)}</p>` : ""}
    <p><a href="${escapeHtml(`${siteUrl}/admin/bookings`)}" style="color:#111">Open admin bookings</a></p>
  `;

  await Promise.all([
    sendMail({
      to: booking.email,
      subject: `Booking deposit confirmed · ${booking.serviceName}`,
      html: layout("Chair reserved", customerBody),
      text: `Hi ${booking.name},\n\nDeposit confirmed for ${booking.serviceName} (${when}). Deposit ${deposit}.\n\nView: ${siteUrl}/account/bookings/${booking.id}`,
      idempotencyKey: `booking-customer/${booking.id}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `Booking paid · ${booking.serviceName} · ${booking.name}`,
      html: layout("Booking deposit paid", adminBody),
      text: `Booking ${booking.id} · ${booking.serviceName} · ${booking.email} · ${deposit}`,
      idempotencyKey: `booking-admin/${booking.id}`,
    }),
  ]);
}
