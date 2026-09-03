"use server";

import { auth } from "@/lib/auth/auth";
import { checkRateLimit } from "@/lib/rateLimiter";
import { callBookingSchema } from "@/lib/validation/callBooking";
import * as callBookingRepository from "@/repositories/callBookingRepository";
import * as productRepository from "@/repositories/productRepository";

export interface CreateCallBookingResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  bookingReference?: string;
}

export async function createCallBookingAction(
  _prevState: CreateCallBookingResult,
  formData: FormData,
): Promise<CreateCallBookingResult> {
  const parsed = callBookingSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    time: formData.get("time"),
    reason: formData.get("reason"),
    productId: formData.get("productId") ?? "",
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, phone, date, time, reason, productId } = parsed.data;

  const rateLimit = checkRateLimit(`call-booking:${phone}`, {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Too many booking requests. Please try again later." };
  }

  let product: { id: string; title: string; slug: string } | undefined;
  let seller: { id: string; name: string; whatsapp: string } | undefined;

  if (productId) {
    const found = await productRepository
      .findByIds([productId])
      .then((r) => r[0] ?? null);
    if (found) {
      product = { id: found.id, title: found.title, slug: found.slug };
      seller = {
        id: found.seller.id,
        name: found.seller.name,
        whatsapp: found.seller.whatsapp,
      };
    }
  }

  const session = await auth();

  const { bookingReference } = await callBookingRepository.create({
    userId: session?.user?.id,
    customerName: name,
    phone,
    preferredDate: new Date(date),
    preferredTime: time,
    reason,
    product,
    seller,
  });

  return { success: true, bookingReference };
}
