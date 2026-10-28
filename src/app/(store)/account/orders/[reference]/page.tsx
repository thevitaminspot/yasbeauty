import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { FulfillmentTimeline } from "@/components/account/fulfillment-timeline";
import {
  StatusPill,
  fulfillmentTone,
} from "@/components/account/status-pill";
import {
  accountEmailsFromUser,
  emailMatchesAccount,
  formatAccountDate,
  requireAccountUser,
} from "@/lib/account";
import { fulfillmentLabel } from "@/lib/delivery-types";
import { formatNaira } from "@/lib/format";
import { getOrderByReference } from "@/lib/orders-store";
import { getProducts } from "@/lib/products";
import { ui } from "@/lib/ui";

type PageProps = {
  params: Promise<{ reference: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { reference } = await params;
  return {
    title: `Order ${decodeURIComponent(reference)}`,
    description: "Order details from Yas Beauty Allure.",
  };
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-2.5 text-sm sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
      <dt className="pt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-neutral-800">{value}</dd>
    </div>
  );
}

async function OrderDetailBody({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference: referenceParam } = await params;
  const reference = decodeURIComponent(referenceParam);
  const user = await requireAccountUser(
    `/account/orders/${encodeURIComponent(reference)}`,
  );
  const emails = accountEmailsFromUser(user);

  const [order, catalog] = await Promise.all([
    getOrderByReference(reference),
    getProducts(),
  ]);

  if (!order || !emailMatchesAccount(order.email, emails)) {
    notFound();
  }

  const imageById = new Map(
    catalog.map((p) => [p.id, { image: p.image, slug: p.slug }] as const),
  );
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const deliveryFee = order.delivery?.fee ?? 0;
  const addressLine = [order.customer.address, order.customer.city]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Link
        href="/account/orders"
        className="inline-flex min-h-10 items-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 underline-offset-4 transition hover:text-black hover:underline"
      >
        ← All orders
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5 sm:mt-8 sm:pb-6">
        <div className="min-w-0">
          <p className={ui.eyebrow}>Order</p>
          <h1 className="mt-2 font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-medium tracking-[-0.02em]">
            Order details
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Placed {formatAccountDate(order.createdAt, true)}
          </p>
          <p className="mt-1 font-mono text-xs text-neutral-400">
            {order.reference}
          </p>
        </div>
        <StatusPill
          label={fulfillmentLabel(order.fulfillmentStatus)}
          tone={fulfillmentTone(order.fulfillmentStatus)}
        />
      </header>

      <section className="mt-8 sm:mt-10">
        <h2 className={`${ui.eyebrow} text-black`}>Status</h2>
        <div className="mt-4">
          <FulfillmentTimeline status={order.fulfillmentStatus} />
        </div>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8 sm:mt-12 sm:pt-10">
        <h2 className={`${ui.eyebrow} text-black`}>Items</h2>
        <ul className="mt-5 divide-y divide-neutral-200">
          {order.items.map((item) => {
            const product = imageById.get(item.id);
            const href = product?.slug
              ? `/products/${product.slug}`
              : "/shop";
            return (
              <li
                key={`${order.reference}-${item.id}`}
                className="grid grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-4"
              >
                <Link
                  href={href}
                  className="relative aspect-[4/5] bg-neutral-100"
                >
                  {product?.image ? (
                    <Image
                      src={product.image}
                      alt={item.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>
                <Link href={href} className="min-w-0">
                  <span className="block font-serif text-base italic leading-snug hover:underline sm:text-lg">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    Qty {item.quantity} · {formatNaira(item.unitPrice)} each
                  </span>
                </Link>
                <p className="shrink-0 self-start pt-0.5 text-sm font-medium tabular-nums sm:self-center">
                  {formatNaira(item.unitPrice * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>

        <dl className="mt-2 space-y-2.5 border-t border-neutral-200 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Subtotal</dt>
            <dd className="tabular-nums">{formatNaira(itemsSubtotal)}</dd>
          </div>
          {order.delivery ? (
            <div className="flex justify-between gap-4">
              <dt className="min-w-0 text-neutral-500">
                Delivery
                <span className="mt-0.5 block text-xs text-neutral-400">
                  {order.delivery.areaName}
                </span>
              </dt>
              <dd className="shrink-0 tabular-nums">
                {formatNaira(deliveryFee)}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3 text-base font-medium">
            <dt>Total paid</dt>
            <dd className="tabular-nums">
              {formatNaira(order.amount / 100)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 grid gap-0 border-t border-neutral-200 sm:mt-12 md:grid-cols-2 md:gap-0">
        <div className="border-b border-neutral-200 py-8 md:border-b-0 md:border-r md:pr-8 md:py-8">
          <h2 className={`${ui.eyebrow} text-black`}>Delivery</h2>
          <dl className="mt-4 divide-y divide-neutral-100">
            <DetailRow label="Name" value={order.customer.name} />
            <DetailRow label="Address" value={addressLine || null} />
            <DetailRow
              label="Area"
              value={order.delivery?.areaName ?? null}
            />
            <DetailRow label="Phone" value={order.customer.phone} />
          </dl>
        </div>

        <div className="py-8 md:pl-8 md:py-8">
          <h2 className={`${ui.eyebrow} text-black`}>Payment</h2>
          <dl className="mt-4 divide-y divide-neutral-100">
            <DetailRow label="Method" value="Paystack" />
            <DetailRow
              label="Amount"
              value={
                <span className="font-medium tabular-nums">
                  {formatNaira(order.amount / 100)}
                </span>
              }
            />
            <DetailRow
              label="Reference"
              value={
                <span className="font-mono text-xs break-all text-neutral-600">
                  {order.reference}
                </span>
              }
            />
            <DetailRow
              label="Email"
              value={
                <span className="break-all">{order.email}</span>
              }
            />
          </dl>
        </div>
      </section>

      {order.notes?.trim() ? (
        <section className="mt-8 border-t border-neutral-200 pt-8">
          <h2 className={`${ui.eyebrow} text-black`}>Order notes</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            {order.notes.trim()}
          </p>
        </section>
      ) : null}
    </>
  );
}

export default function AccountOrderDetailPage({ params }: PageProps) {
  return (
    <div className={ui.pageShell}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <OrderDetailBody params={params} />
      </Suspense>
    </div>
  );
}
