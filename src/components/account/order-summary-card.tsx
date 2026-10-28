import Image from "next/image";
import Link from "next/link";
import {
  StatusPill,
  fulfillmentTone,
} from "@/components/account/status-pill";
import { formatAccountDate } from "@/lib/account";
import { fulfillmentLabel } from "@/lib/delivery-types";
import { formatNaira } from "@/lib/format";
import type { StoredOrder } from "@/lib/orders-store";
import { ui } from "@/lib/ui";

type Preview = { image?: string; name: string };

export function OrderSummaryCard({
  order,
  previews,
}: {
  order: StoredOrder;
  previews: Preview[];
}) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const shown = previews.slice(0, 4);
  const extra = Math.max(0, previews.length - shown.length);

  return (
    <article className="border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-4 md:px-6">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={fulfillmentLabel(order.fulfillmentStatus)}
              tone={fulfillmentTone(order.fulfillmentStatus)}
            />
            <p className="text-sm text-neutral-500">
              {formatAccountDate(order.createdAt)}
            </p>
          </div>
          <p className="font-mono text-xs text-neutral-500">{order.reference}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">
            {formatNaira(order.amount / 100)}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
            {order.delivery ? ` · ${order.delivery.areaName}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-6">
        <div className="flex items-center">
          {shown.map((item, index) => (
            <span
              key={`${order.reference}-preview-${index}`}
              className="relative -ml-2 h-14 w-12 overflow-hidden border border-white bg-neutral-100 first:ml-0"
              style={{ zIndex: shown.length - index }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                  —
                </span>
              )}
            </span>
          ))}
          {extra > 0 ? (
            <span className="ml-3 text-sm text-neutral-500">+{extra} more</span>
          ) : null}
        </div>

        <Link
          href={`/account/orders/${encodeURIComponent(order.reference)}`}
          className={ui.btnSecondary}
        >
          View order
        </Link>
      </div>
    </article>
  );
}
