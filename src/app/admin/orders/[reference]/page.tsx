import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderFulfillmentControls } from "@/components/admin/order-fulfillment-controls";
import { AdminPageHeader, AdminPanel } from "@/components/admin/ui";
import { fulfillmentLabel } from "@/lib/delivery-types";
import { formatNaira } from "@/lib/format";
import { getOrderByReference } from "@/lib/orders-store";

export const instant = false;

type PageProps = {
  params: Promise<{ reference: string }>;
};

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { reference } = await params;
  return { title: `Order ${decodeURIComponent(reference)}` };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { reference: raw } = await params;
  const reference = decodeURIComponent(raw);
  const order = await getOrderByReference(reference);
  if (!order) notFound();

  const addressLine = [order.customer.address, order.customer.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex text-[11px] uppercase tracking-[0.14em] text-neutral-500 transition hover:text-black"
      >
        ← All orders
      </Link>

      <div className="mt-4">
        <AdminPageHeader
          eyebrow="Shop"
          title="Order"
          description={`${order.reference} · ${fulfillmentLabel(order.fulfillmentStatus)} · ${when(order.createdAt)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-neutral-100 pb-4">
            <p className="font-mono text-xs text-neutral-500">{order.reference}</p>
            <p className="font-serif text-3xl italic text-black">
              {formatNaira(order.amount / 100)}
            </p>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Customer
              </dt>
              <dd className="mt-1 text-neutral-800">
                {order.customer.name || "Guest"}
                <br />
                {order.email}
                {order.customer.phone ? (
                  <>
                    <br />
                    {order.customer.phone}
                  </>
                ) : null}
              </dd>
            </div>
            {addressLine ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  Ship to
                </dt>
                <dd className="mt-1 text-neutral-800">{addressLine}</dd>
              </div>
            ) : null}
            {order.delivery ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  Delivery
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {order.delivery.areaName} · {formatNaira(order.delivery.fee)}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Payment
              </dt>
              <dd className="mt-1 text-neutral-800">
                {order.status} · {order.channel}
              </dd>
            </div>
            {order.notes?.trim() ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  Notes
                </dt>
                <dd className="mt-1 text-neutral-800">{order.notes.trim()}</dd>
              </div>
            ) : null}
          </dl>

          <h2 className="mt-8 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-neutral-100 border-t border-neutral-100">
            {order.items.map((item) => (
              <li
                key={`${order.reference}-${item.id}`}
                className="flex items-baseline justify-between gap-4 py-3 text-sm"
              >
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span className="tabular-nums text-neutral-700">
                  {formatNaira(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </AdminPanel>

        <AdminPanel className="h-fit p-5 sm:p-6">
          <h2 className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Fulfillment
          </h2>
          <div className="mt-4">
            <OrderFulfillmentControls
              reference={order.reference}
              status={order.fulfillmentStatus}
            />
          </div>
          <p className="mt-6 text-xs leading-5 text-neutral-500">
            Status changes email the customer and admin with the brand layout.
          </p>
        </AdminPanel>
      </div>
    </div>
  );
}
