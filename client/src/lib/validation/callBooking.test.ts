import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callBookingSchema } from "./callBooking";

describe("callBookingSchema", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const valid = {
    name: "Jane Doe",
    phone: "+250788100001",
    date: "2026-06-16",
    time: "10:00",
    reason: "Ask about the RAV4",
    productId: "",
  };

  it("accepts a valid booking for tomorrow within business hours", () => {
    expect(callBookingSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts today's date", () => {
    expect(callBookingSchema.safeParse({ ...valid, date: "2026-06-15" }).success).toBe(true);
  });

  it("rejects a date in the past", () => {
    expect(callBookingSchema.safeParse({ ...valid, date: "2026-06-14" }).success).toBe(false);
  });

  it("rejects a time before 08:00", () => {
    expect(callBookingSchema.safeParse({ ...valid, time: "07:59" }).success).toBe(false);
  });

  it("rejects a time after 20:00", () => {
    expect(callBookingSchema.safeParse({ ...valid, time: "20:01" }).success).toBe(false);
  });

  it("accepts the business-hours boundaries", () => {
    expect(callBookingSchema.safeParse({ ...valid, time: "08:00" }).success).toBe(true);
    expect(callBookingSchema.safeParse({ ...valid, time: "20:00" }).success).toBe(true);
  });

  it("rejects a reason shorter than 3 characters", () => {
    expect(callBookingSchema.safeParse({ ...valid, reason: "hi" }).success).toBe(false);
  });

  it("allows productId to be omitted", () => {
    expect(callBookingSchema.safeParse({ ...valid, productId: "prod-1" }).success).toBe(true);
  });
});
