"use client";

import type { ComponentProps } from "react";

type DateFieldProps = Omit<ComponentProps<"input">, "type"> & {
  /** Extra classes on the native input (borders, margins, etc.). */
  inputClassName?: string;
};

/** Compact date control with a visible calendar affordance (native picker). */
export function DateField({
  className = "",
  inputClassName = "",
  ...props
}: DateFieldProps) {
  return (
    <span className={`date-field-wrap ${className}`.trim()}>
      <input
        type="date"
        className={`date-field ${inputClassName}`.trim()}
        {...props}
      />
      <span className="date-field-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3v3m8-3v3M4.5 9h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6 5Z"
          />
          <path
            strokeWidth="1.5"
            strokeLinecap="round"
            d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"
          />
        </svg>
      </span>
    </span>
  );
}
