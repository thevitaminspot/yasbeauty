"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Clerk <SignIn>/<SignUp> inject a host node on the client that does not match
 * SSR markup (ClerkHostRenderer). Mount only after hydration to avoid mismatch.
 */
export function ClerkAuthMount({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;

  return children;
}
