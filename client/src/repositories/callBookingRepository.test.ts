import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as callBookingRepository from "./callBookingRepository";

beforeAll(startTestDatabase, 180000);
afterAll(stopTestDatabase, 30000);
afterEach(clearCollections);

function bookingInput(
  overrides: Partial<Parameters<typeof callBookingRepository.create>[0]> = {},
) {
  return {
    customerName: "Jane Doe",
    phone: "+250788999999",
    preferredDate: new Date("2026-10-01"),
    preferredTime: "14:00",
    reason: "Interested in the Toyota RAV4",
    product: { id: "p1", title: "Toyota RAV4", slug: "toyota-rav4" },
    seller: { id: "s1", name: "Kigali Motors", whatsapp: "+250788100001" },
    ...overrides,
  };
}

describe("callBookingRepository.create", () => {
  it("generates a PREFIX-YYYYMMDD-XXXXXX booking reference", async () => {
    const booking = await callBookingRepository.create(bookingInput());
    expect(booking.bookingReference).toMatch(/^CB-\d{8}-[A-Z0-9]{6}$/);
  });

  it("generates unique references across multiple bookings", async () => {
    const first = await callBookingRepository.create(bookingInput());
    const second = await callBookingRepository.create(bookingInput());
    expect(first.bookingReference).not.toBe(second.bookingReference);
  });

  it("defaults status to 'requested'", async () => {
    const booking = await callBookingRepository.create(bookingInput());
    const result = await callBookingRepository.findMany({ page: 1, pageSize: 10 });
    const found = result.items.find((item) => item.id === booking.id);
    expect(found?.status).toBe("requested");
  });
});

describe("callBookingRepository.updateStatus", () => {
  it("updates the status", async () => {
    const booking = await callBookingRepository.create(bookingInput());
    await callBookingRepository.updateStatus(booking.id, "confirmed");

    const result = await callBookingRepository.findMany({
      status: "confirmed",
      page: 1,
      pageSize: 10,
    });
    expect(result.items.some((item) => item.id === booking.id)).toBe(true);
  });
});

describe("callBookingRepository.findMany", () => {
  it("filters by status", async () => {
    const created = await callBookingRepository.create(bookingInput());
    await callBookingRepository.create(bookingInput({ customerName: "Other customer" }));
    await callBookingRepository.updateStatus(created.id, "cancelled");

    const result = await callBookingRepository.findMany({
      status: "cancelled",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(1);
    expect(result.items[0].id).toBe(created.id);
  });

  it("includes the snapshotted product title", async () => {
    const booking = await callBookingRepository.create(
      bookingInput({ product: { id: "p2", title: "Honda Fit", slug: "honda-fit" } }),
    );
    const result = await callBookingRepository.findMany({ page: 1, pageSize: 10 });
    const found = result.items.find((item) => item.id === booking.id);
    expect(found?.productTitle).toBe("Honda Fit");
  });

  it("paginates results", async () => {
    for (let i = 0; i < 3; i++) {
      await callBookingRepository.create(bookingInput({ customerName: `Customer ${i}` }));
    }
    const page1 = await callBookingRepository.findMany({ page: 1, pageSize: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.totalPages).toBe(2);
  });
});
