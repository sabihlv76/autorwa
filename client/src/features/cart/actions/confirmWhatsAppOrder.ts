"use server";

import { auth } from "@/lib/auth/auth";
import { getOrCreateCartOwnerKey } from "@/lib/cart/cartCookie";
import { convert } from "@/lib/currency";
import { confirmOrderSchema } from "@/lib/validation/cart";
import { buildOrderMessage, buildWhatsAppUrl } from "@/features/cart/lib/orderMessage";
import * as cartRepository from "@/repositories/cartRepository";
import * as whatsappOrderRepository from "@/repositories/whatsappOrderRepository";

export interface ConfirmOrderResult {
  success: boolean;
  error?: string;
  whatsappUrl?: string;
  orderReference?: string;
}

export async function confirmWhatsAppOrderAction(
  _prevState: ConfirmOrderResult,
  formData: FormData,
): Promise<ConfirmOrderResult> {
  const parsed = confirmOrderSchema.safeParse({
    sellerId: formData.get("sellerId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: "Please check the form and try again." };
  }

  const { sellerId, name, phone, notes } = parsed.data;

  const owner = await getOrCreateCartOwnerKey();
  const cart = await cartRepository.getRehydratedCart(owner);

  const groupItems = cart.items.filter((item) => item.product?.seller.id === sellerId);

  if (groupItems.length === 0) {
    return { success: false, error: "No items found for this seller in your cart." };
  }

  const hasIssues = groupItems.some((item) => item.unavailable || item.priceChanged);
  if (hasIssues) {
    return {
      success: false,
      error:
        "Some items changed since you added them (price or availability). Please review your cart and try again.",
    };
  }

  const targetCurrency = groupItems[0].currencySnapshot;
  const totalAmount = groupItems.reduce(
    (sum, item) =>
      sum + convert(item.priceSnapshot, item.currencySnapshot, targetCurrency) * item.quantity,
    0,
  );

  const seller = groupItems[0].product!.seller;
  const session = await auth();

  const { id: orderId, orderReference } = await whatsappOrderRepository.create({
    userId: session?.user?.id,
    sellerId,
    seller: { id: seller.id, name: seller.name, whatsapp: seller.whatsapp },
    customerName: name,
    customerPhone: phone,
    customerNotes: notes || undefined,
    items: groupItems.map((item) => ({
      productId: item.productId,
      title: item.product!.title,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      currencySnapshot: item.currencySnapshot,
      isRental: item.isRental,
      rentalStartDate: item.rentalStartDate,
      rentalEndDate: item.rentalEndDate,
      rentalDays: item.rentalDays,
    })),
    totalAmount,
    currency: targetCurrency,
  });

  await cartRepository.removeItems(
    owner,
    groupItems.map((item) => item.productId),
  );

  const message = buildOrderMessage({
    orderReference,
    customerName: name,
    customerPhone: phone,
    items: groupItems.map((item) => ({
      title: item.product!.title,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      isRental: item.isRental,
      rentalStartDate: item.rentalStartDate,
      rentalEndDate: item.rentalEndDate,
      rentalDays: item.rentalDays,
    })),
    totalAmount,
    currency: targetCurrency,
    notes: notes || undefined,
  });

  const whatsappDigits = seller.whatsapp.replace(/\D/g, "");
  const whatsappUrl = buildWhatsAppUrl(whatsappDigits, message);

  await whatsappOrderRepository.appendStatus(orderId, "whatsapp_opened");

  return { success: true, whatsappUrl, orderReference };
}
