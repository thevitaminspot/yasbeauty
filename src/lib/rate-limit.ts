import "server-only";
import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

type Store = Map<string, Bucket>;

function getStore(): Store {
  const g = globalThis as typeof globalThis & { __yasRateLimit?: Store };
  if (!g.__yasRateLimit) g.__yasRateLimit = new Map();
  return g.__yasRateLimit;
}

/** Best-effort client IP (Vercel sets x-forwarded-for). */
export function clientIpFromHeaders(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headerStore.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export function clientIp(request: Request): string {
  return clientIpFromHeaders(request.headers);
}

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

/**
 * Fixed-window counter per key (typically `bucket:ip`).
 * In-memory — works in local/dev and soft-limits per serverless isolate.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  let bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(key, bucket);
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.ok) {
    headers["Retry-After"] = String(
      Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000)),
    );
  }
  return headers;
}

export function rateLimitedJson(result: RateLimitResult) {
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429, headers: rateLimitHeaders(result) },
  );
}

function envInt(name: string, fallback: number) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/** Per-IP limits for abuse-prone write paths. Override via env for tests. */
export const RATE_LIMITS = {
  booking: {
    limit: envInt("RATE_LIMIT_BOOKING", 8),
    windowMs: envInt("RATE_LIMIT_BOOKING_WINDOW_MS", 10 * 60 * 1000),
  },
  checkout: {
    limit: envInt("RATE_LIMIT_CHECKOUT", 15),
    windowMs: envInt("RATE_LIMIT_CHECKOUT_WINDOW_MS", 10 * 60 * 1000),
  },
  verify: {
    limit: envInt("RATE_LIMIT_VERIFY", 40),
    windowMs: envInt("RATE_LIMIT_VERIFY_WINDOW_MS", 10 * 60 * 1000),
  },
} as const;

export function enforceRateLimit(
  request: Request,
  bucket: keyof typeof RATE_LIMITS,
) {
  const cfg = RATE_LIMITS[bucket];
  const result = checkRateLimit(`${bucket}:${clientIp(request)}`, cfg);
  if (result.ok) return null;
  return rateLimitedJson(result);
}

/** For server actions (no Request object). */
export function enforceRateLimitFromHeaders(
  headerStore: Headers,
  bucket: keyof typeof RATE_LIMITS,
): { ok: true } | { ok: false; error: string } {
  const cfg = RATE_LIMITS[bucket];
  const result = checkRateLimit(
    `${bucket}:${clientIpFromHeaders(headerStore)}`,
    cfg,
  );
  if (result.ok) return { ok: true };
  return {
    ok: false,
    error: "Too many requests. Please try again shortly.",
  };
}

/** Test helper — clears in-memory counters. */
export function resetRateLimitStoreForTests() {
  getStore().clear();
}
