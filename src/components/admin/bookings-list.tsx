"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { setBookingStatus } from "@/actions/admin";
import { adminPrimaryBtn } from "@/components/admin/form-styles";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import {
  bookingQueue,
  isOverdueBooking,
  type BookingQueue,
} from "@/lib/admin-bookings";
import type { BookingRequest } from "@/lib/bookings-store";

function formatWhen(iso: string) {
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

function statusLabel(status: BookingRequest["status"]) {
  switch (status) {
    case "pending":
      return "Request";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Done";
    case "cancelled":
      return "Cancelled";
  }
}

function BookingActions({ row }: { row: BookingRequest }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const overdue = isOverdueBooking(
    row.status,
    row.preferredDate,
    row.preferredTime,
  );

  function setStatus(status: BookingRequest["status"], closeCancel = false) {
    setError("");
    start(async () => {
      const result = await setBookingStatus(row.id, status);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (closeCancel) setCancelOpen(false);
      router.refresh();
    });
  }

  if (row.status === "cancelled" || row.status === "completed") {
    return (
      <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
        {statusLabel(row.status)}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {row.status === "pending" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("confirmed")}
          className={adminPrimaryBtn}
        >
          {pending ? "Saving…" : "Confirm booking"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("completed")}
          className={adminPrimaryBtn}
        >
          {pending
            ? "Saving…"
            : overdue
              ? "Mark done (overdue)"
              : "Mark session done"}
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError("");
          setCancelOpen(true);
        }}
        className="text-xs text-neutral-400 underline-offset-2 hover:text-red-700 hover:underline disabled:opacity-50"
      >
        Cancel
      </button>
      {error && !cancelOpen ? (
        <span className="text-xs text-red-700">{error}</span>
      ) : null}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => {
          if (pending) return;
          setError("");
          setCancelOpen(false);
        }}
        onConfirm={() => setStatus("cancelled", true)}
        title="Cancel this booking?"
        detail={
          <>
            <p className="font-medium text-black">{row.name}</p>
            <p className="mt-1">{row.serviceName}</p>
            <p className="mt-1 text-neutral-500">
              Prefers {row.preferredDate} · {row.preferredTime}
            </p>
          </>
        }
        description="They’ll need to book again for a new time. This cannot be undone from admin."
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        pending={pending}
        pendingLabel="Cancelling…"
        error={cancelOpen ? error : undefined}
      />
    </div>
  );
}

const tabs: { id: BookingQueue; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

export function BookingsList({ rows }: { rows: BookingRequest[] }) {
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState<BookingQueue>(() => {
    if (rows.some((row) => row.status === "pending")) return "requests";
    if (rows.some((row) => bookingQueue(row.status) === "upcoming")) {
      return "upcoming";
    }
    return "all";
  });

  const counts = useMemo(() => {
    const next = {
      requests: 0,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      all: rows.length,
    };
    for (const row of rows) next[bookingQueue(row.status)] += 1;
    return next;
  }, [rows]);

  const visible = useMemo(() => {
    const inQueue =
      queue === "all"
        ? rows
        : rows.filter((row) => bookingQueue(row.status) === queue);
    const q = query.trim().toLowerCase();
    if (!q) return inQueue;
    return inQueue.filter((row) =>
      `${row.serviceName} ${row.name} ${row.phone} ${row.email} ${row.status} ${row.preferredDate}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, queue, query]);

  const pagination = usePaginatedList(visible, `${queue}:${query}`);

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search guest, email, or service…"
        className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
      />

      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
        {tabs.map((tab) => {
          const active = queue === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setQueue(tab.id)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition ${
                active
                  ? "border border-black bg-black text-white"
                  : "border border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">{counts[tab.id]}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>
            {rows.length === 0
              ? "Bookings will show up here."
              : "No bookings in this view."}
          </AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap
          pagination={pagination.tablePaginationProps("bookings")}
          scroll={false}
        >
          <ul className="divide-y divide-neutral-100">
            {pagination.visible.map((row) => {
              const overdue = isOverdueBooking(
                row.status,
                row.preferredDate,
                row.preferredTime,
              );
              return (
                <li key={row.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-black">{row.serviceName}</p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {row.name} · {row.phone}
                        {row.email ? ` · ${row.email}` : ""}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Prefers {row.preferredDate} · {row.preferredTime}
                        {overdue ? (
                          <span className="ml-2 text-amber-800">Overdue</span>
                        ) : null}
                      </p>
                      {row.depositAmount > 0 ? (
                        <p className="mt-2 text-sm text-neutral-600">
                          Deposit ₦
                          {(row.depositAmount / 100).toLocaleString("en-NG")} ·{" "}
                          {row.depositPaid ? "Paid" : "Unpaid"}
                        </p>
                      ) : null}
                      {row.notes ? (
                        <p className="mt-2 text-sm text-neutral-600">
                          {row.notes}
                        </p>
                      ) : null}
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                        {statusLabel(row.status)} · requested{" "}
                        {formatWhen(row.createdAt)}
                      </p>
                    </div>
                    <BookingActions row={row} />
                  </div>
                </li>
              );
            })}
          </ul>
        </PaginatedTableWrap>
      )}
    </div>
  );
}
