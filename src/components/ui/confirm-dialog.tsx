"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { adminGhostBtn, adminPrimaryBtn } from "@/components/admin/form-styles";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  detail,
  confirmLabel = "Confirm",
  cancelLabel = "Keep",
  pending = false,
  pendingLabel,
  tone = "danger",
  error,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  detail?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  pendingLabel?: string;
  tone?: "danger" | "default";
  error?: string;
}) {
  function close() {
    if (pending) return;
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title={title}>
      <div className="space-y-4">
        {detail ? (
          <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {detail}
          </div>
        ) : null}

        <div className="text-sm leading-6 text-neutral-600">{description}</div>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={close}
            className={adminGhostBtn}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={
              tone === "danger"
                ? "border border-red-800 bg-red-800 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-red-900 disabled:opacity-50"
                : adminPrimaryBtn
            }
          >
            {pending ? (pendingLabel ?? "Working…") : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
