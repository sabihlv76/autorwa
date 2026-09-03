// Per-process, in-memory sliding-window limiter. Good enough to add real
// abuse friction for a single dev/small-deployment instance; it does NOT
// survive restarts or work across multiple serverless instances — swap for
// a shared store (e.g. Redis) before running more than one instance.

interface Bucket {
  attempts: number[];
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { attempts: [] };
  bucket.attempts = bucket.attempts.filter((t) => now - t < windowMs);

  if (bucket.attempts.length >= maxAttempts) {
    const oldest = bucket.attempts[0];
    buckets.set(key, bucket);
    return { allowed: false, retryAfterMs: windowMs - (now - oldest) };
  }

  bucket.attempts.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterMs: 0 };
}
