import { describe, expect, it } from "vitest";
import { buildQueryString, parseFilters, parsePage, parseSort } from "./searchParams";

describe("parseFilters", () => {
  it("defaults everything sensibly for an empty params object", () => {
    const filters = parseFilters({});
    expect(filters).toMatchObject({
      type: "all",
      q: "",
      condition: "all",
      fuel: "all",
      transmission: "all",
      bodyType: "all",
      rentalOption: "all",
      minPrice: null,
      maxPrice: null,
    });
  });

  it("parses recognized enum values", () => {
    const filters = parseFilters({
      type: "vehicle",
      condition: "used",
      fuel: "diesel",
      transmission: "manual",
      bodyType: "suv",
      rentalOption: "rent",
    });
    expect(filters.type).toBe("vehicle");
    expect(filters.condition).toBe("used");
    expect(filters.fuel).toBe("diesel");
    expect(filters.transmission).toBe("manual");
    expect(filters.bodyType).toBe("suv");
    expect(filters.rentalOption).toBe("rent");
  });

  it("falls back to 'all' for an unrecognized enum value", () => {
    const filters = parseFilters({ type: "not-a-real-type", rentalOption: "lease" });
    expect(filters.type).toBe("all");
    expect(filters.rentalOption).toBe("all");
  });

  it("parses numeric range params, ignoring non-numeric input", () => {
    const filters = parseFilters({ minPrice: "1000", maxPrice: "not-a-number" });
    expect(filters.minPrice).toBe(1000);
    expect(filters.maxPrice).toBeNull();
  });

  it("takes the first value when a param appears multiple times", () => {
    const filters = parseFilters({ make: ["Toyota", "Nissan"] });
    expect(filters.make).toBe("Toyota");
  });
});

describe("parseSort", () => {
  it("defaults to recommended", () => {
    expect(parseSort({})).toBe("recommended");
  });

  it("accepts a recognized sort value", () => {
    expect(parseSort({ sort: "price_asc" })).toBe("price_asc");
  });

  it("falls back to recommended for an unrecognized value", () => {
    expect(parseSort({ sort: "random" })).toBe("recommended");
  });
});

describe("parsePage", () => {
  it("defaults to 1", () => {
    expect(parsePage({})).toBe(1);
  });

  it("parses a positive integer", () => {
    expect(parsePage({ page: "3" })).toBe(3);
  });

  it("floors a non-integer", () => {
    expect(parsePage({ page: "3.9" })).toBe(3);
  });

  it("falls back to 1 for zero or negative values", () => {
    expect(parsePage({ page: "0" })).toBe(1);
    expect(parsePage({ page: "-5" })).toBe(1);
  });
});

describe("buildQueryString", () => {
  it("carries over existing params not in updates", () => {
    const qs = buildQueryString({ make: "Toyota" }, { sort: "price_asc" });
    const params = new URLSearchParams(qs);
    expect(params.get("make")).toBe("Toyota");
    expect(params.get("sort")).toBe("price_asc");
  });

  it("removes a key when the update value is null or empty string", () => {
    const qs = buildQueryString({ make: "Toyota" }, { make: null });
    expect(new URLSearchParams(qs).has("make")).toBe(false);
  });

  it("resets page to 1 (removes it) unless explicitly included in updates", () => {
    const qs = buildQueryString({ page: "3", make: "Toyota" }, { sort: "newest" });
    expect(new URLSearchParams(qs).has("page")).toBe(false);
  });

  it("keeps an explicit page override", () => {
    const qs = buildQueryString({ page: "3" }, { page: 2 });
    expect(new URLSearchParams(qs).get("page")).toBe("2");
  });
});
