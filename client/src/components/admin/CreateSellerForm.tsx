"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createSellerAction, type CreateSellerState } from "@/features/admin/actions/createSeller";

const initialState: CreateSellerState = { success: false };

export function CreateSellerForm() {
  const [state, formAction] = useActionState(createSellerAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  return (
    <form action={formAction} className="max-w-md space-y-3 rounded-md border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-black">New seller</h2>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <FormField label="Name" name="name" required errors={state.fieldErrors?.name} />
      <FormField label="Location" name="location" required errors={state.fieldErrors?.location} />
      <FormField label="WhatsApp number" name="whatsapp" required errors={state.fieldErrors?.whatsapp} />
      <label className="flex items-center gap-2 text-sm text-black">
        <input type="checkbox" name="verified" />
        Verified
      </label>
      <SubmitButton>Create seller</SubmitButton>
    </form>
  );
}
