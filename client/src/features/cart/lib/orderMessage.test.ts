import { describe, expect, it } from "vitest";
import { buildOrderMessage, buildWhatsAppUrl } from "./orderMessage";

describe("buildOrderMessage", () => {
  const base = {
    orderReference: "AR-20260615-ABC123",
    customerName: "Jane Doe",
    customerPhone: "+250788100001",
    totalAmount: 90,
    currency: "USD" as const,
  };

  it("includes the header, reference, customer details, and total", () => {
    const message = buildOrderMessage({
      ...base,
      items: [{ title: "Brake Pads", quantity: 2, priceSnapshot: 45 }],
    });
    expect(message).toContain("AUTORWA ORDER REQUEST");
    expect(message).toContain("Order Reference: AR-20260615-ABC123");
    expect(message).toContain("Customer Name: Jane Doe");
    expect(message).toContain("Customer Phone: +250788100001");
    expect(message).toContain("Total Amount: $90.00");
  });

  it("formats a regular (non-rental) line item with quantity", () => {
    const message = buildOrderMessage({
      ...base,
      items: [{ title: "Brake Pads", quantity: 2, priceSnapshot: 45 }],
    });
    expect(message).toContain("- Brake Pads x2 - $45.00");
  });

  it("formats a rental line item with the rental period instead of a quantity", () => {
    const message = buildOrderMessage({
      ...base,
      items: [
        {
          title: "Toyota RAV4 2019",
          quantity: 1,
          priceSnapshot: 260,
          isRental: true,
          rentalStartDate: "2026-06-10T00:00:00.000Z",
          rentalEndDate: "2026-06-14T00:00:00.000Z",
          rentalDays: 4,
        },
      ],
    });
    expect(message).toContain(
      "- Toyota RAV4 2019 (Rental: 2026-06-10 to 2026-06-14, 4 days) - $260.00",
    );
  });

  it("appends customer notes only when provided", () => {
    const withNotes = buildOrderMessage({
      ...base,
      items: [{ title: "Brake Pads", quantity: 1, priceSnapshot: 45 }],
      notes: "Please call before delivery",
    });
    expect(withNotes).toContain("Customer Notes: Please call before delivery");

    const withoutNotes = buildOrderMessage({
      ...base,
      items: [{ title: "Brake Pads", quantity: 1, priceSnapshot: 45 }],
    });
    expect(withoutNotes).not.toContain("Customer Notes:");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the URL-encoded message", () => {
    const url = buildWhatsAppUrl("250788100001", "Hello there");
    expect(url).toBe("https://wa.me/250788100001?text=Hello%20there");
  });
});
