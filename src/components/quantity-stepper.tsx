"use client";
import { ui } from "@/lib/ui";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  className = "",
  disabled = false,
}: QuantityStepperProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <div className={`flex w-fit flex-col gap-2 ${className}`}>
      {label ? <span className={`${ui.eyebrow}`}>{label}</span> : null}
      <div
        className="flex h-11 w-fit shrink-0 items-stretch border border-neutral-300 bg-white"
        role="group"
        aria-label={label || "Quantity"}
        aria-disabled={disabled || undefined}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={!canDecrease}
          onClick={() => canDecrease && onChange(value - 1)}
          className="flex w-11 shrink-0 items-center justify-center text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <MinusIcon />
        </button>
        <span
          className="flex min-w-[3rem] shrink-0 items-center justify-center border-x border-neutral-300 px-3 text-sm font-medium tabular-nums leading-none"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={!canIncrease}
          onClick={() => canIncrease && onChange(value + 1)}
          className="flex w-11 shrink-0 items-center justify-center text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <PlusIcon />
        </button>
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
