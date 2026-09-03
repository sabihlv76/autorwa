import { describe, expect, it } from "vitest";
import { advertisementFormSchema } from "./advertisement";

describe("advertisementFormSchema", () => {
  const valid = {
    position: "top_left",
    title: "List your car with us",
    imageUrl: "",
    targetUrl: "/book-call",
    advertiser: "Autorwa",
    active: "on",
    startDate: "",
    endDate: "",
    priority: "5",
  };

  it("accepts a valid advertisement", () => {
    const result = advertisementFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("coerces the 'on' checkbox value to true, and its absence to false", () => {
    const on = advertisementFormSchema.safeParse(valid);
    expect(on.success && on.data.active).toBe(true);

    const { active: _active, ...withoutActive } = valid;
    const off = advertisementFormSchema.safeParse(withoutActive);
    expect(off.success && off.data.active).toBe(false);
  });

  it("transforms empty-string dates to undefined", () => {
    const result = advertisementFormSchema.safeParse(valid);
    expect(result.success && result.data.startDate).toBeUndefined();
    expect(result.success && result.data.endDate).toBeUndefined();
  });

  it("transforms a provided date string to a Date", () => {
    const result = advertisementFormSchema.safeParse({ ...valid, startDate: "2026-06-01" });
    expect(result.success && result.data.startDate).toBeInstanceOf(Date);
  });

  it("rejects an invalid position", () => {
    expect(
      advertisementFormSchema.safeParse({ ...valid, position: "bottom_center" }).success,
    ).toBe(false);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(advertisementFormSchema.safeParse({ ...valid, title: "ab" }).success).toBe(false);
  });

  it("rejects priority above 100", () => {
    expect(advertisementFormSchema.safeParse({ ...valid, priority: "101" }).success).toBe(false);
  });
});
