"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { ui } from "@/lib/ui";

type VerifyState =
  | { status: "loading"; hint: string }
  | { status: "pending"; reference: string; message: string }
  | { status: "success"; reference: string; amount: number }
  | { status: "failed"; message: string; reference?: string };

const PENDING_POLL_MS = 2500;
const MAX_POLLS = 8;

async function verifyReference(reference: string) {
  const res = await fetch(
    `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
  );
  const data = (await res.json()) as {
    status?: string;
    reference?: string;
    amount?: number;
    error?: string;
  };
  return { res, data };
}

export function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference")?.trim() || null;
  const { clearCart } = useCart();
  const [state, setState] = useState<VerifyState>({
    status: "loading",
    hint: "Confirming your payment with Paystack…",
  });
  const clearedRef = useRef(false);
  const pollCountRef = useRef(0);

  const applySuccess = useCallback(
    (ref: string, amount: number) => {
      if (!clearedRef.current) {
        clearCart();
        clearedRef.current = true;
      }
      setState({ status: "success", reference: ref, amount });
    },
    [clearCart],
  );

  const runVerify = useCallback(
    async (ref: string, soft = false) => {
      if (!soft) {
        setState({
          status: "loading",
          hint: "Confirming your payment with Paystack…",
        });
      }

      try {
        const { res, data } = await verifyReference(ref);

        if (!res.ok && !data.status) {
          setState({
            status: "failed",
            message: data.error ?? "Payment was not completed.",
            reference: ref,
          });
          return;
        }

        const payStatus = data.status ?? "";

        if (payStatus === "success") {
          applySuccess(data.reference ?? ref, data.amount ?? 0);
          return;
        }

        if (
          payStatus === "abandoned" ||
          payStatus === "failed" ||
          payStatus === "reversed"
        ) {
          setState({
            status: "failed",
            message:
              data.error ??
              (payStatus === "abandoned"
                ? "Payment was abandoned before completion."
                : "Payment was not successful."),
            reference: ref,
          });
          return;
        }

        // pending / ongoing / processing — poll a few times
        if (pollCountRef.current < MAX_POLLS) {
          pollCountRef.current += 1;
          setState({
            status: "pending",
            reference: ref,
            message:
              "Paystack is still processing this payment. This can take a moment for bank transfers.",
          });
          return;
        }

        setState({
          status: "pending",
          reference: ref,
          message:
            "We’re still waiting on Paystack. You can check again, or open My orders once the charge clears.",
        });
      } catch {
        setState({
          status: "failed",
          message:
            "Could not verify payment. Check your connection and try again.",
          reference: ref,
        });
      }
    },
    [applySuccess],
  );

  useEffect(() => {
    if (!reference) {
      setState({
        status: "failed",
        message: "Missing payment reference. Return to checkout to try again.",
      });
      return;
    }

    pollCountRef.current = 0;
    void runVerify(reference);
  }, [reference, runVerify]);

  useEffect(() => {
    if (state.status !== "pending" || !state.reference) return;
    if (pollCountRef.current > MAX_POLLS) return;

    const timer = window.setTimeout(() => {
      void runVerify(state.reference, true);
    }, PENDING_POLL_MS);

    return () => window.clearTimeout(timer);
  }, [state, runVerify]);

  if (state.status === "loading") {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <Spinner className="mx-auto h-8 w-8 text-black" label="Verifying" />
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Verifying payment
        </p>
        <p className="mt-3 text-sm text-neutral-600">{state.hint}</p>
        <p className="mt-2 text-xs text-neutral-400">
          Please don’t refresh or close this page.
        </p>
      </div>
    );
  }

  if (state.status === "pending") {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <Spinner className="mx-auto h-8 w-8 text-black" label="Pending" />
        <PageHeader
          title="Payment processing"
          lede={state.message}
          align="center"
        />
        {state.reference ? (
          <p className="mt-4 font-mono text-xs text-neutral-500">
            Ref · {state.reference}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className={ui.btnPrimary}
            onClick={() => {
              pollCountRef.current = 0;
              void runVerify(state.reference);
            }}
          >
            Check again
          </button>
          <Link href="/account/orders" className={ui.btnGhost}>
            My orders
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <PageHeader
          title="Payment issue"
          lede={state.message}
          align="center"
        />
        {state.reference ? (
          <p className="mt-4 font-mono text-xs text-neutral-500">
            Ref · {state.reference}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {state.reference ? (
            <button
              type="button"
              className={ui.btnSecondary}
              onClick={() => {
                pollCountRef.current = 0;
                void runVerify(state.reference!);
              }}
            >
              Retry verification
            </button>
          ) : null}
          <Link href="/checkout" className={ui.btnPrimary}>
            Return to checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ui.pageShellNarrow}`}>
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center border border-black text-black"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="square" />
        </svg>
      </div>
      <PageHeader
        title="Payment received"
        lede={
          state.amount > 0
            ? `${formatNaira(state.amount / 100)} charged successfully.`
            : "Thank you — your payment went through."
        }
        align="center"
      />
      <p className="mt-4 font-mono text-xs text-neutral-500">
        Ref · {state.reference}
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        We’ll confirm dispatch or Abuja pickup by email shortly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/account/orders/${encodeURIComponent(state.reference)}`}
          className={ui.btnPrimary}
        >
          View order
        </Link>
        <Link href="/shop" className={ui.btnGhost}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
