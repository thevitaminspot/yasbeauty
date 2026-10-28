"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deleteService, saveService } from "@/actions/admin";
import {
  adminField,
  adminGhostBtn,
  adminLabel,
  adminPrimaryBtn,
} from "@/components/admin/form-styles";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PaginatedTableWrap } from "@/components/admin/paginated-table-wrap";
import { AdminEmptyState, AdminPanel } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { formatNaira } from "@/lib/format";
import type { StudioService } from "@/lib/services";

type Draft = {
  id?: string;
  name: string;
  slug: string;
  duration: string;
  fromPrice: string;
  summary: string;
  description: string;
  image: string;
  featured: boolean;
};

function emptyDraft(): Draft {
  return {
    name: "",
    slug: "",
    duration: "2–3 hrs",
    fromPrice: "85000",
    summary: "",
    description: "",
    image: "",
    featured: false,
  };
}

function fromService(service: StudioService): Draft {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    duration: service.duration,
    fromPrice: String(service.fromPrice),
    summary: service.summary,
    description: service.description,
    image: service.image,
    featured: Boolean(service.featured),
  };
}

export function ServicesManager({ services }: { services: StudioService[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StudioService | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      `${s.name} ${s.slug} ${s.summary}`.toLowerCase().includes(q),
    );
  }, [services, query]);

  const pagination = usePaginatedList(filtered, query);

  function openCreate() {
    setMessage("");
    setFormError("");
    setDraft(emptyDraft());
  }

  function openEdit(service: StudioService) {
    setMessage("");
    setFormError("");
    setDraft(fromService(service));
  }

  function closeDraft() {
    if (pending) return;
    setFormError("");
    setDraft(null);
  }

  function save() {
    if (!draft) return;
    if (!draft.image.trim()) {
      setFormError("Upload a service image before saving.");
      return;
    }
    setFormError("");
    start(async () => {
      const result = await saveService({
        id: draft.id,
        name: draft.name,
        slug: draft.slug,
        duration: draft.duration,
        fromPrice: Number(draft.fromPrice),
        summary: draft.summary,
        description: draft.description,
        image: draft.image,
        featured: draft.featured,
      });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      setMessage(draft.id ? "Service updated." : "Service added.");
      setDraft(null);
      router.refresh();
    });
  }

  function remove(service: StudioService) {
    setMessage("");
    setDeleteError("");
    start(async () => {
      const result = await deleteService(service.id);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      if (draft?.id === service.id) setDraft(null);
      setDeleteTarget(null);
      setMessage(`${service.name} deleted.`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          className="w-full max-w-sm border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black"
        />
        <button type="button" onClick={openCreate} className={adminPrimaryBtn}>
          Add service
        </button>
      </div>

      {message ? <p className="text-sm text-neutral-700">{message}</p> : null}

      <Modal
        open={Boolean(draft)}
        onClose={closeDraft}
        title={draft?.id ? "Edit service" : "New service"}
        size="lg"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className={adminGhostBtn}
              disabled={pending}
              onClick={closeDraft}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={pending || !draft}
              onClick={save}
              className={adminPrimaryBtn}
            >
              {pending ? "Saving…" : "Save service"}
            </button>
          </div>
        }
      >
        {draft ? (
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploadField
              value={draft.image}
              onChange={(image) => setDraft({ ...draft, image })}
            />
            <label className={adminLabel}>
              Name
              <input
                className={adminField}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Slug
              <input
                className={adminField}
                value={draft.slug}
                placeholder="auto from name"
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </label>
            <label className={adminLabel}>
              Duration
              <input
                className={adminField}
                value={draft.duration}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
              />
            </label>
            <label className={adminLabel}>
              From price (₦)
              <input
                type="number"
                min={0}
                step={500}
                className={adminField}
                value={draft.fromPrice}
                onChange={(e) =>
                  setDraft({ ...draft, fromPrice: e.target.value })
                }
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Summary
              <input
                className={adminField}
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              />
            </label>
            <label className={`${adminLabel} md:col-span-2`}>
              Description
              <textarea
                rows={3}
                className={adminField}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) =>
                  setDraft({ ...draft, featured: e.target.checked })
                }
              />
              Featured on homepage
            </label>
            {formError ? (
              <p className="md:col-span-2 text-sm text-red-600" role="alert">
                {formError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No services match.</AdminEmptyState>
        </AdminPanel>
      ) : (
        <PaginatedTableWrap pagination={pagination.tablePaginationProps("services")}>
          <ul className="divide-y divide-neutral-100">
            {pagination.visible.map((service) => (
              <li
                key={service.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-neutral-100">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{service.name}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {service.duration} · from {formatNaira(service.fromPrice)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    className={adminGhostBtn}
                    onClick={() => openEdit(service)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className={adminGhostBtn}
                    onClick={() => {
                      setDeleteError("");
                      setDeleteTarget(service);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </PaginatedTableWrap>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (pending) return;
          setDeleteError("");
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget);
        }}
        title="Delete this service?"
        detail={
          deleteTarget ? (
            <>
              <p className="font-medium text-black">{deleteTarget.name}</p>
              <p className="mt-1 text-neutral-500">
                {deleteTarget.duration} · from{" "}
                {formatNaira(deleteTarget.fromPrice)}
              </p>
            </>
          ) : null
        }
        description={
          <>
            This permanently removes <strong>{deleteTarget?.name}</strong> from
            the studio menu. This cannot be undone.
          </>
        }
        confirmLabel="Delete service"
        cancelLabel="Keep service"
        pending={pending}
        pendingLabel="Deleting…"
        error={deleteError || undefined}
      />
    </div>
  );
}
