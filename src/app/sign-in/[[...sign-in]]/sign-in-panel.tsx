"use client";

import { SignIn } from "@clerk/nextjs";
import { ClerkAuthMount } from "@/components/clerk-auth-mount";
import { clerkAppearance } from "@/lib/clerk-appearance";

const shell =
  "mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16";

export function SignInPanel() {
  return (
    <div className={shell}>
      <ClerkAuthMount
        fallback={
          <div
            className="h-80 w-full max-w-sm animate-pulse border border-neutral-200 bg-neutral-50"
            aria-hidden
          />
        }
      >
        <SignIn appearance={clerkAppearance} routing="path" path="/sign-in" />
      </ClerkAuthMount>
    </div>
  );
}
