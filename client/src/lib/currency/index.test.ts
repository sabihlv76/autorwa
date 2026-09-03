import { describe, expect, it } from "vitest";
import { convert, formatPrice, formatPriceIn, USD_TO_RWF_RATE } from "./index";

describe("convert", () => {
  it("returns the same amount when currencies match", () => {
    expect(convert(100, "USD", "USD")).toBe(100);
  });

  it("converts USD to RWF using the fixed rate", () => {
    expect(convert(10, "USD", "RWF")).toBe(10 * USD_TO_RWF_RATE);
  });

  it("converts RWF to USD using the fixed rate", () => {
    expect(convert(USD_TO_RWF_RATE, "RWF", "USD")).toBe(1);
  });
});

describe("formatPrice", () => {
  it("formats RWF with no decimal places, rounded", () => {
    const result = formatPrice(1234.56, "RWF");
    expect(result).toContain("RWF");
    expect(result).toContain("1,235");
    expect(result).not.toContain(".");
  });

  it("formats USD with two decimal places", () => {
    expect(formatPrice(1234.5, "USD")).toBe("$1,234.50");
  });
});

describe("formatPriceIn", () => {
  it("converts then formats in the display currency", () => {
    expect(formatPriceIn(1, "USD", "RWF")).toBe(formatPrice(USD_TO_RWF_RATE, "RWF"));
  });

  it("passes through unchanged when source and display currency match", () => {
    expect(formatPriceIn(50, "USD", "USD")).toBe(formatPrice(50, "USD"));
  });
});
