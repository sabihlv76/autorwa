import { CartView } from "@/components/cart/CartView";
import { auth } from "@/lib/auth/auth";
import { readCartOwnerKey } from "@/lib/cart/cartCookie";
import { groupBySeller } from "@/features/cart/lib/groupBySeller";
import * as cartRepository from "@/repositories/cartRepository";

export default async function CartPage() {
  const [owner, session] = await Promise.all([readCartOwnerKey(), auth()]);

  const cart = owner
    ? await cartRepository.getRehydratedCart(owner)
    : { id: "", items: [] };

  const groups = groupBySeller(cart.items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <CartView groups={groups} defaultName={session?.user?.name ?? undefined} />
    </div>
  );
}
