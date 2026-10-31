"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createBookingRequest, listPreferredSlots } from "@/actions/booking";
import { DateField } from "@/components/ui/date-field";
import { Spinner } from "@/components/ui/spinner";
import {
  bookingDepositNaira,
  isTrainingService,
} from "@/lib/booking-deposit";
import { openPaystackCheckout } from "@/lib/paystack-popup";
import { formatNairaLabel } from "@/lib/site";
import type { StudioService } from "@/lib/services";
import {
  cohortLabel,
  type TrainingSettings,
} from "@/lib/training-types";
import { ui } from "@/lib/ui";

type Slot = { id: string; label: string };

const procedureSteps = [
  "Choose a service",
  "Date & time",
  "Your details",
  "Review",
] as const;

const trainingSteps = [
  "Choose a service",
  "Next cohort",
  "Your details",
  "Review",
] as const;

const field = ui.fieldInput;
const labelCls = ui.fieldLabel;

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ProgressBar({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="h-px w-full bg-neutral-200">
      <div
        className="h-px bg-black transition-[width] duration-300"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      />
    </div>
  );
}

export function BookingFlow({
  services,
  initialServiceSlug,
  trainingSettings,
}: {
  services: StudioService[];
  initialServiceSlug?: string;
  trainingSettings: TrainingSettings;
}) {
  const preselected =
    Boolean(initialServiceSlug) &&
    services.some((s) => s.slug === initialServiceSlug);

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [slug, setSlug] = useState(preselected ? initialServiceSlug! : "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dateError, setDateError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [cohortId, setCohortId] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [paying, setPaying] = useState(false);
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(true);
  const appliedService = useRef<string | undefined>(
    preselected ? initialServiceSlug : undefined,
  );

  const service = useMemo(
    () => services.find((s) => s.slug === slug),
    [services, slug],
  );

  const training = Boolean(service && isTrainingService(service));
  const steps = training ? trainingSteps : procedureSteps;
  const depositNaira = service ? bookingDepositNaira(service) : 0;

  const selectedCohort = useMemo(
    () => trainingSettings.cohorts.find((c) => c.id === cohortId),
    [trainingSettings.cohorts, cohortId],
  );

  const cohortReady =
    training &&
    (trainingSettings.mode === "tba" || Boolean(selectedCohort));

  const scheduleReady = training
    ? cohortReady
    : Boolean(date && slot);

  const whenLabel = training
    ? trainingSettings.mode === "tba"
      ? "Will be announced"
      : selectedCohort
        ? cohortLabel(selectedCohort)
        : ""
    : date && slot
      ? `${date} · ${slot.label}`
      : "";

  useEffect(() => {
    if (!initialServiceSlug) return;
    if (appliedService.current === initialServiceSlug) return;
    if (!services.some((s) => s.slug === initialServiceSlug)) return;
    appliedService.current = initialServiceSlug;
    setSlug(initialServiceSlug);
    setStep(1);
  }, [initialServiceSlug, services]);

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (!training) return;
    if (trainingSettings.mode === "tba") {
      setCohortId("");
      return;
    }
    if (
      trainingSettings.cohorts.length === 1 &&
      !trainingSettings.cohorts.some((c) => c.id === cohortId)
    ) {
      setCohortId(trainingSettings.cohorts[0]!.id);
    }
  }, [training, trainingSettings, cohortId]);

  async function loadSlots(nextDate: string) {
    setDate(nextDate);
    setSlot(null);
    setDateError("");
    setLoadingSlots(true);
    const result = await listPreferredSlots(nextDate);
    setSlots(result.slots);
    if (!result.ok) setDateError(result.error);
    setLoadingSlots(false);
  }

  function back() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  function next() {
    setError("");
    if (step === 0 && !service) {
      setError("Choose a service to continue.");
      return;
    }
    if (step === 1) {
      if (training) {
        if (trainingSettings.mode === "cohorts" && !selectedCohort) {
          setError("Choose a cohort to continue.");
          return;
        }
      } else if (!date || !slot) {
        setError("Select a date and time to continue.");
        return;
      }
    }
    if (step === 2) {
      if (details.name.trim().length < 2) {
        setError("Enter your full name.");
        return;
      }
      if (details.phone.trim().length < 7) {
        setError("Enter a valid phone number.");
        return;
      }
      if (!details.email.trim() || !details.email.includes("@")) {
        setError("Email is required to pay your deposit.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function confirm() {
    if (!service || !scheduleReady) return;
    setPending(true);
    setError("");
    const result = await createBookingRequest({
      serviceSlug: service.slug,
      name: details.name,
      email: details.email,
      phone: details.phone,
      preferredDate: training ? undefined : date,
      preferredTime: training ? undefined : slot?.label,
      cohortId: training ? cohortId || undefined : undefined,
      notes: details.notes,
    });
    if (result.error || !result.booking) {
      setPending(false);
      setError(result.error ?? "Could not save booking.");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/paystack/booking-initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: result.booking.id }),
      });
      const data = (await res.json()) as {
        accessCode?: string;
        authorizationUrl?: string;
        reference?: string;
        error?: string;
      };
      if (!res.ok || (!data.accessCode && !data.authorizationUrl)) {
        setPending(false);
        setPaying(false);
        setError(
          data.error ??
            "Booking saved, but deposit could not start. Contact us with your details.",
        );
        return;
      }

      const goComplete = (ref: string) => {
        router.push(`/book/complete?reference=${encodeURIComponent(ref)}`);
      };

      if (data.accessCode) {
        await openPaystackCheckout(data.accessCode, {
          onSuccess: (tx) => {
            goComplete(tx.reference || data.reference || "");
          },
          onCancel: () => {
            setPending(false);
            setPaying(false);
            setError(
              "Deposit cancelled. Your request is saved — pay from My bookings or contact us to finish.",
            );
          },
          onError: (err) => {
            setPending(false);
            setPaying(false);
            setError(err.message || "Paystack could not open.");
          },
        });
        return;
      }

      window.location.assign(data.authorizationUrl!);
    } catch {
      setPending(false);
      setPaying(false);
      setError("Network error starting deposit. Please try again.");
    }
  }

  return (
    <div ref={topRef} className={`${ui.panel} max-w-full scroll-mt-24`}>
      <form
        className="min-w-0 max-w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) next();
          else void confirm();
        }}
      >
        <header className="mb-5 sm:mb-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="mb-4 min-h-11 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
            >
              ← Back
            </button>
          ) : null}
          <ProgressBar step={step} total={steps.length} />
          <h2 className="mt-5 font-serif text-[clamp(1.6rem,6vw,2.25rem)] font-medium tracking-[-0.02em]">
            {steps[step]}
          </h2>
          {service && step > 0 ? (
            <p className="mt-2 break-words text-sm text-neutral-600">
              <span className="font-medium text-black">{service.name}</span>
              {" · "}
              {service.duration} · from {formatNairaLabel(service.fromPrice)}
              {whenLabel ? ` · ${whenLabel}` : ""}
            </p>
          ) : null}
        </header>

        {step === 0 ? (
          <ul className="space-y-3" role="listbox" aria-label="Services">
            {services.map((item) => {
              const active = item.slug === slug;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setSlug(item.slug);
                      setSlot(null);
                      setDate("");
                      setCohortId("");
                      setError("");
                    }}
                    className={`w-full min-w-0 border p-4 text-left transition ${
                      active
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="min-w-0 font-serif text-xl italic">
                        {item.name}
                      </span>
                      <span className="shrink-0 text-xs tracking-wide">
                        from {formatNairaLabel(item.fromPrice)}
                      </span>
                    </span>
                    <span
                      className={`mt-1 block text-[10px] uppercase tracking-[0.2em] ${
                        active ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      {item.duration} · deposit{" "}
                      {formatNairaLabel(bookingDepositNaira(item))}
                    </span>
                    <span
                      className={`mt-2 block text-sm leading-snug ${
                        active ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {item.summary}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {step === 1 && service && training ? (
          <div className="min-w-0 space-y-5">
            {trainingSettings.mode === "tba" ? (
              <div className="border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                <p className="font-serif text-xl italic text-black">
                  Next cohort — dates will be announced
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  Pay your training deposit to hold a place. We’ll email you
                  when the next intake month is confirmed.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Choose the cohort month that works for you. Exact training
                  days are confirmed by the studio after your deposit.
                </p>
                <ul className="space-y-2" role="listbox" aria-label="Cohorts">
                  {trainingSettings.cohorts.map((cohort) => {
                    const active = cohort.id === cohortId;
                    return (
                      <li key={cohort.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setCohortId(cohort.id);
                            setError("");
                          }}
                          className={`w-full border px-4 py-4 text-left transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-neutral-200 hover:border-black"
                          }`}
                        >
                          <span className="font-serif text-xl italic">
                            {cohortLabel(cohort)}
                          </span>
                          <span
                            className={`mt-1 block text-[10px] uppercase tracking-[0.2em] ${
                              active ? "text-neutral-400" : "text-neutral-500"
                            }`}
                          >
                            Next cohort
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        ) : null}

        {step === 1 && service && !training ? (
          <div className="min-w-0 space-y-6">
            <label className={`${labelCls} min-w-0`}>
              Date
              <DateField
                value={date}
                min={todayIso()}
                onChange={(e) => void loadSlots(e.target.value)}
                className="mt-2"
                inputClassName={field}
                required
              />
            </label>
            <div>
              <p className={labelCls}>Time</p>
              {!date ? (
                <p className="mt-3 text-sm text-neutral-500">
                  Select a date to see preferred times.
                </p>
              ) : loadingSlots ? (
                <p className="mt-3 text-sm text-neutral-500">Loading times…</p>
              ) : dateError ? (
                <p className="mt-3 text-sm text-red-700">{dateError}</p>
              ) : slots.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">
                  No times available for that date.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSlot(item)}
                      className={`min-h-12 border px-3 py-3 text-sm transition ${
                        slot?.id === item.id
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 hover:border-black"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                Times are preferred windows. Final confirmation is by email or
                phone.
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <label className={labelCls}>
              Full name
              <input
                required
                autoComplete="name"
                value={details.name}
                onChange={(e) =>
                  setDetails((c) => ({ ...c, name: e.target.value }))
                }
                className={field}
              />
            </label>
            <label className={labelCls}>
              Phone
              <input
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={details.phone}
                onChange={(e) =>
                  setDetails((c) => ({ ...c, phone: e.target.value }))
                }
                className={field}
              />
            </label>
            <label className={labelCls}>
              Email
              <input
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                value={details.email}
                onChange={(e) =>
                  setDetails((c) => ({ ...c, email: e.target.value }))
                }
                className={field}
              />
            </label>
            <label className={labelCls}>
              Notes
              <textarea
                rows={4}
                value={details.notes}
                onChange={(e) =>
                  setDetails((c) => ({ ...c, notes: e.target.value }))
                }
                placeholder={
                  training
                    ? "Experience level, goals, questions…"
                    : "First visit, patch test, skin concerns…"
                }
                className={`${field} resize-y`}
              />
            </label>
          </div>
        ) : null}

        {step === 3 && service && scheduleReady ? (
          <dl className="space-y-4 border border-neutral-200 bg-neutral-50 p-4 text-sm sm:p-5">
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="shrink-0 text-neutral-500">Service</dt>
              <dd className="min-w-0 text-right font-medium">{service.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="shrink-0 text-neutral-500">
                {training ? "Cohort" : "When"}
              </dt>
              <dd className="min-w-0 text-right">{whenLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="shrink-0 text-neutral-500">From</dt>
              <dd className="text-right">{formatNairaLabel(service.fromPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="shrink-0 text-neutral-500">
                Deposit due
                {training ? " (training)" : ""}
              </dt>
              <dd className="text-right font-medium">
                {formatNairaLabel(depositNaira)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-neutral-500">Contact</dt>
              <dd className="min-w-0 text-right">
                {details.name}
                <br />
                {details.phone}
              </dd>
            </div>
            <p className="pt-2 text-xs leading-relaxed text-neutral-500">
              {training
                ? "Training requires a ₦250,000 deposit to hold your place. Exact dates follow after we confirm your cohort."
                : "Procedures require a ₦15,000 deposit. Balance is due at the studio after we confirm."}{" "}
              You’ll pay securely with Paystack next.
            </p>
          </dl>
        ) : null}

        {error ? (
          <p role="alert" className="mt-5 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || paying}
          className={`${ui.btnPrimary} mt-8 w-full gap-3`}
        >
          {pending || paying ? (
            <>
              <Spinner className="h-4 w-4 text-white" label="Processing" />
              {paying ? "Opening Paystack…" : "Saving…"}
            </>
          ) : step < steps.length - 1 ? (
            "Continue"
          ) : (
            `Pay ${formatNairaLabel(depositNaira)} deposit`
          )}
        </button>
      </form>
    </div>
  );
}
