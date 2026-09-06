import { describe, expect, it } from "vitest";
import { buildCallBookingConfirmationMessage } from "./confirmationMessage";

describe("buildCallBookingConfirmationMessage", () => {
  const base = {
    bookingReference: "CB-20260906-ABC123",
    customerName: "Jean Claude",
    preferredDate: "2026-09-10",
    preferredTime: "14:00",
  };

  it("includes the booking reference, customer name, date, and time", () => {
    const message = buildCallBookingConfirmationMessage(base);
    expect(message).toContain("CB-20260906-ABC123");
    expect(message).toContain("Jean Claude");
    expect(message).toContain("2026-09-10");
    expect(message).toContain("14:00");
  });

  it("includes the product title when provided", () => {
    const message = buildCallBookingConfirmationMessage({
      ...base,
      productTitle: "Toyota RAV4 2019",
    });
    expect(message).toContain("About: Toyota RAV4 2019");
  });

  it("omits the product line when no product is provided", () => {
    const message = buildCallBookingConfirmationMessage(base);
    expect(message).not.toContain("About:");
  });
});
