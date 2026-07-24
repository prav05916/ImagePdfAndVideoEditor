import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// In-memory rate limiter (Node.js runtime, single-instance)
// For multi-instance / multi-region deployments, swap this Map for Upstash Redis
// using @upstash/ratelimit — the interface stays the same.
// ─────────────────────────────────────────────────────────────────────────────

interface RateEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateEntry>();

/**
 * Token-bucket rate limiter.
 * @param key       - unique identifier (e.g. IP + route prefix)
 * @param limit     - max requests allowed per window
 * @param windowMs  - window size in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
function isAllowed(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route-specific rate-limit configuration
// ─────────────────────────────────────────────────────────────────────────────

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/checkout": { limit: 10, windowMs: 60_000 },  // 10 req/min per IP
  "/api/webhook": { limit: 200, windowMs: 60_000 },  // 200 req/min (Razorpay/Stripe webhooks)
};

// ─────────────────────────────────────────────────────────────────────────────
// Proxy function (Next.js 16 — replaces middleware)
// ─────────────────────────────────────────────────────────────────────────────

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Reject headless/scripted requests with no User-Agent ─────────────
  const userAgent = req.headers.get("user-agent") || "";
  if (!userAgent && pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── 2. Rate limiting on sensitive API routes ─────────────────────────────
  const matchedRoute = Object.keys(RATE_LIMITS).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { limit, windowMs } = RATE_LIMITS[matchedRoute];
    const key = `${ip}:${matchedRoute}`;

    if (!isAllowed(key, limit, windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // ── 3. Add request-ID header for traceability ────────────────────────────
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set("X-Request-Id", requestId);

  return response;
}

export const config = {
  matcher: [
    // Apply only to API routes
    "/api/:path*",
  ],
};
