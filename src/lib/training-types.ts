export type TrainingCohort = {
  id: string;
  /** 1–12 */
  month: number;
  year: number;
};

export type TrainingSettings = {
  /** `cohorts` = pick a month/year; `tba` = will be announced */
  mode: "cohorts" | "tba";
  cohorts: TrainingCohort[];
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function monthLabel(month: number) {
  return MONTHS[Math.min(11, Math.max(0, month - 1))] ?? `Month ${month}`;
}

export function cohortLabel(cohort: Pick<TrainingCohort, "month" | "year">) {
  return `${monthLabel(cohort.month)} ${cohort.year}`;
}

/** Default: upcoming December cohort. */
export function defaultTrainingSettings(now = new Date()): TrainingSettings {
  const year = now.getFullYear();
  return {
    mode: "cohorts",
    cohorts: [{ id: `cohort-${year}-12`, month: 12, year }],
  };
}

export function newTrainingCohort(month: number, year: number): TrainingCohort {
  const m = Math.min(12, Math.max(1, Math.round(month)));
  const y = Math.max(2024, Math.round(year));
  return {
    id: `cohort-${y}-${String(m).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6)}`,
    month: m,
    year: y,
  };
}

export function normalizeTrainingSettings(
  raw: Partial<TrainingSettings> | null | undefined,
): TrainingSettings {
  const fallback = defaultTrainingSettings();
  const mode = raw?.mode === "tba" ? "tba" : "cohorts";
  const cohorts = Array.isArray(raw?.cohorts)
    ? raw!.cohorts
        .map((c) => ({
          id: String(c.id || `cohort-${c.year}-${c.month}`),
          month: Math.min(12, Math.max(1, Math.round(Number(c.month) || 1))),
          year: Math.max(2024, Math.round(Number(c.year) || new Date().getFullYear())),
        }))
        .sort((a, b) => a.year - b.year || a.month - b.month)
    : fallback.cohorts;

  return {
    mode,
    cohorts: mode === "tba" ? cohorts : cohorts.length ? cohorts : fallback.cohorts,
  };
}
