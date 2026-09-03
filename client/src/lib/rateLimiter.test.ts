import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./rateLimiter";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows attempts up to the configured max", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(key, { maxAttempts: 5, windowMs: 1000 });
      expect(result.allowed).toBe(true);
    }
  });

  it("denies the attempt once the max is exceeded within the window", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { maxAttempts: 5, windowMs: 1000 });
    }
    const sixth = checkRateLimit(key, { maxAttempts: 5, windowMs: 1000 });
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterMs).toBeGreaterThan(0);
  });

  it("allows again once the window has fully elapsed", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { maxAttempts: 5, windowMs: 1000 });
    }
    vi.advanceTimersByTime(1001);
    const afterWindow = checkRateLimit(key, { maxAttempts: 5, windowMs: 1000 });
    expect(afterWindow.allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `a-${Math.random()}`;
    const keyB = `b-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(keyA, { maxAttempts: 5, windowMs: 1000 });
    }
    const resultB = checkRateLimit(keyB, { maxAttempts: 5, windowMs: 1000 });
    expect(resultB.allowed).toBe(true);
  });
});
