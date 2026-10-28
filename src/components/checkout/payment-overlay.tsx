import { Spinner } from "@/components/ui/spinner";

type PaymentOverlayProps = {
  title: string;
  message: string;
};

/** Full-viewport lock while preparing or confirming payment. */
export function PaymentOverlay({ title, message }: PaymentOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-6 backdrop-blur-[2px]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="payment-overlay-title"
      aria-describedby="payment-overlay-desc"
    >
      <div className="w-full max-w-sm border border-neutral-800 bg-black px-8 py-10 text-center text-white shadow-2xl">
        <Spinner className="mx-auto h-8 w-8 text-white" label={title} />
        <p
          id="payment-overlay-title"
          className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em]"
        >
          {title}
        </p>
        <p
          id="payment-overlay-desc"
          className="mt-3 text-sm leading-relaxed text-neutral-400"
        >
          {message}
        </p>
      </div>
    </div>
  );
}
