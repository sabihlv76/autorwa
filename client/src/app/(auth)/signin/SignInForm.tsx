"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signInAction } from "@/features/auth/actions/signin";
import { initialActionState } from "@/features/auth/actions/actionState";

export function SignInForm() {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(signInAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-lg font-semibold text-black">{dictionary.auth.signIn}</h1>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <FormField
        label={dictionary.auth.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />
      <FormField
        label={dictionary.auth.password}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />

      <div className="text-right text-sm">
        <Link href="/forgot-password" className="text-accent hover:underline">
          {dictionary.auth.forgotPassword}
        </Link>
      </div>

      <SubmitButton>{dictionary.auth.signInCta}</SubmitButton>

      <p className="text-center text-sm text-zinc-600">
        {dictionary.auth.noAccount}{" "}
        <Link href="/signup" className="text-accent hover:underline">
          {dictionary.auth.signUp}
        </Link>
      </p>
    </form>
  );
}
