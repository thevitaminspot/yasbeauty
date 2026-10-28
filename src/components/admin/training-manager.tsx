"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveTrainingSettingsAction } from "@/actions/admin";
import {
  adminField,
  adminGhostBtn,
  adminLabel,
  adminPrimaryBtn,
} from "@/components/admin/form-styles";
import { AdminPanel } from "@/components/admin/ui";
import {
  cohortLabel,
  monthLabel,
  newTrainingCohort,
  type TrainingCohort,
  type TrainingSettings,
} from "@/lib/training-types";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export function TrainingManager({ initial }: { initial: TrainingSettings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [settings, setSettings] = useState<TrainingSettings>(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [draftMonth, setDraftMonth] = useState(12);
  const [draftYear, setDraftYear] = useState(
    () => new Date().getFullYear(),
  );

  function setMode(mode: TrainingSettings["mode"]) {
    setError("");
    setMessage("");
    setSettings((prev) => ({ ...prev, mode }));
  }

  function addCohort() {
    setError("");
    setMessage("");
    const next = newTrainingCohort(draftMonth, draftYear);
    const duplicate = settings.cohorts.some(
      (c) => c.month === next.month && c.year === next.year,
    );
    if (duplicate) {
      setError(`${cohortLabel(next)} is already listed.`);
      return;
    }
    setSettings((prev) => ({
      ...prev,
      cohorts: [...prev.cohorts, next].sort(
        (a, b) => a.year - b.year || a.month - b.month,
      ),
    }));
  }

  function removeCohort(id: string) {
    setError("");
    setMessage("");
    setSettings((prev) => ({
      ...prev,
      cohorts: prev.cohorts.filter((c) => c.id !== id),
    }));
  }

  function updateCohort(
    id: string,
    patch: Partial<Pick<TrainingCohort, "month" | "year">>,
  ) {
    setError("");
    setMessage("");
    setSettings((prev) => ({
      ...prev,
      cohorts: prev.cohorts
        .map((c) => (c.id === id ? { ...c, ...patch } : c))
        .sort((a, b) => a.year - b.year || a.month - b.month),
    }));
  }

  function save() {
    setError("");
    setMessage("");
    start(async () => {
      const result = await saveTrainingSettingsAction(settings);
      if (!result.ok) {
        setError(result.error ?? "Could not save.");
        return;
      }
      setMessage("Training cohorts saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanel>
        <p className={adminLabel}>How guests book training</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("cohorts")}
            className={`border px-4 py-3 text-left text-sm transition ${
              settings.mode === "cohorts"
                ? "border-black bg-black text-white"
                : "border-neutral-200 hover:border-black"
            }`}
          >
            <span className="block font-medium">Published cohorts</span>
            <span
              className={`mt-1 block text-xs ${
                settings.mode === "cohorts"
                  ? "text-neutral-300"
                  : "text-neutral-500"
              }`}
            >
              Guests pick a month and year (no calendar date).
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode("tba")}
            className={`border px-4 py-3 text-left text-sm transition ${
              settings.mode === "tba"
                ? "border-black bg-black text-white"
                : "border-neutral-200 hover:border-black"
            }`}
          >
            <span className="block font-medium">Will be announced</span>
            <span
              className={`mt-1 block text-xs ${
                settings.mode === "tba"
                  ? "text-neutral-300"
                  : "text-neutral-500"
              }`}
            >
              No date shown — deposit holds a place until you announce.
            </span>
          </button>
        </div>
      </AdminPanel>

      {settings.mode === "cohorts" ? (
        <AdminPanel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={adminLabel}>Cohorts</p>
              <p className="mt-1 text-sm text-neutral-600">
                Month and year only — guests never pick a day.
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {settings.cohorts.length === 0 ? (
              <li className="border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
                No cohorts yet. Add December (or any month) below.
              </li>
            ) : (
              settings.cohorts.map((cohort) => (
                <li
                  key={cohort.id}
                  className="flex flex-col gap-3 border border-neutral-200 p-3 sm:flex-row sm:items-center"
                >
                  <label className="min-w-0 flex-1">
                    <span className={adminLabel}>Month</span>
                    <select
                      value={cohort.month}
                      onChange={(e) =>
                        updateCohort(cohort.id, {
                          month: Number(e.target.value),
                        })
                      }
                      className={adminField}
                    >
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {monthLabel(m)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="w-full sm:w-28">
                    <span className={adminLabel}>Year</span>
                    <input
                      type="number"
                      min={2024}
                      max={2100}
                      value={cohort.year}
                      onChange={(e) =>
                        updateCohort(cohort.id, {
                          year: Number(e.target.value) || cohort.year,
                        })
                      }
                      className={adminField}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCohort(cohort.id)}
                    className={`${adminGhostBtn} sm:mt-5`}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="mt-6 border-t border-neutral-200 pt-5">
            <p className={adminLabel}>Add cohort</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Month</span>
                <select
                  value={draftMonth}
                  onChange={(e) => setDraftMonth(Number(e.target.value))}
                  className={adminField}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="w-full sm:w-28">
                <span className="sr-only">Year</span>
                <input
                  type="number"
                  min={2024}
                  max={2100}
                  value={draftYear}
                  onChange={(e) =>
                    setDraftYear(Number(e.target.value) || draftYear)
                  }
                  className={adminField}
                />
              </label>
              <button
                type="button"
                onClick={addCohort}
                className={adminGhostBtn}
              >
                Add
              </button>
            </div>
          </div>
        </AdminPanel>
      ) : (
        <AdminPanel>
          <p className="text-sm leading-relaxed text-neutral-600">
            Booking shows “Next cohort — dates will be announced.” Guests still
            pay the training deposit. Switch back to published cohorts when you
            have month/year dates ready.
          </p>
        </AdminPanel>
      )}

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-neutral-600" role="status">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        disabled={pending}
        onClick={save}
        className={adminPrimaryBtn}
      >
        {pending ? "Saving…" : "Save training settings"}
      </button>
    </div>
  );
}
