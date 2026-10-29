"use client";

import { useMemo, useState } from "react";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { adminGhostBtn, adminPrimaryBtn } from "@/components/admin/form-styles";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { CustomerRow } from "@/lib/customers";

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CustomersList({ rows }: { rows: CustomerRow[] }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<"all" | "one" | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      `${row.name} ${row.email} ${row.phone} ${row.sources.join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  const pagination = usePaginatedList(filtered, query);

  const allEmails = useMemo(
    () => filtered.map((row) => row.email).join("\n"),
    [filtered],
  );

  async function copyAll() {
    if (!allEmails) return;
    await navigator.clipboard.writeText(allEmails);
    setCopied("all");
    window.setTimeout(() => setCopied(null), 2000);
  }

  async function copyOne(email: string) {
    await navigator.clipboard.writeText(email);
    setCopied("one");
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-neutral-500">
            {filtered.length} customer{filtered.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            className={adminPrimaryBtn}
            onClick={() => void copyAll()}
            disabled={filtered.length === 0}
          >
            {copied === "all" ? "Copied" : "Copy all emails"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>
            {query.trim() ? "No customers match." : "No customers yet."}
          </AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap
          pagination={pagination.tablePaginationProps("customers")}
        >
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Activity</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pagination.visible.map((row) => (
                <tr key={row.email} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-black">
                      {row.name || "—"}
                    </p>
                    {row.phone ? (
                      <p className="mt-1 text-xs text-neutral-500">
                        {row.phone}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${row.email}`}
                      className="break-all text-neutral-700 underline-offset-2 hover:underline"
                    >
                      {row.email}
                    </a>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                      {row.sources.join(" · ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {row.orderCount} order{row.orderCount === 1 ? "" : "s"}
                    <br />
                    {row.bookingCount} booking
                    {row.bookingCount === 1 ? "" : "s"}
                    {row.messageCount > 0 ? (
                      <>
                        <br />
                        {row.messageCount} message
                        {row.messageCount === 1 ? "" : "s"}
                      </>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {when(row.lastSeenAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className={adminGhostBtn}
                      onClick={() => void copyOne(row.email)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PaginatedTableWrap>
      )}
    </div>
  );
}
