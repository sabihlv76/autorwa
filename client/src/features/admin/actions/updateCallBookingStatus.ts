"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildCallBookingConfirmationMessage } from "@/features/callBooking/lib/confirmationMessage";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as callBookingRepository from "@/repositories/callBookingRepository";
import type { CallBookingStatus } from "@/repositories/callBookingRepository";

export async function updateCallBookingStatusAction(
  bookingId: string,
  status: CallBookingStatus,
): Promise<{ success: boolean; error?: string; whatsappUrl?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  const booking = await callBookingRepository.updateStatus(bookingId, status);
  if (!booking) return { success: false, error: "Booking not found." };

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "callBooking.statusUpdate",
    targetType: "callBooking",
    targetId: bookingId,
    metadata: { status },
  });

  // Confirming is the one status change the customer needs to hear about
  // right away — hand the admin a pre-filled wa.me link for their one
  // click, same pattern as every other WhatsApp message in this app
  // (there's no WhatsApp Business API integration, so nothing can send
  // this automatically).
  if (status === "confirmed") {
    const message = buildCallBookingConfirmationMessage({
      bookingReference: booking.bookingReference,
      customerName: booking.customerName,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      productTitle: booking.productTitle,
    });
    const whatsappUrl = buildWhatsAppUrl(booking.phone.replace(/\D/g, ""), message);
    return { success: true, whatsappUrl };
  }

  return { success: true };
}
