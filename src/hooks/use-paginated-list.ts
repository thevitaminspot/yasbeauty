"use client";

import { useMemo, useState } from "react";
import type { TablePaginationProps } from "@/components/admin/table-pagination";
import { PAGE_SIZE, clampPage, totalPages } from "@/lib/pagination";

export function usePaginatedList<T>(
  items: T[],
  resetKey = "",
  pageSize = PAGE_SIZE,
) {
  const [state, setState] = useState({ resetKey, page: 1 });
  const page = state.resetKey === resetKey ? state.page : 1;
  const pages = totalPages(items.length, pageSize);
  const safePage = clampPage(page, pages);

  const visible = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const setPage = (next: number) => {
    setState({ resetKey, page: clampPage(next, pages) });
  };

  const tablePaginationProps = (itemLabel: string): TablePaginationProps => ({
    page: safePage,
    totalPages: pages,
    totalItems: items.length,
    pageSize,
    onPageChange: setPage,
    itemLabel,
  });

  return {
    visible,
    page: safePage,
    totalPages: pages,
    setPage,
    total: items.length,
    pageSize,
    tablePaginationProps,
  };
}
