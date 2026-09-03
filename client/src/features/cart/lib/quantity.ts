import type { Product } from "@/types/product";

// Vehicles are one-of-a-kind listings (quantity 1 per the spec). Spare parts
// are capped at whatever's in stock, with a sane upper bound so one order
// can't claim an unreasonable amount even if stock is high.
const MAX_SPARE_PART_QUANTITY = 10;

export function computeMaxQuantity(product: Product): number {
  if (product.type === "vehicle") return 1;
  return Math.max(0, Math.min(product.stock, MAX_SPARE_PART_QUANTITY));
}
