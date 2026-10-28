"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { saveDeliverySettingsAction } from "@/actions/admin";
import {
  adminField,
  adminGhostBtn,
  adminLabel,
  adminPrimaryBtn,
} from "@/components/admin/form-styles";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { Modal } from "@/components/ui/modal";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { formatNaira } from "@/lib/format";
import {
  mergeMajorAbujaAreas,
  newAbujaArea,
  type AbujaArea,
  type DeliverySettings,
} from "@/lib/delivery-types";

export function DeliveryManager({
  initial,
}: {
  initial: DeliverySettings;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [settings, setSettings] = useState<DeliverySettings>(() => {
    const merged = mergeMajorAbujaAreas(initial.abujaAreas);
    return { ...initial, abujaAreas: merged };
  });
  const [message, setMessage] = useState(() => {
    const added =
      mergeMajorAbujaAreas(initial.abujaAreas).length -
      initial.abujaAreas.length;
    return added > 0
      ? `Added ${added} major Abuja location${added === 1 ? "" : "s"}. Save to keep them.`
      : "";
  });
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [newArea, setNewArea] = useState({ name: "", price: "3000" });
  const [editDraft, setEditDraft] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...settings.abujaAreas].sort((a, b) =>
      a.name.localeCompare(b.name, "en"),
    );
    if (!q) return list;
    return list.filter(
      (area) =>
        area.name.toLowerCase().includes(q) ||
        area.id.toLowerCase().includes(q) ||
        String(area.price).includes(q),
    );
  }, [settings.abujaAreas, query]);

  const pagination = usePaginatedList(filtered, query);

  function openEdit(area: AbujaArea) {
    setError("");
    setEditDraft({
      id: area.id,
      name: area.name,
      price: String(area.price),
    });
  }

  function saveEdit() {
    if (!editDraft) return;
    const name = editDraft.name.trim();
    if (!name) {
      setError("Area name is required.");
      return;
    }
    const duplicate = settings.abujaAreas.some(
      (a) =>
        a.id !== editDraft.id &&
        a.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      setError("That area name is already used.");
      return;
    }
    setError("");
    setSettings((prev) => ({
      ...prev,
      abujaAreas: prev.abujaAreas.map((area) =>
        area.id === editDraft.id
          ? {
              ...area,
              name,
              price: Math.max(0, Math.round(Number(editDraft.price) || 0)),
            }
          : area,
      ),
    }));
    setEditDraft(null);
  }

  function removeArea(id: string) {
    setSettings((prev) => ({
      ...prev,
      abujaAreas: prev.abujaAreas.filter((area) => area.id !== id),
    }));
    if (editDraft?.id === id) setEditDraft(null);
  }

  function addArea() {
    const name = newArea.name.trim();
    if (!name) {
      setError("Enter an Abuja area name.");
      return;
    }
    const exists = settings.abujaAreas.some(
      (a) => a.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      setError("That area is already in the list.");
      return;
    }
    setError("");
    setMessage("");
    setSettings((prev) => ({
      ...prev,
      abujaAreas: [
        ...prev.abujaAreas,
        newAbujaArea(name, Number(newArea.price) || 0),
      ],
    }));
    setNewArea({ name: "", price: "3000" });
    setQuery(name);
  }

  function fillMajors() {
    setSettings((prev) => ({
      ...prev,
      abujaAreas: mergeMajorAbujaAreas(prev.abujaAreas),
    }));
    setMessage("Major Abuja locations filled. Save to keep them.");
    setError("");
  }

  function save() {
    setMessage("");
    setError("");
    start(async () => {
      const result = await saveDeliverySettingsAction(settings);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Delivery prices saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Abuja areas…"
          className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
          aria-label="Search Abuja areas"
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={adminGhostBtn} onClick={fillMajors}>
            Fill major areas
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className={adminPrimaryBtn}
          >
            {pending ? "Saving…" : "Save delivery prices"}
          </button>
        </div>
      </div>

      <AdminPanel className="p-5 md:p-6">
        <h2 className="font-serif text-2xl italic">Add Abuja area</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className={`${adminLabel} min-w-[12rem] flex-1`}>
            Area name
            <input
              className={adminField}
              value={newArea.name}
              placeholder="e.g. Jabi"
              onChange={(e) =>
                setNewArea((c) => ({ ...c, name: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArea();
                }
              }}
            />
          </label>
          <label className={`${adminLabel} w-36`}>
            Fee (₦)
            <input
              type="number"
              min={0}
              step={100}
              className={adminField}
              value={newArea.price}
              onChange={(e) =>
                setNewArea((c) => ({ ...c, price: e.target.value }))
              }
            />
          </label>
          <button type="button" className={adminGhostBtn} onClick={addArea}>
            Add area
          </button>
        </div>
      </AdminPanel>

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>
            {settings.abujaAreas.length === 0
              ? "No Abuja areas yet."
              : "No areas match your search."}
          </AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap
          pagination={pagination.tablePaginationProps("areas")}
        >
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                <th className="px-5 py-3.5 font-medium">Area</th>
                <th className="px-4 py-3.5 font-medium">Fee (₦)</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.visible.map((area) => (
                <tr
                  key={area.id}
                  className="border-b border-neutral-100 align-middle last:border-b-0"
                >
                  <td className="px-5 py-3.5 font-medium">{area.name}</td>
                  <td className="px-4 py-3.5 tabular-nums text-neutral-700">
                    {formatNaira(area.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        className={adminGhostBtn}
                        onClick={() => openEdit(area)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={adminGhostBtn}
                        onClick={() => removeArea(area.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PaginatedTableWrap>
      )}

      <Modal
        open={Boolean(editDraft)}
        onClose={() => setEditDraft(null)}
        title="Edit area"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className={adminGhostBtn}
              onClick={() => setEditDraft(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={adminPrimaryBtn}
              onClick={saveEdit}
            >
              Update area
            </button>
          </div>
        }
      >
        {editDraft ? (
          <div className="space-y-4">
            <label className={adminLabel}>
              Area name
              <input
                className={adminField}
                value={editDraft.name}
                onChange={(e) =>
                  setEditDraft((d) =>
                    d ? { ...d, name: e.target.value } : d,
                  )
                }
              />
            </label>
            <label className={adminLabel}>
              Fee (₦)
              <input
                type="number"
                min={0}
                step={100}
                className={adminField}
                value={editDraft.price}
                onChange={(e) =>
                  setEditDraft((d) =>
                    d ? { ...d, price: e.target.value } : d,
                  )
                }
              />
            </label>
          </div>
        ) : null}
      </Modal>

      <AdminPanel className="p-5 md:p-6">
        <h2 className="font-serif text-2xl italic">Other destinations</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className={adminLabel}>
            Outside Abuja (Nigeria)
            <input
              type="number"
              min={0}
              step={100}
              className={adminField}
              value={settings.outOfAbujaPrice}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  outOfAbujaPrice: Number(e.target.value) || 0,
                }))
              }
            />
            <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-neutral-500">
              Currently {formatNaira(settings.outOfAbujaPrice)}
            </span>
          </label>
          <label className={adminLabel}>
            International
            <input
              type="number"
              min={0}
              step={100}
              className={adminField}
              value={settings.internationalPrice}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  internationalPrice: Number(e.target.value) || 0,
                }))
              }
            />
            <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-neutral-500">
              Currently {formatNaira(settings.internationalPrice)}
            </span>
          </label>
        </div>
      </AdminPanel>

      <button
        type="button"
        disabled={pending}
        onClick={save}
        className={adminPrimaryBtn}
      >
        {pending ? "Saving…" : "Save delivery prices"}
      </button>
    </div>
  );
}
