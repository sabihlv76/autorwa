import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as productRepository from "./productRepository";
import * as sellerRepository from "./sellerRepository";
import type { AdminVehicleInput } from "./productRepository";

beforeAll(startTestDatabase, 180000);
afterAll(stopTestDatabase, 30000);
afterEach(clearCollections);

async function makeSeller(name = "Kigali Motors") {
  return sellerRepository.create({
    name,
    verified: true,
    location: "Kigali",
    whatsapp: "+250788100001",
  });
}

function vehicleInput(overrides: Partial<AdminVehicleInput>, sellerId: string): AdminVehicleInput {
  return {
    type: "vehicle",
    title: "Toyota RAV4 2019",
    description: "A well-maintained RAV4.",
    price: 21500,
    currency: "USD",
    images: [],
    sellerId,
    availability: "available",
    featured: false,
    condition: "used",
    make: "Toyota",
    model: "RAV4",
    year: 2019,
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

const baseFilters = {
  type: "all" as const,
  q: "",
  make: "",
  category: "",
  condition: "all" as const,
  fuel: "all" as const,
  transmission: "all" as const,
  bodyType: "all" as const,
  location: "",
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  maxMileageKm: null,
  seller: "",
  rentalOption: "all" as const,
  postedWithin: "all" as const,
};

describe("productRepository.create / update / remove", () => {
  it("creates a vehicle and generates a unique slug from the title", async () => {
    const seller = await makeSeller();
    const product = await productRepository.create(vehicleInput({}, seller.id));
    expect(product.slug).toBe("toyota-rav4-2019");
    expect(product.type).toBe("vehicle");
  });

  it("appends a numeric suffix when the slug already exists", async () => {
    const seller = await makeSeller();
    const first = await productRepository.create(vehicleInput({}, seller.id));
    const second = await productRepository.create(vehicleInput({}, seller.id));
    expect(first.slug).toBe("toyota-rav4-2019");
    expect(second.slug).toBe("toyota-rav4-2019-2");
  });

  it("update changes fields and returns the updated product", async () => {
    const seller = await makeSeller();
    const created = await productRepository.create(vehicleInput({}, seller.id));
    const updated = await productRepository.update(
      created.id,
      vehicleInput({ title: "Toyota RAV4 2019 (Updated)", price: 22000 }, seller.id),
    );
    expect(updated?.title).toBe("Toyota RAV4 2019 (Updated)");
    expect(updated?.price).toBe(22000);
  });

  it("remove deletes the product", async () => {
    const seller = await makeSeller();
    const created = await productRepository.create(vehicleInput({}, seller.id));
    await productRepository.remove(created.id);
    const found = await productRepository.findByIds([created.id]);
    expect(found).toHaveLength(0);
  });
});

describe("productRepository.findMany filters", () => {
  it("filters by type", async () => {
    const seller = await makeSeller();
    await productRepository.create(vehicleInput({}, seller.id));
    const result = await productRepository.findMany({
      filters: { ...baseFilters, type: "vehicle" },
      sort: "newest",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(1);
  });

  it("filters by rentalOption=rent, matching rent and both listings", async () => {
    const seller = await makeSeller();
    await productRepository.create(vehicleInput({ listingType: "sale" }, seller.id));
    await productRepository.create(
      vehicleInput({ listingType: "rent", title: "Rentable Corolla" }, seller.id),
    );
    await productRepository.create(
      vehicleInput({
        listingType: "both",
        title: "Sale and Rent Prado",
        dailyRentalRate: 65,
      }, seller.id),
    );

    const result = await productRepository.findMany({
      filters: { ...baseFilters, rentalOption: "rent" },
      sort: "newest",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(2);
  });

  it("filters by rentalOption=sale, matching sale and both listings", async () => {
    const seller = await makeSeller();
    await productRepository.create(vehicleInput({ listingType: "sale" }, seller.id));
    await productRepository.create(
      vehicleInput({ listingType: "rent", title: "Rentable Corolla" }, seller.id),
    );
    await productRepository.create(
      vehicleInput({
        listingType: "both",
        title: "Sale and Rent Prado",
        dailyRentalRate: 65,
      }, seller.id),
    );

    const result = await productRepository.findMany({
      filters: { ...baseFilters, rentalOption: "sale" },
      sort: "newest",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(2);
  });

  it("filters by price range", async () => {
    const seller = await makeSeller();
    await productRepository.create(vehicleInput({ price: 5000, title: "Cheap car" }, seller.id));
    await productRepository.create(
      vehicleInput({ price: 50000, title: "Expensive car" }, seller.id),
    );
    const result = await productRepository.findMany({
      filters: { ...baseFilters, minPrice: 10000, maxPrice: 100000 },
      sort: "newest",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(1);
    expect(result.items[0].title).toBe("Expensive car");
  });

  it("sorts by price ascending/descending", async () => {
    const seller = await makeSeller();
    await productRepository.create(vehicleInput({ price: 30000, title: "Mid" }, seller.id));
    await productRepository.create(vehicleInput({ price: 10000, title: "Low" }, seller.id));
    await productRepository.create(vehicleInput({ price: 50000, title: "High" }, seller.id));

    const asc = await productRepository.findMany({
      filters: baseFilters,
      sort: "price_asc",
      page: 1,
      pageSize: 10,
    });
    expect(asc.items.map((p) => p.title)).toEqual(["Low", "Mid", "High"]);

    const desc = await productRepository.findMany({
      filters: baseFilters,
      sort: "price_desc",
      page: 1,
      pageSize: 10,
    });
    expect(desc.items.map((p) => p.title)).toEqual(["High", "Mid", "Low"]);
  });

  it("paginates results", async () => {
    const seller = await makeSeller();
    for (let i = 0; i < 5; i++) {
      await productRepository.create(vehicleInput({ title: `Car ${i}` }, seller.id));
    }
    const page1 = await productRepository.findMany({
      filters: baseFilters,
      sort: "newest",
      page: 1,
      pageSize: 2,
    });
    expect(page1.items).toHaveLength(2);
    expect(page1.totalPages).toBe(3);
  });
});

describe("productRepository.findBySlug / findRelated", () => {
  it("findBySlug returns null for a non-existent slug", async () => {
    expect(await productRepository.findBySlug("does-not-exist")).toBeNull();
  });

  it("findRelated prioritizes same make/brand, backfills with same-type otherwise", async () => {
    const seller = await makeSeller();
    const target = await productRepository.create(
      vehicleInput({ title: "Toyota RAV4", make: "Toyota" }, seller.id),
    );
    await productRepository.create(
      vehicleInput({ title: "Toyota Corolla", make: "Toyota" }, seller.id),
    );
    await productRepository.create(
      vehicleInput({ title: "Honda Fit", make: "Honda" }, seller.id),
    );

    const related = await productRepository.findRelated(target, 5);
    expect(related.some((p) => p.id === target.id)).toBe(false);
    expect(related[0].title).toBe("Toyota Corolla");
    expect(related.some((p) => p.title === "Honda Fit")).toBe(true);
  });
});
