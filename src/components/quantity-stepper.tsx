"use client";

import type { ReactNode } from "react";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
  /** Tighter control for cart / checkout rows */
  compact?: boolean;
  /** Sibling control sharing the same border (e.g. Remove) */
  endSlot?: ReactNode;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  className = "",
  disabled = false,
  compact = false,
  endSlot,
}: QuantityStepperProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;
  const btn = compact ? "w-9" : "w-11";
  const height = compact ? "h-10" : "h-11";

  return (
    <div className={`flex w-fit flex-col gap-1.5 ${className}`}>
      {label ? (
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </span>
      ) : null}
      <div
        className={`flex ${height} w-fit shrink-0 items-stretch border border-neutral-300 bg-white`}
        role="group"
        aria-label={label || "Quantity"}
        aria-disabled={disabled || undefined}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={!canDecrease}
          onClick={() => canDecrease && onChange(value - 1)}
          className={`flex ${btn} shrink-0 items-center justify-center text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent`}
        >
          <MinusIcon />
        </button>
        <span
          className="flex min-w-[2.5rem] shrink-0 items-center justify-center border-x border-neutral-300 px-2 text-sm font-medium tabular-nums leading-none"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={!canIncrease}
          onClick={() => canIncrease && onChange(value + 1)}
          className={`flex ${btn} shrink-0 items-center justify-center text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent`}
        >
          <PlusIcon />
        </button>
        {endSlot ? (
          <div className="flex items-stretch border-l border-neutral-300">
            {endSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3.5 8h9" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
    </svg>
  );
}
