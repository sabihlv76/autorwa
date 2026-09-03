import { describe, expect, it } from "vitest";
import { computeRentalDays, getDailyRate, isRentable, isSellable } from "./rental";
import type { Vehicle } from "@/types/product";

function makeVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: "veh-1",
    slug: "toyota-rav4-2019",
    type: "vehicle",
    title: "Toyota RAV4 2019",
    description: "A car.",
    price: 21500,
    currency: "USD",
    images: [],
    seller: {
      id: "seller-1",
      name: "Kigali Motors",
      verified: true,
      location: "Kigali",
      whatsapp: "+250788100001",
    },
    availability: "available",
    featured: false,
    createdAt: new Date().toISOString(),
    make: "Toyota",
    model: "RAV4",
    year: 2019,
    condition: "used",
    mileageKm: 62000,
    fuel: "petrol",
    transmission: "automatic",
    driveType: "awd",
    engineCapacityL: 2.5,
    bodyType: "suv",
    color: "White",
    location: "Kigali",
    features: [],
    negotiable: true,
    listingType: "sale",
    minRentalDays: 1,
    ...overrides,
  };
}

describe("isRentable", () => {
  it("is false for sale-only", () => {
    expect(isRentable(makeVehicle({ listingType: "sale" }))).toBe(false);
  });

  it("is true for rent-only", () => {
    expect(isRentable(makeVehicle({ listingType: "rent" }))).toBe(true);
  });

  it("is true for both", () => {
    expect(isRentable(makeVehicle({ listingType: "both" }))).toBe(true);
  });
});

describe("isSellable", () => {
  it("is true for sale-only", () => {
    expect(isSellable(makeVehicle({ listingType: "sale" }))).toBe(true);
  });

  it("is false for rent-only", () => {
    expect(isSellable(makeVehicle({ listingType: "rent" }))).toBe(false);
  });

  it("is true for both", () => {
    expect(isSellable(makeVehicle({ listingType: "both" }))).toBe(true);
  });
});

describe("getDailyRate", () => {
  it("uses price as the daily rate for rent-only", () => {
    const vehicle = makeVehicle({ listingType: "rent", price: 65 });
    expect(getDailyRate(vehicle)).toBe(65);
  });

  it("uses the distinct dailyRentalRate for 'both'", () => {
    const vehicle = makeVehicle({ listingType: "both", price: 21500, dailyRentalRate: 65 });
    expect(getDailyRate(vehicle)).toBe(65);
  });

  it("falls back to price for 'both' if dailyRentalRate is somehow missing", () => {
    const vehicle = makeVehicle({ listingType: "both", price: 21500, dailyRentalRate: undefined });
    expect(getDailyRate(vehicle)).toBe(21500);
  });
});

describe("computeRentalDays", () => {
  it("computes whole days between two dates", () => {
    const start = new Date("2026-06-01T00:00:00Z");
    const end = new Date("2026-06-05T00:00:00Z");
    expect(computeRentalDays(start, end)).toBe(4);
  });

  it("returns 0 for the same date", () => {
    const date = new Date("2026-06-01T00:00:00Z");
    expect(computeRentalDays(date, date)).toBe(0);
  });
});
