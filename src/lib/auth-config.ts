/** Real Clerk publishable keys look like pk_test_… or pk_live_… */
const PUBLISHABLE_KEY_RE = /^pk_(test|live)_[A-Za-z0-9_-]+$/;
const SECRET_KEY_RE = /^sk_(test|live)_[A-Za-z0-9_-]+$/;

function hasValidPublishableKey(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  if (!key || key.length < 40) {
    return false;
  }
  return PUBLISHABLE_KEY_RE.test(key);
}

function hasValidSecretKey(): boolean {
  const key = process.env.CLERK_SECRET_KEY?.trim();
  if (!key || key.length < 40) {
    return false;
  }
  return SECRET_KEY_RE.test(key);
}

/**
 * Clerk stays off until you opt in and add real keys:
 *
 * NEXT_PUBLIC_AUTH_ENABLED=true
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
 * CLERK_SECRET_KEY=sk_test_...
 */
export function isAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_AUTH_ENABLED !== "true") {
    return false;
  }

  if (!hasValidPublishableKey()) {
    return false;
  }

  if (typeof window === "undefined" && !hasValidSecretKey()) {
    return false;
  }

  return true;
}

export function getClerkPublishableKey(): string | undefined {
  if (!hasValidPublishableKey()) {
    return undefined;
  }
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!.trim();
}
