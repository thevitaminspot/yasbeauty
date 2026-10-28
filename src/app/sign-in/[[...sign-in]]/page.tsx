import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { isAuthEnabled } from "@/lib/auth-config";
import { ui } from "@/lib/ui";
import { SignInPanel } from "./sign-in-panel";

export default function SignInPage() {
  if (!isAuthEnabled()) {
    return (
      <div className={`${ui.pageShellNarrow}`}>
        <PageHeader
          title="Sign in"
          lede="Accounts aren't available at the moment. You can still browse the shop and book online."
          align="center"
        />
        <Link href="/" className={`${ui.btnGhost} mt-8`}>
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
          <div className="h-80 w-full max-w-sm animate-pulse border border-neutral-200 bg-neutral-50" />
        </div>
      }
    >
      <SignInPanel />
    </Suspense>
  );
}
