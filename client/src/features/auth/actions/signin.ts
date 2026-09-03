"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth/auth";
import { signInSchema } from "@/lib/validation/auth";
import { claimGuestCartIfPresent } from "@/features/cart/lib/claimGuestCart";
import type { ActionState } from "./actionState";

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    throw err;
  }

  const session = await auth();
  if (session?.user?.id) {
    await claimGuestCartIfPresent(session.user.id);
  }

  redirect("/");
}
