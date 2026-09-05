"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/lib/auth/auth";
import { requireAdminGate } from "@/lib/auth/requireAdmin";
import { signInSchema } from "@/lib/validation/auth";
import type { ActionState } from "./actionState";

export async function adminSignInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminGate();

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
  if (session?.user?.role !== "admin") {
    await signOut({ redirect: false });
    return { success: false, error: "This account doesn't have admin access." };
  }

  redirect("/ops-console");
}
