"use client";

import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { changePasswordAction } from "@/features/account/actions/changePassword";
import { initialActionState } from "@/features/auth/actions/actionState";

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(changePasswordAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-base font-semibold text-black">
        {hasPassword ? dictionary.account.changePassword : dictionary.account.setPassword}
      </h2>

      {state.success && (
        <p className="text-sm text-green-700">{dictionary.account.passwordUpdated}</p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      {hasPassword && (
        <FormField
          label={dictionary.account.currentPassword}
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          errors={state.fieldErrors?.currentPassword}
        />
      )}
      <FormField
        label={dictionary.auth.newPassword}
        name="newPassword"
        type="password"
        autoComplete="new-password"
        required
        errors={state.fieldErrors?.newPassword}
      />
      <FormField
        label={dictionary.auth.confirmPassword}
        name="confirmNewPassword"
        type="password"
        autoComplete="new-password"
        required
        errors={state.fieldErrors?.confirmNewPassword}
      />

      <SubmitButton>
        {hasPassword ? dictionary.account.changePassword : dictionary.account.setPassword}
      </SubmitButton>
    </form>
  );
}
