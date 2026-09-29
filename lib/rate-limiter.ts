/**
 * lib/rate-limiter.ts
 * Lightweight in-memory rate limiter for Next.js API routes.
 * Uses a sliding window / token approach per client IP.
 */
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /** Time window in milliseconds (e.g. 60_000 for 1 minute) */
  windowMs: number;
  /** Maximum allowed requests within the window */
  maxRequests: number;
  /** Custom error message when limited */
  message?: string;
  /** Optional key prefix to isolate endpoints */
  keyPrefix?: string;
}

interface RequestRecord {
  timestamps: number[];
}

const ipStore = new Map<string, RequestRecord>();

// Cleanup stale records periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        ipStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Reset all in-memory rate limits (useful for development & testing)
 */
export function resetRateLimits(): void {
  ipStore.clear();
}

/**
 * Extract client IP address from Next.js request headers
 */
export function getClientIp(req: Request | NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown-ip';
}

/**
 * Check if the request exceeds rate limits.
 * Returns null if allowed, or a NextResponse (429) if blocked.
 */
export function checkRateLimit(
  req: Request | NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; response?: NextResponse } {
  const ip = getClientIp(req);

  // Bypass strict rate limits in development or on localhost so legitimate local testing is never blocked
  const isLocalhost =
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip === 'unknown-ip' ||
    process.env.NODE_ENV !== 'production';

  if (isLocalhost) {
    return { allowed: true, remaining: 999 };
  }

  const storeKey = `${config.keyPrefix || 'global'}:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const record = ipStore.get(storeKey) || { timestamps: [] };
  // Keep only timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil(
      (record.timestamps[0] + config.windowMs - now) / 1000
    );
    const message =
      config.message ||
      `Too many requests. Please try again in ${retryAfterSeconds} seconds.`;

    const response = NextResponse.json(
      { error: message, retryAfter: retryAfterSeconds },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, retryAfterSeconds)),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
        },
      }
    );

    return { allowed: false, remaining: 0, response };
  }

  record.timestamps.push(now);
  ipStore.set(storeKey, record);

  const remaining = config.maxRequests - record.timestamps.length;
  return { allowed: true, remaining };
}
