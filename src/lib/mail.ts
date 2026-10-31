import "server-only";
import { Resend } from "resend";
import { formatNaira } from "@/lib/format";
import {
  fulfillmentLabel,
  type FulfillmentStatus,
} from "@/lib/delivery-types";
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

/** Free inboxes / unverified domains cannot be used as Resend `from`. */
function isUnusableFromDomain(email: string) {
  const host = email.split("@")[1]?.toLowerCase() ?? "";
  return (
    !host ||
    host === "gmail.com" ||
    host === "googlemail.com" ||
    host === "yahoo.com" ||
    host === "yahoo.co.uk" ||
    host === "outlook.com" ||
    host === "hotmail.com" ||
    host === "live.com" ||
    host === "icloud.com" ||
    host === "me.com" ||
    host === "aol.com" ||
    host === "proton.me" ||
    host === "protonmail.com"
  );
}

function parseFrom(raw: string): { name?: string; email: string } | null {
  const angled = raw.match(/^(.*)<([^>]+)>$/);
  if (angled) {
    return {
      name: angled[1]!.trim().replace(/^"|"$/g, "") || undefined,
      email: angled[2]!.trim(),
    };
  }
  if (raw.includes("@")) return { email: raw.trim() };
  return null;
}

function formatFrom(name: string | undefined, email: string) {
  return name ? `${name} <${email}>` : email;
}

/**
 * Prefer RESEND_FROM when it uses a custom/verified domain.
 * Otherwise fall back to Resend's test sender (reply-to stays the studio email).
 */
function fromAddress() {
  const configured = process.env.RESEND_FROM?.trim();
  const fallback = formatFrom(site.name, "onboarding@resend.dev");
  if (!configured) return fallback;

  const parsed = parseFrom(configured);
  if (!parsed || isUnusableFromDomain(parsed.email)) {
    console.warn(
      "[mail] RESEND_FROM is not a verified custom domain — using onboarding@resend.dev. Set RESEND_FROM to an address on your Resend-verified domain.",
    );
    return fallback;
  }
  return formatFrom(parsed.name ?? site.name, parsed.email);
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

async function sendOnce(
  client: Resend,
  input: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
    idempotencyKey?: string;
  },
) {
  return client.emails.send(
    {
      from: input.from,
      to: input.to,
      replyTo: site.email,
      subject: input.subject,
      html: input.html,
      text: input.text,
    },
    input.idempotencyKey
      ? { idempotencyKey: input.idempotencyKey }
      : undefined,
  );
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

  const preferredFrom = fromAddress();
  const fallbackFrom = formatFrom(site.name, "onboarding@resend.dev");
  let from = preferredFrom;
  let { data, error } = await sendOnce(client, { ...input, from, to });

  // Unverified custom domain → retry with Resend test sender.
  if (error && from !== fallbackFrom) {
    console.warn("[mail] preferred from failed, retrying with onboarding@resend.dev:", error);
    from = fallbackFrom;
    ({ data, error } = await sendOnce(client, {
      ...input,
      from,
      to,
      idempotencyKey: input.idempotencyKey
        ? `${input.idempotencyKey}/fallback`
        : undefined,
    }));
  }

  if (error) {
    console.error("[mail] send failed:", {
      subject: input.subject,
      to,
      from,
      error,
    });
    return { ok: false as const, error };
  }

  console.info("[mail] sent:", {
    subject: input.subject,
    to,
    from,
    id: data?.id,
  });
  return { ok: true as const, id: data?.id };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Public site URL for email links/images — never localhost (clients can't load it). */
function emailSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (
    configured &&
    /^https:\/\//i.test(configured) &&
    !/localhost|127\.0\.0\.1/i.test(configured)
  ) {
    return configured;
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://www.yasbeautyallure.com";
}

function logoUrl() {
  // Absolute production asset — email clients block localhost and often skip redirects.
  return "https://www.yasbeautyallure.com/brand/yba-logo.png";
}

function layout(title: string, bodyHtml: string) {
  const logo = logoUrl();
  const siteUrl = emailSiteUrl();
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  return `<!doctype html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,'Times New Roman',serif;color:#111111">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7">
          <tr>
            <td style="background:#0a0a0a;padding:22px 28px">
              <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;color:#ffffff">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;padding-right:14px">
                      <img src="${escapeHtml(logo)}" width="48" height="48" alt="${escapeHtml(site.name)}" style="display:block;border:0;border-radius:999px;background:#ffffff;width:48px;height:48px" />
                    </td>
                    <td style="vertical-align:middle">
                      <span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.2;color:#ffffff">${escapeHtml(site.name)}</span>
                      <span style="display:block;margin-top:4px;font-family:${sans};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3a3">Abuja · Nigeria</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;font-size:30px;font-style:italic;line-height:1.25;color:#111111">${escapeHtml(title)}</td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;font-family:${sans};font-size:15px;line-height:1.65;color:#404040">${bodyHtml}</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 32px;font-family:${sans};font-size:12px;line-height:1.6;color:#737373;border-top:1px solid #f4f4f5">
              <strong style="color:#111111;font-weight:600">${escapeHtml(site.name)}</strong><br/>
              ${escapeHtml(site.address.full)}<br/>
              <a href="mailto:${escapeHtml(site.email)}" style="color:#111111;text-decoration:underline">${escapeHtml(site.email)}</a>
              &nbsp;·&nbsp;
              <a href="tel:${escapeHtml(site.phoneHref)}" style="color:#111111;text-decoration:none">${escapeHtml(site.phone)}</a><br/>
              <a href="${escapeHtml(siteUrl)}" style="color:#737373;text-decoration:underline">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const fulfillmentCopy: Record<
  FulfillmentStatus,
  { title: string; customerLead: string; adminLead: string }
> = {
  confirmed: {
    title: "Order confirmed",
    customerLead:
      "We’ve received payment and will prepare your package.",
    adminLead: "Order marked confirmed.",
  },
  packed: {
    title: "Order packed",
    customerLead:
      "Your order is packed and ready for dispatch.",
    adminLead: "Order marked packed.",
  },
  sent: {
    title: "Out for delivery",
    customerLead:
      "Your package has been sent for delivery. Please keep your phone nearby.",
    adminLead: "Order marked sent for delivery.",
  },
  delivered: {
    title: "Order delivered",
    customerLead:
      "Your order has been marked as delivered. We hope you love it.",
    adminLead: "Order marked delivered.",
  },
};

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
  if (!isMailConfigured()) {
    console.warn("[mail] order emails skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  const siteUrl = emailSiteUrl();
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
    <p><a href="${escapeHtml(`${siteUrl}/admin/orders/${encodeURIComponent(order.reference)}`)}" style="color:#111">Open order</a></p>
  `;

  const [customer, admin] = await Promise.all([
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

  return { customer: customer.ok, admin: admin.ok };
}

/** Packed / sent / delivered (and re-confirm) updates from admin. */
export async function sendOrderFulfillmentEmails(
  order: StoredOrder,
  status: FulfillmentStatus,
) {
  if (!isMailConfigured()) {
    console.warn("[mail] fulfillment emails skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  // Initial purchase already sends sendOrderEmails — skip duplicate "confirmed".
  if (status === "confirmed") {
    return { customer: false, admin: false };
  }

  const copy = fulfillmentCopy[status];
  const siteUrl = emailSiteUrl();
  const total = formatNaira(order.amount / 100);
  const { items, delivery } = orderLines(order);
  const name = order.customer.name || "there";
  const label = fulfillmentLabel(status);

  const customerBody = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>${escapeHtml(copy.customerLead)}</p>
    <p><strong>Status:</strong> ${escapeHtml(label)}<br/>
    <strong>Reference:</strong> ${escapeHtml(order.reference)}<br/>
    <strong>Total:</strong> ${escapeHtml(total)}</p>
    <p style="white-space:pre-line">${escapeHtml(items)}${delivery ? `\n${escapeHtml(delivery)}` : ""}</p>
    <p><a href="${escapeHtml(`${siteUrl}/account/orders/${order.reference}`)}" style="color:#111">Track order</a></p>
  `;

  const adminBody = `
    <p>${escapeHtml(copy.adminLead)}</p>
    <p><strong>${escapeHtml(order.customer.name || "Customer")}</strong><br/>
    ${escapeHtml(order.email)} · ${escapeHtml(order.customer.phone || "—")}</p>
    <p><strong>Status:</strong> ${escapeHtml(label)}<br/>
    <strong>Reference:</strong> ${escapeHtml(order.reference)}</p>
    <p><a href="${escapeHtml(`${siteUrl}/admin/orders/${encodeURIComponent(order.reference)}`)}" style="color:#111">Open order</a></p>
  `;

  const [customer, admin] = await Promise.all([
    sendMail({
      to: order.email,
      subject: `${copy.title} · ${order.reference}`,
      html: layout(copy.title, customerBody),
      text: `Hi ${name},\n\n${copy.customerLead}\nStatus: ${label}\nReference: ${order.reference}\n\n${items}`,
      idempotencyKey: `order-${status}/${order.reference}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `${label} · ${order.reference}`,
      html: layout(copy.title, adminBody),
      text: `${copy.adminLead}\n${order.reference} · ${order.email}`,
      idempotencyKey: `order-${status}-admin/${order.reference}`,
    }),
  ]);

  return { customer: customer.ok, admin: admin.ok };
}

export async function sendBookingEmails(booking: BookingRequest) {
  if (!isMailConfigured()) {
    console.warn("[mail] booking emails skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  const siteUrl = emailSiteUrl();
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

  const [customer, admin] = await Promise.all([
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

  return { customer: customer.ok, admin: admin.ok };
}

export async function sendBookingConfirmedEmails(booking: BookingRequest) {
  if (!isMailConfigured()) {
    console.warn("[mail] booking confirmed skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  const siteUrl = emailSiteUrl();
  const when = `${booking.preferredDate}${booking.preferredTime ? ` · ${booking.preferredTime}` : ""}`;

  const customerBody = `
    <p>Hi ${escapeHtml(booking.name)},</p>
    <p>Your <strong>${escapeHtml(booking.serviceName)}</strong> appointment is confirmed.</p>
    <p><strong>When:</strong> ${escapeHtml(when)}</p>
    <p><a href="${escapeHtml(`${siteUrl}/account/bookings/${booking.id}`)}" style="color:#111">View booking</a></p>
  `;

  const adminBody = `
    <p>Booking marked confirmed.</p>
    <p><strong>${escapeHtml(booking.name)}</strong><br/>
    ${escapeHtml(booking.email)} · ${escapeHtml(booking.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(booking.serviceName)}<br/>
    <strong>When:</strong> ${escapeHtml(when)}</p>
  `;

  const [customer, admin] = await Promise.all([
    sendMail({
      to: booking.email,
      subject: `Booking confirmed · ${booking.serviceName}`,
      html: layout("Booking confirmed", customerBody),
      text: `Hi ${booking.name},\n\nYour ${booking.serviceName} appointment is confirmed for ${when}.`,
      idempotencyKey: `booking-confirmed/${booking.id}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `Confirmed · ${booking.serviceName} · ${booking.name}`,
      html: layout("Booking confirmed", adminBody),
      text: `Confirmed ${booking.id} · ${booking.serviceName} · ${booking.email}`,
      idempotencyKey: `booking-confirmed-admin/${booking.id}`,
    }),
  ]);

  return { customer: customer.ok, admin: admin.ok };
}

export async function sendBookingCompletedEmails(booking: BookingRequest) {
  if (!isMailConfigured()) {
    console.warn("[mail] booking completed skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  const siteUrl = emailSiteUrl();
  const when = `${booking.preferredDate}${booking.preferredTime ? ` · ${booking.preferredTime}` : ""}`;

  const customerBody = `
    <p>Hi ${escapeHtml(booking.name)},</p>
    <p>Thank you for visiting us for <strong>${escapeHtml(booking.serviceName)}</strong>.</p>
    <p><strong>Session:</strong> ${escapeHtml(when)}</p>
    <p>We’d love to see you again — <a href="${escapeHtml(`${siteUrl}/book`)}" style="color:#111">book another chair</a> or shop pigments anytime.</p>
  `;

  const adminBody = `
    <p>Booking marked completed.</p>
    <p><strong>${escapeHtml(booking.name)}</strong><br/>
    ${escapeHtml(booking.email)} · ${escapeHtml(booking.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(booking.serviceName)}<br/>
    <strong>Session:</strong> ${escapeHtml(when)}</p>
  `;

  const [customer, admin] = await Promise.all([
    sendMail({
      to: booking.email,
      subject: `Thanks for visiting · ${booking.serviceName}`,
      html: layout("Session complete", customerBody),
      text: `Hi ${booking.name},\n\nThank you for your ${booking.serviceName} session (${when}).`,
      idempotencyKey: `booking-completed/${booking.id}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `Completed · ${booking.serviceName} · ${booking.name}`,
      html: layout("Session complete", adminBody),
      text: `Completed ${booking.id} · ${booking.serviceName} · ${booking.email}`,
      idempotencyKey: `booking-completed-admin/${booking.id}`,
    }),
  ]);

  return { customer: customer.ok, admin: admin.ok };
}

export async function sendBookingCancelledEmails(booking: BookingRequest) {
  if (!isMailConfigured()) {
    console.warn("[mail] booking cancelled skipped — RESEND_API_KEY not set");
    return { customer: false, admin: false };
  }

  const siteUrl = emailSiteUrl();
  const when = `${booking.preferredDate}${booking.preferredTime ? ` · ${booking.preferredTime}` : ""}`;

  const customerBody = `
    <p>Hi ${escapeHtml(booking.name)},</p>
    <p>Your <strong>${escapeHtml(booking.serviceName)}</strong> booking has been cancelled.</p>
    <p><strong>Was scheduled:</strong> ${escapeHtml(when)}</p>
    <p>If this was unexpected, reply to this email or WhatsApp us on ${escapeHtml(site.phone)}.</p>
    <p><a href="${escapeHtml(`${siteUrl}/book`)}" style="color:#111">Book again</a></p>
  `;

  const adminBody = `
    <p>Booking cancelled.</p>
    <p><strong>${escapeHtml(booking.name)}</strong><br/>
    ${escapeHtml(booking.email)} · ${escapeHtml(booking.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(booking.serviceName)}<br/>
    <strong>Was scheduled:</strong> ${escapeHtml(when)}</p>
  `;

  const [customer, admin] = await Promise.all([
    sendMail({
      to: booking.email,
      subject: `Booking cancelled · ${booking.serviceName}`,
      html: layout("Booking cancelled", customerBody),
      text: `Hi ${booking.name},\n\nYour ${booking.serviceName} booking (${when}) has been cancelled.`,
      idempotencyKey: `booking-cancelled/${booking.id}`,
    }),
    sendMail({
      to: adminRecipients(),
      subject: `Cancelled · ${booking.serviceName} · ${booking.name}`,
      html: layout("Booking cancelled", adminBody),
      text: `Cancelled ${booking.id} · ${booking.serviceName} · ${booking.email}`,
      idempotencyKey: `booking-cancelled-admin/${booking.id}`,
    }),
  ]);

  return { customer: customer.ok, admin: admin.ok };
}
