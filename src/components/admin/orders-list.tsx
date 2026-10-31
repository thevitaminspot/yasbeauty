"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OrderFulfillmentControls } from "@/components/admin/order-fulfillment-controls";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import {
  fulfillmentLabel,
  fulfillmentStatuses,
  type FulfillmentStatus,
} from "@/lib/delivery-types";
import { formatNaira } from "@/lib/format";
import type { StoredOrder } from "@/lib/orders-store";

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
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

const tabs: { value: "all" | FulfillmentStatus; label: string }[] = [
  { value: "all", label: "All" },
  ...fulfillmentStatuses,
];

export function OrdersList({ orders }: { orders: StoredOrder[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | FulfillmentStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (tab !== "all" && order.fulfillmentStatus !== tab) return false;
      if (!q) return true;
      return `${order.reference} ${order.email} ${order.customer.name} ${order.customer.phone} ${order.fulfillmentStatus} ${order.delivery?.areaName ?? ""} ${order.notes ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [orders, query, tab]);

  const pagination = usePaginatedList(filtered, `${query}:${tab}`);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={`px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition ${
              tab === item.value
                ? "bg-black text-white"
                : "border border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search orders…"
        className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
      />

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>
            {query.trim() || tab !== "all"
              ? "No orders match."
              : "No recorded orders yet."}
          </AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap pagination={pagination.tablePaginationProps("orders")}>
          <ul className="divide-y divide-neutral-100">
            {pagination.visible.map((order) => {
              const href = `/admin/orders/${encodeURIComponent(order.reference)}`;
              return (
                <li key={order.reference} className="px-5 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={href}
                      className="font-mono text-xs text-black underline-offset-2 hover:underline"
                    >
                      {order.reference}
                    </Link>
                    <p className="text-lg font-medium">
                      {formatNaira(order.amount / 100)}
                    </p>
                  </div>
                  <Link href={href} className="mt-2 block group">
                    <p className="text-sm text-neutral-700 group-hover:text-black">
                      {order.customer.name || "Guest"} · {order.email}
                      {order.customer.phone ? ` · ${order.customer.phone}` : ""}
                    </p>
                    {(order.customer.address || order.customer.city) && (
                      <p className="mt-1 text-sm text-neutral-500">
                        {[order.customer.address, order.customer.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {order.delivery ? (
                      <p className="mt-1 text-sm text-neutral-500">
                        Delivery: {order.delivery.areaName} ·{" "}
                        {formatNaira(order.delivery.fee)}
                      </p>
                    ) : null}
                    {order.notes?.trim() ? (
                      <p className="mt-1 text-sm text-neutral-600">
                        Notes: {order.notes.trim()}
                      </p>
                    ) : null}
                    <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                      {order.items.map((item) => (
                        <li key={`${order.reference}-${item.id}`}>
                          {item.quantity}× {item.name} ·{" "}
                          {formatNaira(item.unitPrice)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                      {fulfillmentLabel(order.fulfillmentStatus)} ·{" "}
                      {when(order.createdAt)} · View details →
                    </p>
                  </Link>

                  <div className="mt-4">
                    <OrderFulfillmentControls
                      reference={order.reference}
                      status={order.fulfillmentStatus}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </PaginatedTableWrap>
      )}
    </div>
  );
}
