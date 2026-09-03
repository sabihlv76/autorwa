import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as whatsappOrderRepository from "./whatsappOrderRepository";
import { WhatsAppOrderModel } from "@/models/WhatsAppOrder";

beforeAll(startTestDatabase, 180000);
afterAll(stopTestDatabase, 30000);
afterEach(clearCollections);

const SELLER_ID = "507f1f77bcf86cd799439011";
const PRODUCT_ID = "507f1f77bcf86cd799439012";

function orderInput(overrides: Partial<Parameters<typeof whatsappOrderRepository.create>[0]> = {}) {
  return {
    sellerId: SELLER_ID,
    seller: { id: SELLER_ID, name: "Kigali Motors", whatsapp: "+250788100001" },
    customerName: "Jane Doe",
    customerPhone: "+250788999999",
    items: [
      {
        productId: PRODUCT_ID,
        title: "Brake Pads",
        quantity: 2,
        priceSnapshot: 40,
        currencySnapshot: "USD" as const,
      },
    ],
    totalAmount: 80,
    currency: "USD" as const,
    ...overrides,
  };
}

describe("whatsappOrderRepository.create", () => {
  it("generates a PREFIX-YYYYMMDD-XXXXXX order reference", async () => {
    const order = await whatsappOrderRepository.create(orderInput());
    expect(order.orderReference).toMatch(/^AR-\d{8}-[A-Z0-9]{6}$/);
  });

  it("generates unique references across multiple orders", async () => {
    const first = await whatsappOrderRepository.create(orderInput());
    const second = await whatsappOrderRepository.create(orderInput());
    expect(first.orderReference).not.toBe(second.orderReference);
  });

  it("seeds statusHistory with the initial 'created' status", async () => {
    const order = await whatsappOrderRepository.create(orderInput());
    const doc = await WhatsAppOrderModel.findById(order.id).lean<{
      statusHistory: { status: string }[];
    }>();
    expect(doc?.statusHistory).toHaveLength(1);
    expect(doc?.statusHistory[0].status).toBe("created");
  });
});

describe("whatsappOrderRepository.appendStatus", () => {
  it("updates status and grows statusHistory", async () => {
    const order = await whatsappOrderRepository.create(orderInput());
    await whatsappOrderRepository.appendStatus(order.id, "whatsapp_opened");

    const doc = await WhatsAppOrderModel.findById(order.id).lean<{
      status: string;
      statusHistory: { status: string }[];
    }>();
    expect(doc?.status).toBe("whatsapp_opened");
    expect(doc?.statusHistory).toHaveLength(2);
    expect(doc?.statusHistory[1].status).toBe("whatsapp_opened");
  });
});

describe("whatsappOrderRepository.findMany", () => {
  it("filters by status", async () => {
    const created = await whatsappOrderRepository.create(orderInput());
    await whatsappOrderRepository.create(orderInput());
    await whatsappOrderRepository.appendStatus(created.id, "completed");

    const result = await whatsappOrderRepository.findMany({
      status: "completed",
      page: 1,
      pageSize: 10,
    });
    expect(result.totalItems).toBe(1);
    expect(result.items[0].id).toBe(created.id);
  });

  it("returns all orders when no status filter is given, newest first", async () => {
    await whatsappOrderRepository.create(orderInput({ customerName: "First" }));
    await whatsappOrderRepository.create(orderInput({ customerName: "Second" }));

    const result = await whatsappOrderRepository.findMany({ page: 1, pageSize: 10 });
    expect(result.totalItems).toBe(2);
    expect(result.items[0].customerName).toBe("Second");
  });

  it("paginates results", async () => {
    for (let i = 0; i < 3; i++) {
      await whatsappOrderRepository.create(orderInput({ customerName: `Customer ${i}` }));
    }
    const page1 = await whatsappOrderRepository.findMany({ page: 1, pageSize: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.totalPages).toBe(2);
  });
});
