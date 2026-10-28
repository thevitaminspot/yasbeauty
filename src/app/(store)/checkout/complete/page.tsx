import { Suspense } from "react";
import { CheckoutCompleteContent } from "@/app/(store)/checkout/complete/complete-content";
import { Spinner } from "@/components/ui/spinner";
import { ui } from "@/lib/ui";

function CompleteFallback() {
  return (
    <div className={ui.pageShellNarrow}>
      <Spinner className="mx-auto h-8 w-8 text-black" label="Loading" />
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        Verifying payment
      </p>
      <p className="mt-3 text-sm text-neutral-600">
        Confirming your payment with Paystack…
      </p>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<CompleteFallback />}>
      <CheckoutCompleteContent />
    </Suspense>
  );
}
