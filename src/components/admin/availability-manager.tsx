"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  blockDate,
  saveWeeklyAvailability,
  unblockDate,
} from "@/actions/admin";
import {
  adminField,
  adminGhostBtn,
  adminLabel,
  adminPrimaryBtn,
} from "@/components/admin/form-styles";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel, AdminSection } from "@/components/admin/ui";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import {
  weekdayLabel,
  type AvailabilityConfig,
  type BlockedDate,
  type TimeSlot,
} from "@/lib/availability-types";

function formatBlocked(date: string) {
  try {
    const [y, m, d] = date.split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return date;
  }
}

export function AvailabilityManager({
  availability,
  blocked,
}: {
  availability: AvailabilityConfig;
  blocked: BlockedDate[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [openWeekdays, setOpenWeekdays] = useState(availability.openWeekdays);
  const [slots, setSlots] = useState<TimeSlot[]>(availability.slots);
  const [blockForm, setBlockForm] = useState({ date: "", reason: "" });
  const [message, setMessage] = useState("");
  const blockedPagination = usePaginatedList(blocked, String(blocked.length));

  function toggleDay(index: number) {
    setOpenWeekdays((prev) => prev.map((open, i) => (i === index ? !open : open)));
  }

  function saveSchedule() {
    setMessage("");
    start(async () => {
      const result = await saveWeeklyAvailability(openWeekdays, slots);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage("Weekly hours and slots saved.");
      router.refresh();
    });
  }

  function addSlot() {
    setSlots((prev) => [...prev, { id: "", label: "" }]);
  }

  function updateSlot(index: number, patch: Partial<TimeSlot>) {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)),
    );
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  function submitBlock(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    start(async () => {
      const result = await blockDate(blockForm.date, blockForm.reason);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setBlockForm({ date: "", reason: "" });
      setMessage("Date blocked.");
      router.refresh();
    });
  }

  function removeBlocked(id: string) {
    setMessage("");
    start(async () => {
      const result = await unblockDate(id);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage("Date unblocked.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}

      <AdminSection title="Weekly schedule">
        <AdminPanel className="p-5 md:p-6">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {openWeekdays.map((open, index) => (
              <li key={weekdayLabel(index)}>
                <button
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`w-full border px-4 py-3 text-left text-sm transition ${
                    open
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  <span className="block font-medium">{weekdayLabel(index)}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.16em]">
                    {open ? "Open" : "Closed"}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className={adminLabel}>Preferred time slots</p>
            <ul className="mt-3 space-y-2">
              {slots.map((slot, index) => (
                <li key={`slot-${index}`} className="flex flex-wrap gap-2">
                  <input
                    className={`${adminField} mt-0 max-w-[8rem]`}
                    value={slot.id}
                    placeholder="16:30"
                    onChange={(e) => updateSlot(index, { id: e.target.value })}
                  />
                  <input
                    className={`${adminField} mt-0 min-w-[10rem] flex-1`}
                    value={slot.label}
                    placeholder="4:30 PM"
                    onChange={(e) =>
                      updateSlot(index, { label: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className={adminGhostBtn}
                    onClick={() => removeSlot(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={adminGhostBtn} onClick={addSlot}>
                Add slot
              </button>
              <button
                type="button"
                disabled={pending}
                className={adminPrimaryBtn}
                onClick={saveSchedule}
              >
                {pending ? "Saving…" : "Save schedule"}
              </button>
            </div>
          </div>
        </AdminPanel>
      </AdminSection>

      <AdminSection title="Block a date">
        <AdminPanel className="p-5 md:p-6">
          <form
            onSubmit={submitBlock}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <label className={adminLabel}>
              Date
              <input
                type="date"
                required
                className={adminField}
                value={blockForm.date}
                onChange={(e) =>
                  setBlockForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </label>
            <label className={`${adminLabel} min-w-[14rem] flex-1`}>
              Reason
              <input
                className={adminField}
                placeholder="Holiday, training day…"
                value={blockForm.reason}
                onChange={(e) =>
                  setBlockForm((prev) => ({ ...prev, reason: e.target.value }))
                }
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className={adminPrimaryBtn}
            >
              Block date
            </button>
          </form>
        </AdminPanel>
      </AdminSection>

      <AdminSection title="Blocked dates">
        {blocked.length === 0 ? (
          <AdminPanel>
            <AdminEmptyState>No blocked dates.</AdminEmptyState>
          </AdminPanel>
        ) : (
          <PaginatedTableWrap
            pagination={blockedPagination.tablePaginationProps("blocked dates")}
            scroll={false}
          >
            <ul className="divide-y divide-neutral-100">
              {blockedPagination.visible.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-black">
                      {formatBlocked(row.date)}
                    </p>
                    {row.reason ? (
                      <p className="mt-1 text-neutral-500">{row.reason}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    className={adminGhostBtn}
                    onClick={() => removeBlocked(row.id)}
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          </PaginatedTableWrap>
        )}
      </AdminSection>
    </div>
  );
}
