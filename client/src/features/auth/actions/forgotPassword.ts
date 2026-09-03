"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimiter";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import * as passwordResetRepository from "@/repositories/passwordResetRepository";
import * as userRepository from "@/repositories/userRepository";
import type { ActionState } from "./actionState";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

// Always returns a generic success message, whether or not the email exists,
// so this endpoint can't be used to enumerate registered accounts.
export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;

  const rateLimit = checkRateLimit(`forgot-password:${email}`, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const user = await userRepository.findByEmail(email);

  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    await passwordResetRepository.create({
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const requestHeaders = await headers();
    const host = requestHeaders.get("host") ?? "localhost:3000";
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    const resetUrl = `${protocol}://${host}/reset-password?token=${rawToken}`;
    // TODO: replace with a real email provider once one is configured.
    console.log(`[DEV email] Password reset link for ${email}: ${resetUrl}`);
  }

  return { success: true };
}
