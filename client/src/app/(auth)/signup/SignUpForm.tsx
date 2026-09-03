"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signUpAction } from "@/features/auth/actions/signup";
import { initialActionState } from "@/features/auth/actions/actionState";

// No "Continue with Google" here: the signIn callback in
// src/lib/auth/auth.ts only lets Google link to an email that already has
// a password-based account (the User model requires a password, so there's
// no account-creation path for it yet) — it would just fail for anyone
// actually trying to sign up this way. It's on the sign-in form instead.
export function SignUpForm() {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(signUpAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-lg font-semibold text-black">{dictionary.auth.signUp}</h1>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <FormField
        label={dictionary.auth.name}
        name="name"
        type="text"
        autoComplete="name"
        required
        errors={state.fieldErrors?.name}
      />
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

      <SubmitButton>{dictionary.auth.signUpCta}</SubmitButton>

      <p className="text-center text-sm text-zinc-600">
        {dictionary.auth.haveAccount}{" "}
        <Link href="/signin" className="text-accent hover:underline">
          {dictionary.auth.signIn}
        </Link>
      </p>
    </form>
  );
}
