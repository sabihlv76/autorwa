import { describe, expect, it } from "vitest";
import { sparePartFormSchema, vehicleFormSchema } from "./product";

const validVehicle = {
  type: "vehicle",
  title: "Toyota RAV4 2019",
  description: "Well-maintained RAV4, single owner, full service history.",
  price: "21500",
  currency: "USD",
  images: "",
  sellerId: "seller-1",
  availability: "available",
  featured: "",
  condition: "used",
  make: "Toyota",
  model: "RAV4",
  generation: "",
  trim: "",
  year: "2019",
  mileageKm: "62000",
  fuel: "petrol",
  transmission: "automatic",
  driveType: "awd",
  engineCapacityL: "2.5",
  bodyType: "suv",
  color: "White",
  location: "Kigali",
  features: "Reverse camera, Bluetooth",
  negotiable: "on",
  listingType: "sale",
  dailyRentalRate: "",
  minRentalDays: "1",
  maxRentalDays: "",
};

describe("vehicleFormSchema", () => {
  it("accepts a valid sale-only vehicle", () => {
    const result = vehicleFormSchema.safeParse(validVehicle);
    expect(result.success).toBe(true);
  });

  it("splits comma-separated features into an array", () => {
    const result = vehicleFormSchema.safeParse(validVehicle);
    expect(result.success && result.data.features).toEqual(["Reverse camera", "Bluetooth"]);
  });

  it("treats an empty images field as an empty array", () => {
    const result = vehicleFormSchema.safeParse(validVehicle);
    expect(result.success && result.data.images).toEqual([]);
  });

  it("requires a dailyRentalRate when listingType is 'both'", () => {
    const withoutRate = vehicleFormSchema.safeParse({
      ...validVehicle,
      listingType: "both",
      dailyRentalRate: "",
    });
    expect(withoutRate.success).toBe(false);

    const withRate = vehicleFormSchema.safeParse({
      ...validVehicle,
      listingType: "both",
      dailyRentalRate: "65",
    });
    expect(withRate.success).toBe(true);
  });

  it("does not require a dailyRentalRate for rent-only (price doubles as the daily rate)", () => {
    const result = vehicleFormSchema.safeParse({
      ...validVehicle,
      listingType: "rent",
      dailyRentalRate: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a year before 1950", () => {
    expect(vehicleFormSchema.safeParse({ ...validVehicle, year: "1900" }).success).toBe(false);
  });

  it("rejects an unknown seller (empty sellerId)", () => {
    expect(vehicleFormSchema.safeParse({ ...validVehicle, sellerId: "" }).success).toBe(false);
  });
});

const validSparePart = {
  type: "spare_part",
  title: "Front Brake Pads - Toyota RAV4",
  description: "OEM-equivalent ceramic brake pads, full set for front axle.",
  price: "45",
  currency: "USD",
  images: "",
  sellerId: "seller-1",
  availability: "available",
  featured: "",
  condition: "new",
  partName: "Front Brake Pads",
  partNumber: "BP-RAV4-F1320",
  category: "Brakes",
  brand: "Akebono",
  stock: "24",
  compatibleMakes: "Toyota",
  compatibleModels: "RAV4",
  compatibleYearFrom: "2013",
  compatibleYearTo: "2020",
  compatibilityNotes: "",
  warrantyMonths: "12",
};

describe("sparePartFormSchema", () => {
  it("accepts a valid spare part", () => {
    expect(sparePartFormSchema.safeParse(validSparePart).success).toBe(true);
  });

  it("splits compatibleMakes/compatibleModels into arrays", () => {
    const result = sparePartFormSchema.safeParse({
      ...validSparePart,
      compatibleMakes: "Toyota, Nissan",
    });
    expect(result.success && result.data.compatibleMakes).toEqual(["Toyota", "Nissan"]);
  });

  it("treats blank optional numeric fields as undefined rather than NaN", () => {
    const result = sparePartFormSchema.safeParse({
      ...validSparePart,
      compatibleYearFrom: "",
      compatibleYearTo: "",
      warrantyMonths: "",
    });
    expect(result.success).toBe(true);
    expect(result.success && result.data.compatibleYearFrom).toBeUndefined();
    expect(result.success && result.data.warrantyMonths).toBeUndefined();
  });

  it("rejects a negative stock", () => {
    expect(sparePartFormSchema.safeParse({ ...validSparePart, stock: "-1" }).success).toBe(false);
  });
});
