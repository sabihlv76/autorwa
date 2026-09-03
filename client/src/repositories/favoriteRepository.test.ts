import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as favoriteRepository from "./favoriteRepository";
import * as productRepository from "./productRepository";
import * as sellerRepository from "./sellerRepository";
import type { AdminSparePartInput } from "./productRepository";

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

describe("favoriteRepository", () => {
  it("add then isFavorited reports true, remove reports false", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));

    expect(await favoriteRepository.isFavorited("507f1f77bcf86cd799439031", part.id)).toBe(false);

    await favoriteRepository.add("507f1f77bcf86cd799439031", part.id);
    expect(await favoriteRepository.isFavorited("507f1f77bcf86cd799439031", part.id)).toBe(true);

    await favoriteRepository.remove("507f1f77bcf86cd799439031", part.id);
    expect(await favoriteRepository.isFavorited("507f1f77bcf86cd799439031", part.id)).toBe(false);
  });

  it("adding the same user/product pair twice does not create a duplicate", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));

    await favoriteRepository.add("507f1f77bcf86cd799439032", part.id);
    await favoriteRepository.add("507f1f77bcf86cd799439032", part.id);

    const ids = await favoriteRepository.listProductIdsForUser("507f1f77bcf86cd799439032");
    expect(ids.size).toBe(1);
  });

  it("listProductIdsForUser filters by the given productIds when provided", async () => {
    const seller = await makeSeller();
    const partA = await productRepository.create(sparePartInput({ title: "Part A" }, seller.id));
    const partB = await productRepository.create(sparePartInput({ title: "Part B" }, seller.id));

    await favoriteRepository.add("507f1f77bcf86cd799439033", partA.id);
    await favoriteRepository.add("507f1f77bcf86cd799439033", partB.id);

    const ids = await favoriteRepository.listProductIdsForUser("507f1f77bcf86cd799439033", [partA.id]);
    expect(ids.size).toBe(1);
    expect(ids.has(partA.id)).toBe(true);
  });

  it("favorites are scoped per user", async () => {
    const seller = await makeSeller();
    const part = await productRepository.create(sparePartInput({}, seller.id));

    await favoriteRepository.add("507f1f77bcf86cd799439034", part.id);
    expect(await favoriteRepository.isFavorited("507f1f77bcf86cd799439035", part.id)).toBe(false);
  });
});
