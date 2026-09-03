"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as whatsappOrderRepository from "@/repositories/whatsappOrderRepository";
import type { WhatsAppOrderStatus } from "@/repositories/whatsappOrderRepository";

export async function updateWhatsAppOrderStatusAction(
  orderId: string,
  status: WhatsAppOrderStatus,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  await whatsappOrderRepository.appendStatus(orderId, status);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "whatsappOrder.statusUpdate",
    targetType: "whatsappOrder",
    targetId: orderId,
    metadata: { status },
  });

  return { success: true };
}
