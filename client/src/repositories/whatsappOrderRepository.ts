import { connectToDatabase } from "@/lib/db/connect";
import { createWithUniqueReference } from "@/lib/referenceGenerator";
import { WhatsAppOrderModel } from "@/models/WhatsAppOrder";
import type { PaginatedResult } from "@/features/products/lib/paginate";
import type { Currency } from "@/types/product";

interface OrderItemInput {
  productId: string;
  title: string;
  quantity: number;
  priceSnapshot: number;
  currencySnapshot: Currency;
  isRental?: boolean;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
}

export type WhatsAppOrderStatus =
  | "created"
  | "whatsapp_opened"
  | "customer_confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export const WHATSAPP_ORDER_STATUSES: WhatsAppOrderStatus[] = [
  "created",
  "whatsapp_opened",
  "customer_confirmed",
  "processing",
  "completed",
  "cancelled",
];

export interface WhatsAppOrderSummary {
  id: string;
  orderReference: string;
  sellerName: string;
  customerName: string;
  customerPhone: string;
  itemCount: number;
  totalAmount: number;
  currency: Currency;
  status: WhatsAppOrderStatus;
  createdAt: string;
}

interface WhatsAppOrderDoc {
  _id: { toString(): string };
  orderReference: string;
  seller: { name: string };
  customerName: string;
  customerPhone: string;
  items: unknown[];
  totalAmount: number;
  currency: Currency;
  status: WhatsAppOrderStatus;
  createdAt: Date;
}

function toSummary(doc: WhatsAppOrderDoc): WhatsAppOrderSummary {
  return {
    id: doc._id.toString(),
    orderReference: doc.orderReference,
    sellerName: doc.seller.name,
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    itemCount: doc.items.length,
    totalAmount: doc.totalAmount,
    currency: doc.currency,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function create({
  userId,
  sellerId,
  seller,
  customerName,
  customerPhone,
  customerNotes,
  items,
  totalAmount,
  currency,
}: {
  userId?: string;
  sellerId: string;
  seller: { id: string; name: string; whatsapp: string };
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  items: OrderItemInput[];
  totalAmount: number;
  currency: Currency;
}): Promise<{ id: string; orderReference: string }> {
  await connectToDatabase();

  return createWithUniqueReference(
    async (orderReference) => {
      const doc = await WhatsAppOrderModel.create({
        orderReference,
        userId,
        sellerId,
        seller,
        customerName,
        customerPhone,
        customerNotes,
        items,
        totalAmount,
        currency,
        status: "created",
        statusHistory: [{ status: "created", at: new Date() }],
      });
      return { id: doc._id.toString(), orderReference };
    },
    { prefix: "AR" },
  );
}

export async function appendStatus(
  orderId: string,
  status: string,
): Promise<void> {
  await connectToDatabase();
  await WhatsAppOrderModel.updateOne(
    { _id: orderId },
    {
      $set: { status },
      $push: { statusHistory: { status, at: new Date() } },
    },
  );
}

export async function findMany({
  status,
  page,
  pageSize,
}: {
  status?: WhatsAppOrderStatus;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<WhatsAppOrderSummary>> {
  await connectToDatabase();

  const query = status ? { status } : {};
  const totalItems = await WhatsAppOrderModel.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const docs = await WhatsAppOrderModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean<WhatsAppOrderDoc[]>();

  return {
    items: docs.map(toSummary),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
