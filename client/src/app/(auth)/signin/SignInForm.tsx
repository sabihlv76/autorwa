"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
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

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" aria-hidden="true" />
        <span className="text-xs text-zinc-400">{dictionary.auth.orContinueWith}</span>
        <span className="h-px flex-1 bg-zinc-200" aria-hidden="true" />
      </div>

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
