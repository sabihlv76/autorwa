"use server";

import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { resetPasswordSchema } from "@/lib/validation/auth";
import * as passwordResetRepository from "@/repositories/passwordResetRepository";
import * as userRepository from "@/repositories/userRepository";
import type { ActionState } from "./actionState";

const PASSWORD_HASH_ROUNDS = 12;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { token, password } = parsed.data;
  const record = await passwordResetRepository.findValidByHash(hashToken(token));

  if (!record) {
    return {
      success: false,
      error: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  await userRepository.updatePasswordHash(record.userId, passwordHash);
  await passwordResetRepository.markUsed(record.id);

  return { success: true };
}
