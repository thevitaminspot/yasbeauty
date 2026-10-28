import Link from "next/link";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminQuickAction,
  AdminQuickActions,
  AdminSection,
  AdminStatCard,
} from "@/components/admin/ui";
import { readBookings } from "@/lib/bookings-store";
import { formatNaira } from "@/lib/format";
import { readMessages } from "@/lib/messages-store";
import { readOrders } from "@/lib/orders-store";
import { readProducts } from "@/lib/products-store";

export const metadata = { title: "Today" };
export const instant = false;

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminTodayPage() {
  const [orders, bookings, messages, products] = await Promise.all([
    readOrders(),
    readBookings(),
    readMessages(),
    readProducts(),
  ]);

  const paidOrders = orders.filter((o) =>
    ["success", "paid", "SUCCESS", "PAID"].includes(o.status),
  );
  const revenueKobo = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const unitsRemaining = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const recentOrders = orders.slice(0, 6);
  const upcoming = bookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .slice(0, 6);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Today"
        description={`${orders.length} orders · ${bookings.length} bookings · ${unitsRemaining} units in stock`}
      />

      {pendingBookings.length > 0 ? (
        <AdminPanel className="mb-8 border-amber-200 bg-amber-50/60 px-5 py-4">
          <p className="text-sm text-amber-950/80">
            <strong>{pendingBookings.length}</strong> booking
            {pendingBookings.length === 1 ? "" : "s"} waiting for confirmation.{" "}
            <Link href="/admin/bookings" className="underline underline-offset-2">
              Review
            </Link>
          </p>
        </AdminPanel>
      ) : null}

      <AdminQuickActions>
        <AdminQuickAction href="/admin/orders">Review orders</AdminQuickAction>
        <AdminQuickAction href="/admin/bookings">Manage bookings</AdminQuickAction>
        <AdminQuickAction href="/admin/availability">Block dates</AdminQuickAction>
        <AdminQuickAction href="/admin/products">Update products</AdminQuickAction>
        <AdminQuickAction href="/admin/messages">Read messages</AdminQuickAction>
      </AdminQuickActions>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          href="/admin/orders"
          label="Orders"
          value={String(orders.length)}
        />
        <AdminStatCard
          href="/admin/orders"
          label="Paid revenue"
          value={formatNaira(revenueKobo / 100)}
          hint={`${paidOrders.length} paid via Paystack`}
        />
        <AdminStatCard
          href="/admin/bookings"
          label="Bookings to accept"
          value={String(pendingBookings.length)}
        />
        <AdminStatCard
          href="/admin/products"
          label="Units remaining"
          value={String(unitsRemaining)}
          hint={
            lowStock > 0
              ? `${lowStock} product${lowStock === 1 ? "" : "s"} at 5 or fewer`
              : `${products.length} products in catalogue`
          }
        />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminSection title="Recent orders" href="/admin/orders">
          <AdminPanel>
            <ul className="divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <li key={order.reference} className="px-5 py-4 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-xs">{order.reference}</p>
                    <p className="font-medium">
                      {formatNaira(order.amount / 100)}
                    </p>
                  </div>
                  <p className="mt-1 text-neutral-600">
                    {order.email || order.customer.name} · {order.status} ·{" "}
                    {order.channel}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                    {when(order.createdAt)}
                  </p>
                </li>
              ))}
              {recentOrders.length === 0 ? (
                <AdminEmptyState>No orders yet.</AdminEmptyState>
              ) : null}
            </ul>
          </AdminPanel>
        </AdminSection>

        <AdminSection title="Studio bookings" href="/admin/bookings">
          <AdminPanel>
            <ul className="divide-y divide-neutral-100">
              {upcoming.map((row) => (
                <li key={row.id} className="px-5 py-4">
                  <p className="font-medium text-black">{row.serviceName}</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {row.name} · {row.preferredDate} · {row.preferredTime}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                    {row.status}
                  </p>
                </li>
              ))}
              {upcoming.length === 0 ? (
                <AdminEmptyState>No bookings on the board.</AdminEmptyState>
              ) : null}
            </ul>
          </AdminPanel>
        </AdminSection>
      </div>
    </div>
  );
}
