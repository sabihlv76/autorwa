import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as cartRepository from "./cartRepository";
import * as productRepository from "./productRepository";
import * as sellerRepository from "./sellerRepository";
import type { AdminSparePartInput, AdminVehicleInput } from "./productRepository";

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

function sparePartInput(
  overrides: Partial<AdminSparePartInput>,
  sellerId: string,
): AdminSparePartInput {
  return {
    type: "spare_part",
    title: "Brake Pads",
    description: "OEM front brake pads.",
    price: 40,
    currency: "USD",
    images: [],
    sellerId,
    availability: "available",
    featured: false,
    condition: "new",
    partName: "Brake Pads",
    partNumber: "BP-100",
    category: "Brakes",
    brand: "Toyota",
    stock: 5,
    compatibleMakes: [],
    compatibleModels: [],
    ...overrides,
  };
}

describe("cartRepository.addItem", () => {
  it("adds a new item, capping quantity at maxQuantity", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));
    const owner = { anonymousToken: "guest-1" };

    await cartRepository.addItem(owner, {
      productId: part.id,
      quantity: 10,
      priceSnapshot: 40,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  it("caps a rental/vehicle item at quantity 1 and stores rental fields", async () => {
    const seller = await makeSeller();
    const vehicle = await productRepository.create(
      vehicleInput({ listingType: "both", dailyRentalRate: 65 }, seller.id),
    );
    const owner = { anonymousToken: "guest-2" };

    await cartRepository.addItem(owner, {
      productId: vehicle.id,
      quantity: 3,
      priceSnapshot: 195,
      currencySnapshot: "USD",
      maxQuantity: 99,
      isRental: true,
      rentalStartDate: new Date("2026-10-01"),
      rentalEndDate: new Date("2026-10-04"),
      rentalDays: 3,
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.items[0].isRental).toBe(true);
    expect(cart.items[0].rentalDays).toBe(3);
  });

  it("re-adding the same item replaces rental dates instead of stacking quantity", async () => {
    const seller = await makeSeller();
    const vehicle = await productRepository.create(
      vehicleInput({ listingType: "both", dailyRentalRate: 65 }, seller.id),
    );
    const owner = { anonymousToken: "guest-3" };
    const args = {
      productId: vehicle.id,
      priceSnapshot: 130,
      currencySnapshot: "USD" as const,
      maxQuantity: 99,
      isRental: true,
      rentalDays: 2,
    };

    await cartRepository.addItem(owner, {
      ...args,
      quantity: 1,
      rentalStartDate: new Date("2026-10-01"),
      rentalEndDate: new Date("2026-10-03"),
    });
    await cartRepository.addItem(owner, {
      ...args,
      quantity: 1,
      rentalStartDate: new Date("2026-11-01"),
      rentalEndDate: new Date("2026-11-03"),
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].rentalStartDate).toContain("2026-11-01");
  });
});

describe("cartRepository.getRehydratedCart", () => {
  it("flags unavailable when the product is sold", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(
      sparePartInput({ availability: "sold" }, seller.id),
    );
    const owner = { anonymousToken: "guest-4" };
    await cartRepository.addItem(owner, {
      productId: part.id,
      quantity: 1,
      priceSnapshot: 40,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items[0].unavailable).toBe(true);
  });

  it("flags priceChanged when the current price no longer matches the snapshot", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({ price: 40 }, seller.id));
    const owner = { anonymousToken: "guest-5" };
    await cartRepository.addItem(owner, {
      productId: part.id,
      quantity: 1,
      priceSnapshot: 30,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items[0].priceChanged).toBe(true);
  });

  it("flags a rental item unavailable once its start date is in the past", async () => {
    const seller = await makeSeller();
    const vehicle = await productRepository.create(
      vehicleInput({ listingType: "both", dailyRentalRate: 65 }, seller.id),
    );
    const owner = { anonymousToken: "guest-6" };
    await cartRepository.addItem(owner, {
      productId: vehicle.id,
      quantity: 1,
      priceSnapshot: 65,
      currencySnapshot: "USD",
      maxQuantity: 99,
      isRental: true,
      rentalStartDate: new Date("2020-01-01"),
      rentalEndDate: new Date("2020-01-02"),
      rentalDays: 1,
    });

    const cart = await cartRepository.getRehydratedCart(owner);
    expect(cart.items[0].unavailable).toBe(true);
  });
});

describe("cartRepository.claimGuestCart", () => {
  it("merges guest cart items into the user's cart and clears the guest cart", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));
    const guest = { anonymousToken: "guest-7" };

    await cartRepository.addItem(guest, {
      productId: part.id,
      quantity: 2,
      priceSnapshot: 40,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });

    const userId = "507f1f77bcf86cd799439021";
    await cartRepository.claimGuestCart(userId, "guest-7");

    const userCart = await cartRepository.getRehydratedCart({ userId });
    expect(userCart.items).toHaveLength(1);
    expect(userCart.items[0].quantity).toBe(2);

    const guestCart = await cartRepository.getRehydratedCart(guest);
    expect(guestCart.items).toHaveLength(0);
  });

  it("adds guest quantity onto an existing matching item in the user's cart", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));
    const guest = { anonymousToken: "guest-8" };
    const userId = "507f1f77bcf86cd799439022";
    const user = { userId };

    await cartRepository.addItem(user, {
      productId: part.id,
      quantity: 1,
      priceSnapshot: 40,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });
    await cartRepository.addItem(guest, {
      productId: part.id,
      quantity: 2,
      priceSnapshot: 40,
      currencySnapshot: "USD",
      maxQuantity: 5,
    });

    await cartRepository.claimGuestCart(userId, "guest-8");

    const userCart = await cartRepository.getRehydratedCart(user);
    expect(userCart.items).toHaveLength(1);
    expect(userCart.items[0].quantity).toBe(3);
  });
});
