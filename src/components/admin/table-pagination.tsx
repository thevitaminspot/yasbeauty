"use client";

import { pageRange } from "@/lib/pagination";

const controlClass =
  "inline-flex items-center gap-1 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-black disabled:pointer-events-none disabled:opacity-40";

export type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  edge?: "top" | "bottom";
};

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "results",
  edge = "bottom",
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const { from, to } = pageRange(page, pageSize, totalItems);
  const borderClass =
    edge === "top" ? "border-b border-neutral-100" : "border-t border-neutral-100";

  return (
    <div
      className={`flex flex-col gap-3 ${borderClass} bg-neutral-50/80 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between`}
    >
      <p className="text-xs text-neutral-500">
        Showing {from}–{to} of {totalItems} {itemLabel}
      </p>
      <nav className="flex items-center gap-2" aria-label="Pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={controlClass}
        >
          Previous
        </button>
        <span className="min-w-[5.5rem] text-center text-xs text-neutral-500">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={controlClass}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
