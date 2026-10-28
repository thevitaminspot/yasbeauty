"use client";

import { useMemo, useState } from "react";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { ContactMessage } from "@/lib/messages-store";

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function MessagesList({ rows }: { rows: ContactMessage[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      `${row.name} ${row.email} ${row.phone} ${row.message}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  const pagination = usePaginatedList(filtered, query);

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages…"
        className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
      />

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>
            {query.trim() ? "No messages match." : "No messages yet."}
          </AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap
          pagination={pagination.tablePaginationProps("messages")}
          scroll={false}
        >
          <ul className="divide-y divide-neutral-100">
            {pagination.visible.map((row) => (
              <li key={row.id} className="px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                  {when(row.createdAt)}
                </p>
                <p className="mt-2 font-medium text-black">{row.name}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  {row.email}
                  {row.phone ? ` · ${row.phone}` : ""}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  {row.message}
                </p>
              </li>
            ))}
          </ul>
        </PaginatedTableWrap>
      )}
    </div>
  );
}
