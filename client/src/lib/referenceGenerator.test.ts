import { describe, expect, it, vi } from "vitest";
import { createWithUniqueReference } from "./referenceGenerator";

describe("createWithUniqueReference", () => {
  it("generates a {prefix}-YYYYMMDD-XXXXXX formatted reference", async () => {
    let seenReference = "";
    await createWithUniqueReference(
      async (reference) => {
        seenReference = reference;
        return { ok: true };
      },
      { prefix: "AR" },
    );
    expect(seenReference).toMatch(/^AR-\d{8}-[A-Z0-9]{6}$/);
  });

  it("returns createFn's result on success", async () => {
    const result = await createWithUniqueReference(async (reference) => ({ reference, id: 1 }), {
      prefix: "CB",
    });
    expect(result.id).toBe(1);
  });

  it("retries on a MongoDB duplicate-key error (code 11000)", async () => {
    let attempts = 0;
    const result = await createWithUniqueReference(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          const err = new Error("duplicate") as Error & { code: number };
          err.code = 11000;
          throw err;
        }
        return "success";
      },
      { prefix: "AR" },
    );
    expect(attempts).toBe(3);
    expect(result).toBe("success");
  });

  it("does not retry and rethrows a non-duplicate-key error", async () => {
    const createFn = vi.fn(async () => {
      throw new Error("some other failure");
    });
    await expect(createWithUniqueReference(createFn, { prefix: "AR" })).rejects.toThrow(
      "some other failure",
    );
    expect(createFn).toHaveBeenCalledTimes(1);
  });

  it("gives up after maxAttempts duplicate-key errors", async () => {
    const createFn = vi.fn(async () => {
      const err = new Error("duplicate") as Error & { code: number };
      err.code = 11000;
      throw err;
    });
    await expect(
      createWithUniqueReference(createFn, { prefix: "AR", maxAttempts: 2 }),
    ).rejects.toThrow(/Could not generate a unique AR reference/);
    expect(createFn).toHaveBeenCalledTimes(2);
  });
});
