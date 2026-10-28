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
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-5">
        <div className="min-w-0 space-y-2">
          <StatusPill
            label={fulfillmentLabel(order.fulfillmentStatus)}
            tone={fulfillmentTone(order.fulfillmentStatus)}
          />
          <p className="text-sm text-neutral-500">
            {formatAccountDate(order.createdAt)}
          </p>
          <p className="font-mono text-xs text-neutral-400">{order.reference}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-medium tabular-nums sm:text-lg">
            {formatNaira(order.amount / 100)}
          </p>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          {order.delivery ? (
            <p className="mt-0.5 max-w-[9rem] truncate text-xs text-neutral-400 sm:max-w-none">
              {order.delivery.areaName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center">
          {shown.map((item, index) => (
            <span
              key={`${order.reference}-preview-${index}`}
              className="relative -ml-2 h-12 w-10 overflow-hidden border border-white bg-neutral-100 first:ml-0 sm:h-14 sm:w-12"
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
            <span className="ml-3 shrink-0 text-xs text-neutral-500 sm:text-sm">
              +{extra}
            </span>
          ) : null}
        </div>

        <Link
          href={`/account/orders/${encodeURIComponent(order.reference)}`}
          className={`${ui.btnSecondary} !min-h-10 shrink-0 !px-4 !py-2.5`}
        >
          View
        </Link>
      </div>
    </article>
  );
}
