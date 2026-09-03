import { connectToDatabase } from "@/lib/db/connect";
import { createWithUniqueReference } from "@/lib/referenceGenerator";
import { CallBookingModel } from "@/models/CallBooking";
import type { PaginatedResult } from "@/features/products/lib/paginate";

export type CallBookingStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export const CALL_BOOKING_STATUSES: CallBookingStatus[] = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

export interface CallBookingSummary {
  id: string;
  bookingReference: string;
  customerName: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  productTitle?: string;
  status: CallBookingStatus;
  createdAt: string;
}

interface CallBookingDoc {
  _id: { toString(): string };
  bookingReference: string;
  customerName: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  reason: string;
  product?: { title: string };
  status: CallBookingStatus;
  createdAt: Date;
}

function toSummary(doc: CallBookingDoc): CallBookingSummary {
  return {
    id: doc._id.toString(),
    bookingReference: doc.bookingReference,
    customerName: doc.customerName,
    phone: doc.phone,
    preferredDate: new Date(doc.preferredDate).toISOString().slice(0, 10),
    preferredTime: doc.preferredTime,
    reason: doc.reason,
    productTitle: doc.product?.title,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function create({
  userId,
  customerName,
  phone,
  preferredDate,
  preferredTime,
  reason,
  product,
  seller,
}: {
  userId?: string;
  customerName: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  reason: string;
  product?: { id: string; title: string; slug: string };
  seller?: { id: string; name: string; whatsapp: string };
}): Promise<{ id: string; bookingReference: string }> {
  await connectToDatabase();

  return createWithUniqueReference(
    async (bookingReference) => {
      const doc = await CallBookingModel.create({
        bookingReference,
        userId,
        customerName,
        phone,
        preferredDate,
        preferredTime,
        reason,
        product,
        seller,
        status: "requested",
      });
      return { id: doc._id.toString(), bookingReference };
    },
    { prefix: "CB" },
  );
}

export async function findMany({
  status,
  page,
  pageSize,
}: {
  status?: CallBookingStatus;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<CallBookingSummary>> {
  await connectToDatabase();

  const query = status ? { status } : {};
  const totalItems = await CallBookingModel.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const docs = await CallBookingModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean<CallBookingDoc[]>();

  return {
    items: docs.map(toSummary),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

export async function updateStatus(
  id: string,
  status: CallBookingStatus,
): Promise<void> {
  await connectToDatabase();
  await CallBookingModel.updateOne({ _id: id }, { $set: { status } });
}
