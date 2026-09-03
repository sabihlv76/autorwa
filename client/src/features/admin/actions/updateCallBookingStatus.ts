"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as callBookingRepository from "@/repositories/callBookingRepository";
import type { CallBookingStatus } from "@/repositories/callBookingRepository";

export async function updateCallBookingStatusAction(
  bookingId: string,
  status: CallBookingStatus,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  await callBookingRepository.updateStatus(bookingId, status);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "callBooking.statusUpdate",
    targetType: "callBooking",
    targetId: bookingId,
    metadata: { status },
  });

  return { success: true };
}
