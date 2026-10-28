"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { formatNaira } from "@/lib/format";
import { ui } from "@/lib/ui";

type VerifyState =
  | { status: "loading" }
  | { status: "success"; reference: string; amount: number; bookingId?: string }
  | { status: "failed"; message: string };

export function BookCompleteContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference")?.trim() || null;
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  const runVerify = useCallback(async (ref: string) => {
    setState({ status: "loading" });
    try {
      const res = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(ref)}`,
      );
      const data = (await res.json()) as {
        status?: string;
        reference?: string;
        amount?: number;
        bookingId?: string;
        kind?: string;
        error?: string;
      };

      if (!res.ok || data.status !== "success") {
        setState({
          status: "failed",
          message: data.error ?? "Deposit was not completed.",
        });
        return;
      }

      setState({
        status: "success",
        reference: data.reference ?? ref,
        amount: data.amount ?? 0,
        bookingId: data.bookingId,
      });
    } catch {
      setState({
        status: "failed",
        message: "Could not verify deposit. Please try again or contact us.",
      });
    }
  }, []);

  useEffect(() => {
    if (!reference) {
      setState({
        status: "failed",
        message: "Missing payment reference.",
      });
      return;
    }
    void runVerify(reference);
  }, [reference, runVerify]);

  if (state.status === "loading") {
    return (
      <div className={ui.pageShellNarrow}>
        <Spinner className="mx-auto h-8 w-8 text-black" label="Verifying" />
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Confirming deposit
        </p>
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <div className={ui.pageShellNarrow}>
        <PageHeader
          title="Deposit issue"
          lede={state.message}
          align="center"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/book" className={ui.btnPrimary}>
            Back to booking
          </Link>
          <Link href="/contact" className={ui.btnGhost}>
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.pageShellNarrow}>
      <PageHeader
        title="Deposit received"
        lede={
          state.amount > 0
            ? `${formatNaira(state.amount / 100)} paid — we’ll confirm your chair shortly.`
            : "We’ll confirm your chair shortly."
        }
        align="center"
      />
      <p className="mt-4 font-mono text-xs text-neutral-500">
        Ref · {state.reference}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {state.bookingId ? (
          <Link
            href={`/account/bookings/${encodeURIComponent(state.bookingId)}`}
            className={ui.btnPrimary}
          >
            View booking
          </Link>
        ) : (
          <Link href="/account/bookings" className={ui.btnPrimary}>
            My bookings
          </Link>
        )}
        <Link href="/" className={ui.btnGhost}>
          Home
        </Link>
      </div>
    </div>
  );
}
