const PAYSTACK_BASE = "https://api.paystack.co";

function readEnv(name: string): string {
  let value = process.env[name]?.trim() ?? "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

/** Real Paystack keys are long hex-ish strings — never the example `pk_test_...`. */
function looksLikePaystackKey(key: string, kind: "pk" | "sk") {
  if (key.length < 20) return false;
  if (/\.\.\.|YOUR_|placeholder|xxxx|changeme/i.test(key)) return false;
  return new RegExp(`^${kind}_(test|live)_[A-Za-z0-9]+$`).test(key);
}

export function getPaystackSecretKey(): string {
  const key = readEnv("PAYSTACK_SECRET_KEY");
  if (!looksLikePaystackKey(key, "sk")) {
    throw new Error("Payment service is unavailable.");
  }
  return key;
}

export function getPaystackPublicKey(): string | undefined {
  const key = readEnv("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY");
  if (!looksLikePaystackKey(key, "pk")) return undefined;
  return key;
}

export function isPaystackConfigured(): boolean {
  return Boolean(
    getPaystackPublicKey() &&
      looksLikePaystackKey(readEnv("PAYSTACK_SECRET_KEY"), "sk"),
  );
}

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
    metadata?: Record<string, unknown>;
  };
};

export async function paystackRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as T & { message?: string };
  if (!res.ok) {
    throw new Error(body.message ?? `Paystack error (${res.status})`);
  }
  return body;
}

export function nairaToKobo(amount: number): number {
  return Math.round(amount * 100);
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
