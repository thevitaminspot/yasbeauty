import Link from "next/link";
import { Suspense } from "react";
import { OrderSummaryCard } from "@/components/account/order-summary-card";
import { PageHeader } from "@/components/page-header";
import {
  accountEmailsFromUser,
  requireAccountUser,
} from "@/lib/account";
import { getProducts } from "@/lib/products";
import { readOrdersForEmail } from "@/lib/orders-store";
import { ui } from "@/lib/ui";

export const metadata = {
  title: "My orders",
  description: "Your Yas Beauty Allure shop orders.",
};

async function OrdersBody() {
  const user = await requireAccountUser("/account/orders");
  const emails = accountEmailsFromUser(user);

  const [catalog, ...orderLists] = await Promise.all([
    getProducts(),
    ...emails.map((email) => readOrdersForEmail(email)),
  ]);

  const imageById = new Map(catalog.map((p) => [p.id, p.image] as const));

  const seen = new Set<string>();
  const orders = orderLists
    .flat()
    .filter((order) => {
      if (seen.has(order.reference)) return false;
      seen.add(order.reference);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My orders"
        lede="Each order is listed separately. Open one for items, delivery, and status."
      />

      {orders.length === 0 ? (
        <div className={`${ui.panel} mt-12`}>
          <p className="text-sm text-neutral-600">No orders yet.</p>
          <Link href="/shop" className={`${ui.btnSecondary} mt-6`}>
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-12 space-y-5">
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.reference}
              order={order}
              previews={order.items.map((item) => ({
                name: item.name,
                image: imageById.get(item.id),
              }))}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function AccountOrdersPage() {
  return (
    <div className={ui.pageShell}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse border border-neutral-200 bg-neutral-50" />
        }
      >
        <OrdersBody />
      </Suspense>
    </div>
  );
}
