"use server";

import { getOrCreateCartOwnerKey } from "@/lib/cart/cartCookie";
import * as cartRepository from "@/repositories/cartRepository";

export async function removeItemAction(productId: string): Promise<{ success: boolean }> {
  const owner = await getOrCreateCartOwnerKey();
  await cartRepository.removeItem(owner, productId);
  return { success: true };
}
