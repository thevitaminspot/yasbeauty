"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { setOrderFulfillment } from "@/actions/admin";
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
  const router = useRouter();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | FulfillmentStatus>("all");
  const [error, setError] = useState("");

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

  function advance(order: StoredOrder, next: FulfillmentStatus) {
    setError("");
    start(async () => {
      const result = await setOrderFulfillment(order.reference, next);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

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

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

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
              const idx = fulfillmentStatuses.findIndex(
                (s) => s.value === order.fulfillmentStatus,
              );
              const next =
                idx >= 0 && idx < fulfillmentStatuses.length - 1
                  ? fulfillmentStatuses[idx + 1]
                  : null;

              return (
                <li key={order.reference} className="px-5 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-xs">{order.reference}</p>
                    <p className="text-lg font-medium">
                      {formatNaira(order.amount / 100)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">
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

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                      {fulfillmentLabel(order.fulfillmentStatus)} ·{" "}
                      {when(order.createdAt)}
                    </p>
                    {next ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => advance(order, next.value)}
                        className="border border-black bg-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:opacity-50"
                      >
                        Mark {next.label.toLowerCase()}
                      </button>
                    ) : null}
                    <select
                      className="border border-neutral-300 bg-white px-2 py-2 text-xs outline-none focus:border-black"
                      value={order.fulfillmentStatus}
                      disabled={pending}
                      onChange={(e) =>
                        advance(
                          order,
                          e.target.value as FulfillmentStatus,
                        )
                      }
                    >
                      {fulfillmentStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
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
