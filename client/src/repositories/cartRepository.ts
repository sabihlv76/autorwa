import { connectToDatabase } from "@/lib/db/connect";
import { getDailyRate } from "@/features/products/lib/rental";
import { CartModel } from "@/models/Cart";
import * as productRepository from "@/repositories/productRepository";
import type { CartOwnerKey } from "@/lib/cart/cartCookie";
import type { RehydratedCart } from "@/types/cart";
import type { Currency } from "@/types/product";

interface CartDoc {
  _id: { toString(): string };
  userId?: { toString(): string };
  anonymousToken?: string;
  items: Array<{
    productId: { toString(): string };
    quantity: number;
    priceSnapshot: number;
    currencySnapshot: Currency;
    isRental?: boolean;
    rentalStartDate?: Date;
    rentalEndDate?: Date;
    rentalDays?: number;
  }>;
}

function ownerFilter(owner: CartOwnerKey) {
  return "userId" in owner ? { userId: owner.userId } : { anonymousToken: owner.anonymousToken };
}

export async function findRawCart(owner: CartOwnerKey): Promise<CartDoc | null> {
  await connectToDatabase();
  return CartModel.findOne(ownerFilter(owner)).lean<CartDoc | null>();
}

export async function getItemCount(owner: CartOwnerKey): Promise<number> {
  const cart = await findRawCart(owner);
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

async function getOrCreateCartDoc(owner: CartOwnerKey) {
  await connectToDatabase();
  const filter = ownerFilter(owner);
  let cart = await CartModel.findOne(filter);
  if (!cart) {
    cart = await CartModel.create({ ...filter, items: [] });
  }
  return cart;
}

export async function addItem(
  owner: CartOwnerKey,
  {
    productId,
    quantity,
    priceSnapshot,
    currencySnapshot,
    maxQuantity,
    isRental = false,
    rentalStartDate,
    rentalEndDate,
    rentalDays,
  }: {
    productId: string;
    quantity: number;
    priceSnapshot: number;
    currencySnapshot: Currency;
    maxQuantity: number;
    isRental?: boolean;
    rentalStartDate?: Date;
    rentalEndDate?: Date;
    rentalDays?: number;
  },
): Promise<void> {
  const cart = await getOrCreateCartDoc(owner);
  const existing = cart.items.find(
    (item: (typeof cart.items)[number]) => item.productId.toString() === productId,
  );

  if (existing) {
    // Re-adding a rental replaces the previous dates rather than stacking
    // quantity — renting "2" of the same car for the same slot isn't
    // meaningful in this model.
    existing.quantity = isRental ? 1 : Math.min(existing.quantity + quantity, maxQuantity);
    existing.priceSnapshot = priceSnapshot;
    existing.currencySnapshot = currencySnapshot;
    existing.isRental = isRental;
    existing.rentalStartDate = rentalStartDate;
    existing.rentalEndDate = rentalEndDate;
    existing.rentalDays = rentalDays;
  } else {
    cart.items.push({
      productId,
      quantity: isRental ? 1 : Math.min(quantity, maxQuantity),
      priceSnapshot,
      currencySnapshot,
      isRental,
      rentalStartDate,
      rentalEndDate,
      rentalDays,
      addedAt: new Date(),
    });
  }

  await cart.save();
}

export async function updateItemQuantity(
  owner: CartOwnerKey,
  productId: string,
  quantity: number,
  maxQuantity: number,
): Promise<void> {
  const cart = await getOrCreateCartDoc(owner);

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (item: (typeof cart.items)[number]) => item.productId.toString() !== productId,
    );
  } else {
    const existing = cart.items.find(
      (item: (typeof cart.items)[number]) => item.productId.toString() === productId,
    );
    if (existing) existing.quantity = Math.min(quantity, maxQuantity);
  }

  await cart.save();
}

export async function removeItem(owner: CartOwnerKey, productId: string): Promise<void> {
  const cart = await getOrCreateCartDoc(owner);
  cart.items = cart.items.filter(
    (item: (typeof cart.items)[number]) => item.productId.toString() !== productId,
  );
  await cart.save();
}

export async function removeItems(owner: CartOwnerKey, productIds: string[]): Promise<void> {
  const idSet = new Set(productIds);
  const cart = await getOrCreateCartDoc(owner);
  cart.items = cart.items.filter(
    (item: (typeof cart.items)[number]) => !idSet.has(item.productId.toString()),
  );
  await cart.save();
}

export async function claimGuestCart(
  userId: string,
  anonymousToken: string,
): Promise<void> {
  await connectToDatabase();
  const guestCart = await CartModel.findOne({ anonymousToken });
  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) await guestCart.deleteOne();
    return;
  }

  const userCart = await getOrCreateCartDoc({ userId });

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (item: (typeof userCart.items)[number]) =>
        item.productId.toString() === guestItem.productId.toString(),
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await guestCart.deleteOne();
}

export async function getRehydratedCart(owner: CartOwnerKey): Promise<RehydratedCart> {
  const cart = await findRawCart(owner);
  if (!cart) return { id: "", items: [] };

  const productIds = cart.items.map((item) => item.productId.toString());
  const products = await productRepository.findByIds(productIds);
  const productById = new Map(products.map((p) => [p.id, p]));

  const items = cart.items.map((item) => {
    const productId = item.productId.toString();
    const product = productById.get(productId) ?? null;

    let priceChanged = false;
    let unavailable = !product || product.availability !== "available";

    if (product && item.isRental) {
      if (product.type !== "vehicle") {
        unavailable = true;
      } else {
        const currentDailyRate = getDailyRate(product);
        const expectedTotal = item.rentalDays
          ? currentDailyRate * item.rentalDays
          : item.priceSnapshot;
        priceChanged = expectedTotal !== item.priceSnapshot;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (item.rentalStartDate && new Date(item.rentalStartDate) < today) {
          unavailable = true;
        }
      }
    } else if (product) {
      priceChanged = product.price !== item.priceSnapshot;
    }

    return {
      productId,
      product,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      currencySnapshot: item.currencySnapshot,
      priceChanged,
      unavailable,
      isRental: item.isRental ?? false,
      rentalStartDate: item.rentalStartDate
        ? new Date(item.rentalStartDate).toISOString()
        : undefined,
      rentalEndDate: item.rentalEndDate
        ? new Date(item.rentalEndDate).toISOString()
        : undefined,
      rentalDays: item.rentalDays,
    };
  });

  return { id: cart._id.toString(), items };
}
