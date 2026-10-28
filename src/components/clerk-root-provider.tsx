"use client";

import { ClerkProviderInner } from "@/components/clerk-provider-inner";
import { isAuthEnabled } from "@/lib/auth-config";

export function ClerkRootProvider({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return children;
  }

  return <ClerkProviderInner>{children}</ClerkProviderInner>;
}
