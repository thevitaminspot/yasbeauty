"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createBookingRequest, listPreferredSlots } from "@/actions/booking";
import { Spinner } from "@/components/ui/spinner";
import {
  bookingDepositNaira,
  isTrainingService,
} from "@/lib/booking-deposit";
import { openPaystackCheckout } from "@/lib/paystack-popup";
import { formatNairaLabel } from "@/lib/site";
import type { StudioService } from "@/lib/services";
import { ui } from "@/lib/ui";

type Slot = { id: string; label: string };

const steps = ["Choose a service", "Date & time", "Your details", "Review"] as const;

const field = ui.fieldInput;
const labelCls = ui.fieldLabel;

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step + 1) / steps.length) * 100;
  return (
    <div className="h-px w-full bg-neutral-200">
      <div
        className="h-px bg-black transition-[width] duration-300"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
      />
    </div>
  );
}

export function BookingFlow({
  services,
  initialServiceSlug,
}: {
  services: StudioService[];
  initialServiceSlug?: string;
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

  const depositNaira = service ? bookingDepositNaira(service) : 0;

  // Soft nav / Suspense can mount before ?service= is ready — apply once
  // so we open on Date & time. Do not re-force after the user taps Back.
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
    if (step === 1 && (!date || !slot)) {
      setError("Select a date and time to continue.");
      return;
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
    if (!service || !slot || !date) return;
    setPending(true);
    setError("");
    const result = await createBookingRequest({
      serviceSlug: service.slug,
      name: details.name,
      email: details.email,
      phone: details.phone,
      preferredDate: date,
      preferredTime: slot.label,
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
    <div ref={topRef} className={`${ui.panel} scroll-mt-24`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) next();
          else void confirm();
        }}
      >
        <header className="mb-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
            >
              ← Back
            </button>
          ) : null}
          <ProgressBar step={step} />
          <h2 className="mt-5 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-[-0.02em]">
            {steps[step]}
          </h2>
          {service && step > 0 ? (
            <p className="mt-2 text-sm text-neutral-600">
              <span className="font-medium text-black">{service.name}</span>
              {" · "}
              {service.duration} · from {formatNairaLabel(service.fromPrice)}
              {slot ? ` · ${slot.label}` : ""}
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
                      setError("");
                    }}
                    className={`w-full border p-4 text-left transition ${
                      active
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-serif text-xl italic">{item.name}</span>
                      <span className="text-xs tracking-wide">
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

        {step === 1 && service ? (
          <div className="space-y-6">
            <label className={labelCls}>
              Date
              <input
                type="date"
                value={date}
                min={todayIso()}
                onChange={(e) => void loadSlots(e.target.value)}
                className={field}
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
                      className={`border px-3 py-3 text-sm transition ${
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
                placeholder="First visit, patch test, skin concerns…"
                className={`${field} resize-y`}
              />
            </label>
          </div>
        ) : null}

        {step === 3 && service && slot ? (
          <dl className="space-y-4 border border-neutral-200 bg-neutral-50 p-5 text-sm">
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="text-neutral-500">Service</dt>
              <dd className="text-right font-medium">{service.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="text-neutral-500">When</dt>
              <dd className="text-right">
                {date} · {slot.label}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="text-neutral-500">From</dt>
              <dd className="text-right">{formatNairaLabel(service.fromPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200 pb-3">
              <dt className="text-neutral-500">
                Deposit due
                {isTrainingService(service) ? " (training)" : ""}
              </dt>
              <dd className="text-right font-medium">
                {formatNairaLabel(depositNaira)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Contact</dt>
              <dd className="text-right">
                {details.name}
                <br />
                {details.phone}
              </dd>
            </div>
            <p className="pt-2 text-xs leading-relaxed text-neutral-500">
              {isTrainingService(service)
                ? "Training requires a ₦250,000 deposit to hold your place."
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
