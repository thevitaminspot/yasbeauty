"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { uploadAdminImage } from "@/actions/admin";
import { adminGhostBtn, adminLabel } from "@/components/admin/form-styles";

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    const body = new FormData();
    body.set("file", file);
    start(async () => {
      const result = await uploadAdminImage(body);
      if ("url" in result && result.url) {
        onChange(result.url);
        return;
      }
      setError(
        "error" in result && result.error
          ? result.error
          : "Upload failed.",
      );
    });
  }

  return (
    <div className="md:col-span-2">
      <p className={adminLabel}>{label}</p>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden border border-neutral-200 bg-neutral-100">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-400">
              None
            </span>
          )}
        </div>
        <div className="space-y-2">
          <label className={`${adminGhostBtn} inline-flex cursor-pointer`}>
            {pending ? "Uploading…" : value ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={pending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                onFile(file);
              }}
            />
          </label>
          {value ? (
            <button
              type="button"
              className="block text-xs text-neutral-500 underline underline-offset-2"
              onClick={() => onChange("")}
            >
              Remove
            </button>
          ) : null}
          <p className="text-xs text-neutral-500">
            JPG or PNG, up to 8MB.
          </p>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
