"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth/auth";
import { checkRateLimit } from "@/lib/rateLimiter";
import { signUpSchema } from "@/lib/validation/auth";
import { claimGuestCartIfPresent } from "@/features/cart/lib/claimGuestCart";
import * as userRepository from "@/repositories/userRepository";
import type { ActionState } from "./actionState";

const PASSWORD_HASH_ROUNDS = 12;

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const rateLimit = checkRateLimit(`signup:${email}`, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return {
      success: false,
      fieldErrors: { email: ["An account with this email already exists."] },
    };
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  const newUser = await userRepository.createCustomer({ name, email, passwordHash });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        success: false,
        error: "Account created, but automatic sign-in failed. Please sign in.",
      };
    }
    throw err;
  }

  await claimGuestCartIfPresent(newUser.id);

  redirect("/");
}
