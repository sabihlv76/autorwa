"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as auditLogRepository from "@/repositories/auditLogRepository";

export async function deleteAdvertisementAction(
  adId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  await advertisementRepository.remove(adId);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "advertisement.delete",
    targetType: "advertisement",
    targetId: adId,
  });

  return { success: true };
}
