export const CONSENT_COOKIE = "yas_cookie_consent";

export type ConsentChoice = "all" | "essential";

export function allowsAnalytics(choice: ConsentChoice | null) {
  return choice === "all";
}

export function readConsentFromDocument(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]!) : "";
  if (value === "all" || value === "essential") return value;
  return null;
}

export function writeConsentCookie(choice: ConsentChoice) {
  const maxAge = 365 * 24 * 60 * 60;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(choice)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
