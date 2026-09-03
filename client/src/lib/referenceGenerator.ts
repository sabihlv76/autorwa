function generateReference(prefix: string): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  );
}

/**
 * Generates a `{prefix}-YYYYMMDD-XXXXXX` reference and retries `createFn`
 * on a MongoDB duplicate-key error (collision is astronomically unlikely,
 * but a unique index is the actual guarantee, so this closes the loop).
 */
export async function createWithUniqueReference<T>(
  createFn: (reference: string) => Promise<T>,
  { prefix, maxAttempts = 5 }: { prefix: string; maxAttempts?: number },
): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const reference = generateReference(prefix);
    try {
      return await createFn(reference);
    } catch (err) {
      if (!isDuplicateKeyError(err)) throw err;
    }
  }

  throw new Error(`Could not generate a unique ${prefix} reference after ${maxAttempts} attempts.`);
}
