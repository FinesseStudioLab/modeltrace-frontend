import { describe, expect, it } from "vitest";
import { checkRateLimit } from "../../lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    const result = checkRateLimit(key, 3, 60_000, 0);
    expect(result.allowed).toBe(true);
  });

  it("blocks once the limit is reached within the window", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, 2, 60_000, 0);
    checkRateLimit(key, 2, 60_000, 10);
    const third = checkRateLimit(key, 2, 60_000, 20);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, 1, 1000, 0);
    const blocked = checkRateLimit(key, 1, 1000, 500);
    expect(blocked.allowed).toBe(false);

    const afterWindow = checkRateLimit(key, 1, 1000, 1500);
    expect(afterWindow.allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    checkRateLimit(keyA, 1, 60_000, 0);
    const resultA = checkRateLimit(keyA, 1, 60_000, 10);
    const resultB = checkRateLimit(keyB, 1, 60_000, 10);
    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
  });
});
