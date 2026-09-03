"use server";

import { computeMaxQuantity } from "@/features/cart/lib/quantity";
import { getDailyRate, isRentable } from "@/features/products/lib/rental";
import { getOrCreateCartOwnerKey } from "@/lib/cart/cartCookie";
import * as cartRepository from "@/repositories/cartRepository";
import * as productRepository from "@/repositories/productRepository";

export interface AddToCartResult {
  success: boolean;
  error?: string;
}

export interface RentalDatesInput {
  startDate: string;
  endDate: string;
}

export async function addToCartAction(
  productId: string,
  quantity = 1,
  rentalDates?: RentalDatesInput,
): Promise<AddToCartResult> {
  const product = await productRepository.findByIds([productId]).then((r) => r[0] ?? null);

  if (!product) {
    return { success: false, error: "This product is no longer available." };
  }
  if (product.availability !== "available") {
    return { success: false, error: "This product is not currently available." };
  }

  const owner = await getOrCreateCartOwnerKey();

  if (rentalDates) {
    if (product.type !== "vehicle" || !isRentable(product)) {
      return { success: false, error: "This item is not available for rent." };
    }

    const start = new Date(rentalDates.startDate);
    const end = new Date(rentalDates.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return { success: false, error: "Please choose valid rental dates." };
    }
    if (start < today) {
      return { success: false, error: "The rental start date can't be in the past." };
    }

    const days = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (days < product.minRentalDays) {
      return {
        success: false,
        error: `Minimum rental period is ${product.minRentalDays} day(s).`,
      };
    }
    if (product.maxRentalDays && days > product.maxRentalDays) {
      return {
        success: false,
        error: `Maximum rental period is ${product.maxRentalDays} day(s).`,
      };
    }

    const dailyRate = getDailyRate(product);
    await cartRepository.addItem(owner, {
      productId: product.id,
      quantity: 1,
      priceSnapshot: dailyRate * days,
      currencySnapshot: product.currency,
      maxQuantity: 1,
      isRental: true,
      rentalStartDate: start,
      rentalEndDate: end,
      rentalDays: days,
    });

    return { success: true };
  }

  const maxQuantity = computeMaxQuantity(product);
  if (maxQuantity <= 0) {
    return { success: false, error: "This product is out of stock." };
  }

  await cartRepository.addItem(owner, {
    productId: product.id,
    quantity: Math.max(1, Math.min(quantity, maxQuantity)),
    priceSnapshot: product.price,
    currencySnapshot: product.currency,
    maxQuantity,
  });

  return { success: true };
}
