"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { forgotPasswordAction } from "@/features/auth/actions/forgotPassword";
import { initialActionState } from "@/features/auth/actions/actionState";

export function ForgotPasswordForm() {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(forgotPasswordAction, initialActionState);

  if (state.success) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-lg font-semibold text-black">
          {dictionary.auth.resetPasswordTitle}
        </h1>
        <p className="text-sm text-zinc-600">{dictionary.auth.resetLinkSent}</p>
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

      <FormField
        label={dictionary.auth.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />

      <SubmitButton>{dictionary.auth.sendResetLink}</SubmitButton>

      <p className="text-center text-sm text-zinc-600">
        <Link href="/signin" className="text-accent hover:underline">
          {dictionary.auth.backToSignIn}
        </Link>
      </p>
    </form>
  );
}
