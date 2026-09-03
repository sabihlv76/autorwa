import { clearGuestCartCookie, readGuestCartToken } from "@/lib/cart/cartCookie";
import * as cartRepository from "@/repositories/cartRepository";

/** Merges any guest cart into the just-authenticated user's cart. */
export async function claimGuestCartIfPresent(userId: string): Promise<void> {
  const token = await readGuestCartToken();
  if (!token) return;

  await cartRepository.claimGuestCart(userId, token);
  await clearGuestCartCookie();
}
