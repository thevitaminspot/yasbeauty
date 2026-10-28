import { Suspense } from "react";
import { BookCompleteContent } from "@/app/(store)/book/complete/complete-content";
import { Spinner } from "@/components/ui/spinner";
import { ui } from "@/lib/ui";

function Fallback() {
  return (
    <div className={ui.pageShellNarrow}>
      <Spinner className="mx-auto h-8 w-8 text-black" label="Loading" />
      <p className="mt-6 text-sm text-neutral-600">Confirming your deposit…</p>
    </div>
  );
}

export default function BookCompletePage() {
  return (
    <Suspense fallback={<Fallback />}>
      <BookCompleteContent />
    </Suspense>
  );
}
