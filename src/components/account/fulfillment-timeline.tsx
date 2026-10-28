import {
  fulfillmentStepIndex,
  fulfillmentSteps,
} from "@/lib/account";
import type { FulfillmentStatus } from "@/lib/delivery-types";

export function FulfillmentTimeline({
  status,
}: {
  status: FulfillmentStatus;
}) {
  const active = fulfillmentStepIndex(status);

  return (
    <ol className="grid gap-0 sm:grid-cols-4">
      {fulfillmentSteps.map((step, index) => {
        const done = index <= active;
        const current = index === active;
        return (
          <li
            key={step.value}
            className={`relative border border-neutral-200 px-4 py-4 ${
              done ? "bg-neutral-50" : "bg-white"
            } ${index > 0 ? "sm:-ml-px" : ""}`}
          >
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.16em] ${
                done ? "text-black" : "text-neutral-400"
              }`}
            >
              {current ? "Current · " : done ? "" : ""}
              {step.label}
            </p>
            <p
              className={`mt-1 text-xs ${
                done ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              {step.hint}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
