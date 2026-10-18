/**
 * Fixed-window in-memory rate limiter.
 *
 * Limitation: state is per server instance. On serverless platforms each instance has its own window,
 * so this blunts bursts from a single client but is not a global guarantee.
 * Upgrade path: a shared store (e.g. Upstash Redis) — see docs/DEPLOYMENT.md.
 */
export interface RateLimiter {
  check(key: string, now?: number): { allowed: boolean; retryAfterMs: number };
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key, now = Date.now()) {
      // Opportunistic cleanup keeps memory bounded.
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterMs: 0 };
      }
      if (entry.count >= limit) {
        return { allowed: false, retryAfterMs: entry.resetAt - now };
      }
      entry.count += 1;
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
