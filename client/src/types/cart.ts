import type { Currency, Product } from "./product";

export interface CartItem {
  productId: string;
  quantity: number;
  priceSnapshot: number;
  currencySnapshot: Currency;
  isRental: boolean;
  /** ISO date strings, present only when isRental is true. */
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
}

export interface RehydratedCartItem {
  productId: string;
  product: Product | null;
  quantity: number;
  priceSnapshot: number;
  currencySnapshot: Currency;
  priceChanged: boolean;
  unavailable: boolean;
  isRental: boolean;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
}

export interface RehydratedCart {
  id: string;
  items: RehydratedCartItem[];
}

export interface SellerOrderGroup {
  sellerId: string;
  sellerName: string;
  sellerWhatsapp: string;
  items: RehydratedCartItem[];
  hasIssues: boolean;
}
