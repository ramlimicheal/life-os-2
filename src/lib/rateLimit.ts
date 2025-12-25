interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMITS = {
  ai_categorize: { maxRequests: 20, windowMs: 60 * 1000 },
  ai_search: { maxRequests: 10, windowMs: 60 * 1000 },
  default: { maxRequests: 100, windowMs: 60 * 1000 },
};

export type RateLimitType = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(
  userId: string,
  type: RateLimitType = "default"
): RateLimitResult {
  const key = `${userId}:${type}`;
  const now = Date.now();
  const limits = RATE_LIMITS[type] || RATE_LIMITS.default;

  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + limits.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, limits.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetTime - now);

  return {
    success: entry.count <= limits.maxRequests,
    remaining,
    resetIn,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetIn.toString(),
  };
}

export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 60 * 1000);
