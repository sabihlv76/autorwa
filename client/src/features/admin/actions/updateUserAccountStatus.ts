"use server";

import { requireAdminAction } from "@/lib/auth/requireAdmin";
import * as auditLogRepository from "@/repositories/auditLogRepository";
import * as userRepository from "@/repositories/userRepository";
import type { AccountStatus } from "@/types/user";

export async function updateUserAccountStatusAction(
  userId: string,
  status: AccountStatus,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { success: false, error: "Unauthorized." };

  if (userId === session.user.id && status !== "active") {
    return {
      success: false,
      error: "You can't suspend or close your own admin account.",
    };
  }

  await userRepository.updateAccountStatus(userId, status);

  await auditLogRepository.log({
    adminUserId: session.user.id,
    action: "user.accountStatusUpdate",
    targetType: "user",
    targetId: userId,
    metadata: { status },
  });

  return { success: true };
}
