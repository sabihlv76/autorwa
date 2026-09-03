import { describe, expect, it } from "vitest";
import { computeMaxQuantity } from "./quantity";
import type { SparePart, Vehicle } from "@/types/product";

const seller = {
  id: "seller-1",
  name: "Kigali Motors",
  verified: true,
  location: "Kigali",
  whatsapp: "+250788100001",
};

function makeVehicle(): Vehicle {
  return {
    id: "veh-1",
    slug: "toyota-rav4",
    type: "vehicle",
    title: "Toyota RAV4",
    description: "A car.",
    price: 21500,
    currency: "USD",
    images: [],
    seller,
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
  };
}

function makeSparePart(stock: number): SparePart {
  return {
    id: "part-1",
    slug: "brake-pads",
    type: "spare_part",
    title: "Front Brake Pads",
    description: "OEM-equivalent.",
    price: 45,
    currency: "USD",
    images: [],
    seller,
    availability: "available",
    featured: false,
    createdAt: new Date().toISOString(),
    partName: "Front Brake Pads",
    partNumber: "BP-1",
    category: "Brakes",
    brand: "Akebono",
    stock,
    condition: "new",
    compatibleMakes: [],
    compatibleModels: [],
    compatibleYears: [2013, 2020],
  };
}

describe("computeMaxQuantity", () => {
  it("caps vehicles at 1 regardless of anything else", () => {
    expect(computeMaxQuantity(makeVehicle())).toBe(1);
  });

  it("caps spare parts at their stock when below the sane upper bound", () => {
    expect(computeMaxQuantity(makeSparePart(3))).toBe(3);
  });

  it("caps spare parts at 10 even when stock is much higher", () => {
    expect(computeMaxQuantity(makeSparePart(500))).toBe(10);
  });

  it("returns 0 for a spare part with no stock", () => {
    expect(computeMaxQuantity(makeSparePart(0))).toBe(0);
  });

  it("never returns a negative number for negative stock", () => {
    expect(computeMaxQuantity(makeSparePart(-5))).toBe(0);
  });
});
