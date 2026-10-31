"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setOrderFulfillment } from "@/actions/admin";
import {
  fulfillmentLabel,
  fulfillmentStatuses,
  type FulfillmentStatus,
} from "@/lib/delivery-types";

export function OrderFulfillmentControls({
  reference,
  status,
}: {
  reference: string;
  status: FulfillmentStatus;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const idx = fulfillmentStatuses.findIndex((s) => s.value === status);
  const next =
    idx >= 0 && idx < fulfillmentStatuses.length - 1
      ? fulfillmentStatuses[idx + 1]
      : null;

  function advance(nextStatus: FulfillmentStatus) {
    setError("");
    start(async () => {
      const result = await setOrderFulfillment(reference, nextStatus);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {fulfillmentLabel(status)}
        </p>
        {next ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => advance(next.value)}
            className="border border-black bg-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            Mark {next.label.toLowerCase()}
          </button>
        ) : null}
        <select
          className="border border-neutral-300 bg-white px-2 py-2 text-xs outline-none focus:border-black"
          value={status}
          disabled={pending}
          onChange={(e) => advance(e.target.value as FulfillmentStatus)}
          aria-label="Order fulfillment status"
        >
          {fulfillmentStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
