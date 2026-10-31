"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { getClerkPublishableKey, isAuthEnabled } from "@/lib/auth-config";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function ClerkProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = getClerkPublishableKey();

  if (!isAuthEnabled() || !publishableKey) {
    return children;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
