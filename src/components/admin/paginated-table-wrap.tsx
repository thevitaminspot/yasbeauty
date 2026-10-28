"use client";

import type { ReactNode } from "react";
import {
  TablePagination,
  type TablePaginationProps,
} from "@/components/admin/table-pagination";
import { AdminPanel } from "@/components/admin/ui";

export function PaginatedTableWrap({
  children,
  pagination,
  scroll = true,
}: {
  children: ReactNode;
  pagination: TablePaginationProps;
  scroll?: boolean;
}) {
  return (
    <AdminPanel className="overflow-hidden">
      <TablePagination {...pagination} edge="top" />
      {scroll ? <div className="overflow-x-auto">{children}</div> : children}
      <TablePagination {...pagination} edge="bottom" />
    </AdminPanel>
  );
}
