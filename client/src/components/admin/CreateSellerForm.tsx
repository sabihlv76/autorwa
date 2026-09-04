"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createSellerAction, type CreateSellerState } from "@/features/admin/actions/createSeller";

const initialState: CreateSellerState = { success: false };

export function CreateSellerForm({ onCreated }: { onCreated?: () => void }) {
  const [state, formAction] = useActionState(createSellerAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onCreated?.();
    }
  }, [state.success, router, onCreated]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <FormField label="Name" name="name" required errors={state.fieldErrors?.name} />
      <FormField label="Location" name="location" required errors={state.fieldErrors?.location} />
      <FormField label="WhatsApp number" name="whatsapp" required errors={state.fieldErrors?.whatsapp} />
      <label className="flex items-center gap-2 text-sm font-medium text-black">
        <input
          type="checkbox"
          name="verified"
          className="h-4 w-4 rounded border-zinc-300 text-accent focus:ring-accent"
        />
        Verified
      </label>
      <SubmitButton>Create seller</SubmitButton>
    </form>
  );
}
