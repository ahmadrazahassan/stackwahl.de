// Sliding-window rate limit per form and client (Section 8). In-memory, so on serverless hosts
// it limits per instance only; replace the store with a shared one (e.g. KV) before relying on it
// against determined abuse. Pure apart from the injected clock, so it is unit tested.

export type RateLimiter = (key: string) => { allowed: boolean; retryAfterSeconds: number };

export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  return (key) => {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (t - recent[0])) / 1000) };
    }
    recent.push(t);
    hits.set(key, recent);
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
