"use server";

import { computeMaxQuantity } from "@/features/cart/lib/quantity";
import { getOrCreateCartOwnerKey } from "@/lib/cart/cartCookie";
import { quantitySchema } from "@/lib/validation/cart";
import * as cartRepository from "@/repositories/cartRepository";
import * as productRepository from "@/repositories/productRepository";

export async function updateQuantityAction(
  productId: string,
  rawQuantity: number,
): Promise<{ success: boolean; error?: string }> {
  const parsed = quantitySchema.safeParse(rawQuantity);
  if (!parsed.success) {
    return { success: false, error: "Invalid quantity." };
  }

  const owner = await getOrCreateCartOwnerKey();

  if (parsed.data === 0) {
    await cartRepository.removeItem(owner, productId);
    return { success: true };
  }

  const product = await productRepository.findByIds([productId]).then((r) => r[0] ?? null);
  if (!product) {
    await cartRepository.removeItem(owner, productId);
    return { success: false, error: "This product is no longer available." };
  }

  const maxQuantity = computeMaxQuantity(product);
  await cartRepository.updateItemQuantity(owner, productId, parsed.data, maxQuantity);

  return { success: true };
}
