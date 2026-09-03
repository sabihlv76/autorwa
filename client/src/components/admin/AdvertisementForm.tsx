"use client";

import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { AdvertisementFormState } from "@/features/admin/actions/createAdvertisement";
import type { Advertisement } from "@/types/product";

type FormAction = (
  state: AdvertisementFormState,
  formData: FormData,
) => Promise<AdvertisementFormState>;

const initialState: AdvertisementFormState = { success: false };
const inputClass = "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm";
const labelClass = "block text-sm font-medium text-black";

export function AdvertisementForm({
  action,
  ad,
}: {
  action: FormAction;
  ad?: Advertisement;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {ad && <input type="hidden" name="adId" value={ad.id} />}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="space-y-1">
        <label className={labelClass}>Position</label>
        <select name="position" defaultValue={ad?.position ?? "top_left"} className={inputClass}>
          <option value="top_left">Top left</option>
          <option value="top_right">Top right</option>
        </select>
      </div>

      <FormField
        label="Title"
        name="title"
        defaultValue={ad?.title}
        required
        errors={errors.title}
      />
      <FormField
        label="Advertiser"
        name="advertiser"
        defaultValue={ad?.advertiser}
        required
        errors={errors.advertiser}
      />
      <FormField
        label="Target URL"
        name="targetUrl"
        defaultValue={ad?.targetUrl}
        required
        errors={errors.targetUrl}
      />
      <FormField
        label="Image URL (optional)"
        name="imageUrl"
        defaultValue={ad?.imageUrl}
        errors={errors.imageUrl}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start date (optional)"
          name="startDate"
          type="date"
          defaultValue={ad?.startDate?.slice(0, 10)}
        />
        <FormField
          label="End date (optional)"
          name="endDate"
          type="date"
          defaultValue={ad?.endDate?.slice(0, 10)}
        />
      </div>

      <FormField
        label="Priority (higher shows first when multiple are active)"
        name="priority"
        type="number"
        defaultValue={ad?.priority ?? 0}
      />

      <label className="flex items-center gap-2 text-sm text-black">
        <input type="checkbox" name="active" defaultChecked={ad?.active ?? true} />
        Active
      </label>

      <SubmitButton>{ad ? "Save changes" : "Create advertisement"}</SubmitButton>
    </form>
  );
}
