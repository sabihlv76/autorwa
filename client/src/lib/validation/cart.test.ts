import { describe, expect, it } from "vitest";
import { confirmOrderSchema, quantitySchema } from "./cart";

describe("quantitySchema", () => {
  it("accepts 0 (used to mean remove)", () => {
    expect(quantitySchema.safeParse(0).success).toBe(true);
  });

  it("accepts a positive integer", () => {
    expect(quantitySchema.safeParse(5).success).toBe(true);
  });

  it("coerces a numeric string", () => {
    const result = quantitySchema.safeParse("3");
    expect(result.success && result.data).toBe(3);
  });

  it("rejects a negative number", () => {
    expect(quantitySchema.safeParse(-1).success).toBe(false);
  });

  it("rejects above the 999 cap", () => {
    expect(quantitySchema.safeParse(1000).success).toBe(false);
  });
});

describe("confirmOrderSchema", () => {
  const valid = {
    sellerId: "seller-1",
    name: "Jane Doe",
    phone: "+250788100001",
    notes: "",
  };

  it("accepts a valid confirm-order payload", () => {
    expect(confirmOrderSchema.safeParse(valid).success).toBe(true);
  });

  it("allows notes to be omitted", () => {
    const { notes: _notes, ...withoutNotes } = valid;
    expect(confirmOrderSchema.safeParse(withoutNotes).success).toBe(true);
  });

  it("rejects a missing sellerId", () => {
    expect(confirmOrderSchema.safeParse({ ...valid, sellerId: "" }).success).toBe(false);
  });

  it("rejects an invalid phone", () => {
    expect(confirmOrderSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });
});
