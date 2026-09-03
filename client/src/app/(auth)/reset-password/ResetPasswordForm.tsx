"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { resetPasswordAction } from "@/features/auth/actions/resetPassword";
import { initialActionState } from "@/features/auth/actions/actionState";

export function ResetPasswordForm({ token }: { token: string }) {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(resetPasswordAction, initialActionState);

  if (state.success) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-lg font-semibold text-black">
          {dictionary.auth.resetPasswordTitle}
        </h1>
        <p className="text-sm text-zinc-600">{dictionary.auth.passwordResetSuccess}</p>
        <Link href="/signin" className="text-sm text-accent hover:underline">
          {dictionary.auth.backToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-lg font-semibold text-black">
        {dictionary.auth.resetPasswordTitle}
      </h1>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <input type="hidden" name="token" value={token} />

      <FormField
        label={dictionary.auth.newPassword}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        errors={state.fieldErrors?.password}
      />
      <FormField
        label={dictionary.auth.confirmPassword}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        errors={state.fieldErrors?.confirmPassword}
      />

      <SubmitButton>{dictionary.auth.setNewPasswordCta}</SubmitButton>
    </form>
  );
}
