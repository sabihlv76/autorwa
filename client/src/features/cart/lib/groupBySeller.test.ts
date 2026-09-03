import { describe, expect, it } from "vitest";
import { groupBySeller } from "./groupBySeller";
import type { RehydratedCartItem } from "@/types/cart";
import type { Product, Seller } from "@/types/product";

function makeSeller(id: string, name: string): Seller {
  return { id, name, verified: true, location: "Kigali", whatsapp: "+250788100001" };
}

function makeProduct(seller: Seller): Product {
  return {
    id: `prod-${seller.id}`,
    slug: `product-${seller.id}`,
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
    stock: 10,
    condition: "new",
    compatibleMakes: [],
    compatibleModels: [],
    compatibleYears: [2013, 2020],
  };
}

function makeItem(overrides: Partial<RehydratedCartItem> & { seller: Seller }): RehydratedCartItem {
  const { seller, ...rest } = overrides;
  return {
    productId: `prod-${seller.id}`,
    product: makeProduct(seller),
    quantity: 1,
    priceSnapshot: 45,
    currencySnapshot: "USD",
    priceChanged: false,
    unavailable: false,
    isRental: false,
    ...rest,
  };
}

describe("groupBySeller", () => {
  it("groups items by seller id", () => {
    const sellerA = makeSeller("a", "Seller A");
    const sellerB = makeSeller("b", "Seller B");
    const groups = groupBySeller([makeItem({ seller: sellerA }), makeItem({ seller: sellerB })]);

    expect(groups).toHaveLength(2);
    expect(groups.map((g) => g.sellerId).sort()).toEqual(["a", "b"]);
  });

  it("puts multiple items from the same seller in one group", () => {
    const seller = makeSeller("a", "Seller A");
    const groups = groupBySeller([makeItem({ seller }), makeItem({ seller })]);

    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(2);
  });

  it("skips items with no resolved product (e.g. a deleted product)", () => {
    const seller = makeSeller("a", "Seller A");
    const orphan = makeItem({ seller });
    orphan.product = null;
    const groups = groupBySeller([orphan]);
    expect(groups).toHaveLength(0);
  });

  it("flags hasIssues when any item in the group is unavailable", () => {
    const seller = makeSeller("a", "Seller A");
    const groups = groupBySeller([makeItem({ seller, unavailable: true })]);
    expect(groups[0].hasIssues).toBe(true);
  });

  it("flags hasIssues when any item in the group has a changed price", () => {
    const seller = makeSeller("a", "Seller A");
    const groups = groupBySeller([makeItem({ seller, priceChanged: true })]);
    expect(groups[0].hasIssues).toBe(true);
  });

  it("does not flag hasIssues when everything is fine", () => {
    const seller = makeSeller("a", "Seller A");
    const groups = groupBySeller([makeItem({ seller })]);
    expect(groups[0].hasIssues).toBe(false);
  });
});
