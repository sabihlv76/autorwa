"use client";

import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/features/auth/actions/actionState";
import { adminSignInAction } from "@/features/auth/actions/adminSignin";

// Admin UI is deliberately English-only (internal tooling, not the public
// storefront) — no useLocale()/dictionary here, matching /ops-console.
// No Google button: Google sign-in always creates role "customer" accounts
// (see createFromGoogle in userRepository), so it can never satisfy the
// admin check below.
export function AdminSignInForm() {
  const [state, formAction] = useActionState(adminSignInAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-lg font-semibold text-black">Admin sign in</h1>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state.fieldErrors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
