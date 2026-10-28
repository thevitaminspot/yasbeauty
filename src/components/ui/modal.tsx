"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const;

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: keyof typeof sizeClass;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="animate-backdrop-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`animate-modal-in relative z-10 flex max-h-[min(92vh,760px)] w-full flex-col border border-neutral-200 bg-white outline-none ${sizeClass[size]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <h2 id={titleId} className="font-serif text-2xl italic text-black">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-neutral-100 px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
