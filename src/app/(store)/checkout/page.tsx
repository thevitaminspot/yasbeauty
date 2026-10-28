"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaymentOverlay } from "@/components/checkout/payment-overlay";
import { PageHeader } from "@/components/page-header";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Spinner } from "@/components/ui/spinner";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import type {
  DeliverySettings,
  DeliveryZone,
} from "@/lib/delivery-types";
import { openPaystackCheckout } from "@/lib/paystack-popup";
import { ui } from "@/lib/ui";

type PayPhase =
  | "idle"
  | "preparing"
  | "awaiting_payment"
  | "confirming";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, setQuantity, removeItem, ready } = useCart();
  const [phase, setPhase] = useState<PayPhase>("idle");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [zone, setZone] = useState<DeliveryZone>("abuja");
  const [areaId, setAreaId] = useState("");
  const submittingRef = useRef(false);

  const busy = phase !== "idle";

  useEffect(() => {
    fetch("/api/delivery")
      .then((r) => r.json())
      .then((data: DeliverySettings) => {
        setSettings(data);
        if (data.abujaAreas[0]) setAreaId(data.abujaAreas[0].id);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!busy) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [busy]);

  const deliveryFee = useMemo(() => {
    if (!settings) return 0;
    if (zone === "abuja") {
      return (
        settings.abujaAreas.find((a) => a.id === areaId)?.price ??
        settings.abujaAreas[0]?.price ??
        0
      );
    }
    if (zone === "nigeria") return settings.outOfAbujaPrice;
    return settings.internationalPrice;
  }, [settings, zone, areaId]);

  const total = subtotal + deliveryFee;
  const stockBlocked = lines.some(
    (l) => (l.product.stock ?? 0) <= 0 || l.quantity > (l.product.stock ?? 0),
  );

  if (!ready) {
    return (
      <div className={`${ui.pageShell}`} aria-busy>
        <div className="h-10 w-40 animate-pulse bg-neutral-100" />
        <div className="mt-12 h-64 animate-pulse bg-neutral-100" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <p className="text-sm text-neutral-600">
          Add items to your bag before checkout.
        </p>
        <Link href="/shop" className={`${ui.btnGhost} mt-6`}>
          Go to shop
        </Link>
      </div>
    );
  }

  function unlockCheckout(message?: string) {
    submittingRef.current = false;
    setPhase("idle");
    if (message) setError(message);
  }

  async function startPaystack(form: HTMLFormElement) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError("");
    setPhase("preparing");

    try {
      const formData = new FormData(form);
      const email = String(formData.get("email") ?? "").trim();
      if (!email) {
        unlockCheckout("Email is required for card payments.");
        return;
      }
      if (zone === "abuja" && !areaId) {
        unlockCheckout("Choose an Abuja delivery area.");
        return;
      }

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          city: String(formData.get("city") ?? ""),
          address: String(formData.get("address") ?? ""),
          notes: String(formData.get("notes") ?? ""),
          deliveryZone: zone,
          deliveryAreaId: zone === "abuja" ? areaId : undefined,
          lines: lines.map((l) => ({
            id: l.product.id,
            quantity: l.quantity,
          })),
        }),
      });

      const data = (await res.json()) as {
        authorizationUrl?: string;
        accessCode?: string;
        reference?: string;
        error?: string;
      };

      if (!res.ok || (!data.accessCode && !data.authorizationUrl)) {
        unlockCheckout(data.error ?? "Could not start Paystack checkout.");
        return;
      }

      const reference = data.reference ?? "";
      const goToComplete = (ref: string) => {
        setPhase("confirming");
        router.push(
          `/checkout/complete?reference=${encodeURIComponent(ref)}`,
        );
      };

      if (data.accessCode) {
        setPhase("awaiting_payment");
        try {
          await openPaystackCheckout(data.accessCode, {
            onSuccess: (transaction) => {
              goToComplete(transaction.reference || reference);
            },
            onCancel: () => {
              unlockCheckout(
                "Payment cancelled. Your bag is still here when you’re ready.",
              );
            },
            onError: (err) => {
              unlockCheckout(
                err.message || "Paystack could not open. Please try again.",
              );
            },
          });
          return;
        } catch {
          if (data.authorizationUrl) {
            setPhase("confirming");
            window.location.assign(data.authorizationUrl);
            return;
          }
          unlockCheckout("Could not open Paystack. Please try again.");
          return;
        }
      }

      setPhase("confirming");
      window.location.assign(data.authorizationUrl!);
    } catch {
      unlockCheckout("Network error. Please try again.");
    }
  }

  const zoneOptions: { value: DeliveryZone; label: string; hint: string }[] = [
    {
      value: "abuja",
      label: "Abuja",
      hint: settings
        ? `From ${formatNaira(
            Math.min(...settings.abujaAreas.map((a) => a.price)),
          )}`
        : "Local areas",
    },
    {
      value: "nigeria",
      label: "Outside Abuja",
      hint: settings
        ? formatNaira(settings.outOfAbujaPrice)
        : "Elsewhere in Nigeria",
    },
    {
      value: "international",
      label: "International",
      hint: settings
        ? formatNaira(settings.internationalPrice)
        : "Worldwide shipping",
    },
  ];

  const overlay =
    phase === "preparing" ? (
      <PaymentOverlay
        title="Preparing payment"
        message="Creating a secure Paystack session. Don’t close this tab."
      />
    ) : phase === "confirming" ? (
      <PaymentOverlay
        title="Confirming payment"
        message="Hang tight while we verify your payment with Paystack."
      />
    ) : null;

  return (
    <div className={`${ui.pageShell}`}>
      {overlay}

      <PageHeader
        title="Checkout"
        lede="Choose delivery, then pay securely with Paystack."
      />

      <form
        id="checkout-form"
        className="mt-12 grid gap-12 lg:grid-cols-2"
        aria-busy={busy}
        onSubmit={(e) => {
          e.preventDefault();
          void startPaystack(e.currentTarget);
        }}
      >
        <fieldset
          disabled={busy}
          className="space-y-5 border-0 p-0 disabled:opacity-60"
        >
          <label className={`${ui.fieldLabel}`} htmlFor="name">
            Full name
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={`${ui.fieldInput}`}
            />
          </label>
          <label className={`${ui.fieldLabel}`} htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${ui.fieldInput}`}
            />
          </label>
          <label className={`${ui.fieldLabel}`} htmlFor="phone">
            Phone
            <input
              id="phone"
              name="phone"
              required
              type="tel"
              autoComplete="tel"
              className={`${ui.fieldInput}`}
            />
          </label>
          <label className={`${ui.fieldLabel}`} htmlFor="city">
            City
            <input
              id="city"
              name="city"
              required
              autoComplete="address-level2"
              defaultValue="Abuja"
              className={`${ui.fieldInput}`}
            />
          </label>
          <label className={`${ui.fieldLabel}`} htmlFor="address">
            Delivery address
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              autoComplete="street-address"
              className={`${ui.fieldInput}`}
            />
          </label>

          <div className="space-y-3 border-t border-neutral-200 pt-6">
            <p className={`${ui.fieldLabel}`}>Delivery</p>
            <div className="space-y-2">
              {zoneOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-between gap-4 border px-4 py-3 text-sm transition ${
                    zone === option.value
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryZone"
                      value={option.value}
                      checked={zone === option.value}
                      onChange={() => setZone(option.value)}
                      className="accent-black"
                    />
                    <span className="font-medium">{option.label}</span>
                  </span>
                  <span className="text-neutral-500">{option.hint}</span>
                </label>
              ))}
            </div>

            {zone === "abuja" && settings ? (
              <label className={`${ui.fieldLabel} !mt-4`} htmlFor="abuja-area">
                Abuja area
                <select
                  id="abuja-area"
                  className={ui.fieldInput}
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  required
                >
                  {settings.abujaAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} — {formatNaira(area.price)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <label className={`${ui.fieldLabel}`} htmlFor="notes">
            Order notes{" "}
            <span className="normal-case tracking-normal text-neutral-400">
              (optional)
            </span>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Trainer bulk, landmark, gate code…"
              className={`${ui.fieldInput}`}
            />
          </label>
        </fieldset>

        <aside className={`${ui.panel} h-fit`}>
          <h2 className={`${ui.eyebrow} text-black`}>Your order</h2>
          <ul className="mt-6 space-y-5 text-sm">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="font-medium">{product.name}</span>
                  <span>{formatNaira(product.price * quantity)}</span>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <QuantityStepper
                    value={quantity}
                    onChange={(next) => setQuantity(product.id, next)}
                    label=""
                    disabled={busy}
                    max={Math.max(1, product.stock ?? 1)}
                  />
                  {(product.stock ?? 0) <= 0 ? (
                    <p className="mb-3 text-xs text-red-600">Out of stock</p>
                  ) : quantity > (product.stock ?? 0) ? (
                    <p className="mb-3 text-xs text-amber-700">
                      Only {product.stock} left
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeItem(product.id)}
                    className={`${ui.btnGhost} mb-3`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-8 space-y-3 border-t border-neutral-200 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd>{formatNaira(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Delivery</dt>
              <dd>{formatNaira(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-neutral-200 pt-4 text-lg font-medium">
              <dt>Total</dt>
              <dd>{formatNaira(total)}</dd>
            </div>
          </dl>

          {stockBlocked ? (
            <p className="mt-6 text-sm text-red-600" role="alert">
              Update quantities for out-of-stock items before paying.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !settings || stockBlocked}
            className={`${ui.btnPrimary} mt-6 w-full gap-3`}
          >
            {busy ? (
              <>
                <Spinner className="h-4 w-4 text-white" label="Processing" />
                {phase === "preparing"
                  ? "Preparing…"
                  : phase === "awaiting_payment"
                    ? "Complete payment…"
                    : "Confirming…"}
              </>
            ) : (
              `Pay ${formatNaira(total)}`
            )}
          </button>

          {error ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            Secured by Paystack. Products are for professional use only.
            Delivery is included in the total above.
          </p>
        </aside>
      </form>
    </div>
  );
}
