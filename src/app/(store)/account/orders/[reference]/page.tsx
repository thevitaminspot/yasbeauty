import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FulfillmentTimeline } from "@/components/account/fulfillment-timeline";
import {
  StatusPill,
  fulfillmentTone,
} from "@/components/account/status-pill";
import { PageHeader } from "@/components/page-header";
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

  return (
    <>
      <Link href="/account/orders" className={`${ui.btnGhost}`}>
        ← All orders
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <PageHeader
            eyebrow="Order"
            title="Order details"
            lede={`Placed ${formatAccountDate(order.createdAt, true)}`}
          />
          <p className="mt-3 font-mono text-xs text-neutral-500">
            {order.reference}
          </p>
        </div>
        <StatusPill
          label={fulfillmentLabel(order.fulfillmentStatus)}
          tone={fulfillmentTone(order.fulfillmentStatus)}
        />
      </div>

      <section className="mt-10">
        <h2 className={`${ui.eyebrow} text-black`}>Status</h2>
        <div className="mt-4">
          <FulfillmentTimeline status={order.fulfillmentStatus} />
        </div>
      </section>

      <section className="mt-12 overflow-hidden border border-neutral-200 bg-white">
        <header className="border-b border-neutral-200 px-5 py-4 md:px-6">
          <h2 className="text-sm font-medium">Items</h2>
        </header>
        <ul className="divide-y divide-neutral-100">
          {order.items.map((item) => {
            const product = imageById.get(item.id);
            const href = product?.slug
              ? `/products/${product.slug}`
              : "/shop";
            return (
              <li
                key={`${order.reference}-${item.id}`}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-6"
              >
                <Link href={href} className="flex min-w-0 items-center gap-4">
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-neutral-100">
                    {product?.image ? (
                      <Image
                        src={product.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium hover:underline">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm text-neutral-500">
                      Qty {item.quantity} · {formatNaira(item.unitPrice)} each
                    </span>
                  </span>
                </Link>
                <p className="tabular-nums font-medium">
                  {formatNaira(item.unitPrice * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>

        <dl className="space-y-2 border-t border-neutral-200 px-5 py-5 text-sm md:px-6">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Subtotal</dt>
            <dd className="tabular-nums">{formatNaira(itemsSubtotal)}</dd>
          </div>
          {order.delivery ? (
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">
                Delivery · {order.delivery.areaName}
              </dt>
              <dd className="tabular-nums">{formatNaira(deliveryFee)}</dd>
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

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className={ui.panel}>
          <h2 className={`${ui.eyebrow} text-black`}>Delivery</h2>
          <div className="mt-4 space-y-1 text-sm leading-relaxed text-neutral-700">
            {order.customer.name ? <p>{order.customer.name}</p> : null}
            {order.customer.address ? <p>{order.customer.address}</p> : null}
            {order.customer.city ? <p>{order.customer.city}</p> : null}
            {order.delivery ? (
              <p className="pt-2 text-neutral-500">{order.delivery.areaName}</p>
            ) : null}
          </div>
          {order.customer.phone ? (
            <p className="mt-3 text-sm text-neutral-500">{order.customer.phone}</p>
          ) : null}
        </div>
        <div className={ui.panel}>
          <h2 className={`${ui.eyebrow} text-black`}>Payment</h2>
          <p className="mt-4 text-sm text-neutral-700">
            Paid with Paystack
          </p>
          <p className="mt-2 font-mono text-xs text-neutral-500">
            {order.reference}
          </p>
          <p className="mt-2 text-sm text-neutral-500">{order.email}</p>
        </div>
      </section>

      {order.notes?.trim() ? (
        <section className={`${ui.panel} mt-6`}>
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
