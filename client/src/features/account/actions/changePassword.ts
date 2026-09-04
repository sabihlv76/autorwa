"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth/auth";
import { checkRateLimit } from "@/lib/rateLimiter";
import { changePasswordSchema } from "@/lib/validation/auth";
import * as userRepository from "@/repositories/userRepository";
import type { ActionState } from "@/features/auth/actions/actionState";

const PASSWORD_HASH_ROUNDS = 12;

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const rateLimit = checkRateLimit(`change-password:${session.user.id}`, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const user = await userRepository.findByEmail(session.user.email ?? "");
  if (!user) {
    return { success: false, error: "Account not found." };
  }

  const { currentPassword, newPassword } = parsed.data;

  if (user.passwordHash) {
    if (!currentPassword) {
      return {
        success: false,
        fieldErrors: { currentPassword: ["Enter your current password."] },
      };
    }
    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return {
        success: false,
        fieldErrors: { currentPassword: ["Current password is incorrect."] },
      };
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, PASSWORD_HASH_ROUNDS);
  await userRepository.updatePasswordHash(session.user.id, passwordHash);

  return { success: true };
}
