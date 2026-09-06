import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the URL-encoded message", () => {
    const url = buildWhatsAppUrl("250788100001", "Hello there");
    expect(url).toBe("https://wa.me/250788100001?text=Hello%20there");
  });
});
