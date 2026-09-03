import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearCollections, startTestDatabase, stopTestDatabase } from "@/test/mongoTestServer";
import * as advertisementRepository from "./advertisementRepository";

beforeAll(startTestDatabase, 180000);
afterAll(stopTestDatabase, 30000);
afterEach(clearCollections);

function adInput(overrides: Partial<Parameters<typeof advertisementRepository.create>[0]> = {}) {
  return {
    position: "top_left" as const,
    title: "List your business with us",
    imageUrl: "https://example.com/ad.png",
    targetUrl: "https://example.com",
    advertiser: "Autorwa",
    active: true,
    priority: 0,
    ...overrides,
  };
}

describe("advertisementRepository.getForPosition", () => {
  it("returns undefined when nothing is active for that position", async () => {
    expect(await advertisementRepository.getForPosition("top_left")).toBeUndefined();
  });

  it("ignores an inactive ad", async () => {
    await advertisementRepository.create(adInput({ active: false }));
    expect(await advertisementRepository.getForPosition("top_left")).toBeUndefined();
  });

  it("picks the highest-priority ad among several matches for the same position", async () => {
    await advertisementRepository.create(adInput({ title: "Low priority", priority: 1 }));
    await advertisementRepository.create(adInput({ title: "High priority", priority: 10 }));

    const ad = await advertisementRepository.getForPosition("top_left");
    expect(ad?.title).toBe("High priority");
  });

  it("excludes an ad whose start date is in the future", async () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    await advertisementRepository.create(adInput({ startDate: future }));

    expect(await advertisementRepository.getForPosition("top_left")).toBeUndefined();
  });

  it("excludes an ad whose end date is in the past", async () => {
    const past = new Date();
    past.setDate(past.getDate() - 7);
    await advertisementRepository.create(adInput({ endDate: past }));

    expect(await advertisementRepository.getForPosition("top_left")).toBeUndefined();
  });

  it("includes an ad within its date window", async () => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    const end = new Date();
    end.setDate(end.getDate() + 1);
    await advertisementRepository.create(adInput({ startDate: start, endDate: end }));

    const ad = await advertisementRepository.getForPosition("top_left");
    expect(ad).toBeDefined();
  });

  it("does not match a different position", async () => {
    await advertisementRepository.create(adInput({ position: "top_right" }));
    expect(await advertisementRepository.getForPosition("top_left")).toBeUndefined();
  });
});

describe("advertisementRepository CRUD", () => {
  it("update changes fields", async () => {
    const created = await advertisementRepository.create(adInput({}));
    const updated = await advertisementRepository.update(
      created.id,
      adInput({ title: "Updated title", priority: 5 }),
    );
    expect(updated?.title).toBe("Updated title");
    expect(updated?.priority).toBe(5);
  });

  it("remove deletes the ad", async () => {
    const created = await advertisementRepository.create(adInput({}));
    await advertisementRepository.remove(created.id);
    expect(await advertisementRepository.findById(created.id)).toBeNull();
  });

  it("listAll returns every ad regardless of active/date window", async () => {
    await advertisementRepository.create(adInput({ active: false }));
    await advertisementRepository.create(adInput({ title: "Second" }));
    const all = await advertisementRepository.listAll();
    expect(all).toHaveLength(2);
  });
});
