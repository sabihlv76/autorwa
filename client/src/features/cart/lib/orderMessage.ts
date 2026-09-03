import { formatPrice } from "@/lib/currency";
import type { Currency } from "@/types/product";

export function buildOrderMessage({
  orderReference,
  customerName,
  customerPhone,
  items,
  totalAmount,
  currency,
  notes,
}: {
  orderReference: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    title: string;
    quantity: number;
    priceSnapshot: number;
    isRental?: boolean;
    rentalStartDate?: string;
    rentalEndDate?: string;
    rentalDays?: number;
  }>;
  totalAmount: number;
  currency: Currency;
  notes?: string;
}): string {
  const lines = [
    "AUTORWA ORDER REQUEST",
    `Order Reference: ${orderReference}`,
    `Customer Name: ${customerName}`,
    `Customer Phone: ${customerPhone}`,
    "Products:",
    ...items.map((item) => {
      if (item.isRental && item.rentalStartDate && item.rentalEndDate) {
        const start = item.rentalStartDate.slice(0, 10);
        const end = item.rentalEndDate.slice(0, 10);
        return `- ${item.title} (Rental: ${start} to ${end}, ${item.rentalDays} days) - ${formatPrice(item.priceSnapshot, currency)}`;
      }
      return `- ${item.title} x${item.quantity} - ${formatPrice(item.priceSnapshot, currency)}`;
    }),
    `Total Amount: ${formatPrice(totalAmount, currency)}`,
  ];

  if (notes) lines.push(`Customer Notes: ${notes}`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneDigitsOnly: string, message: string): string {
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}
