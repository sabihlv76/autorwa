"use client";

import { useActionState, useEffect } from "react";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { SelectField } from "@/components/ui/SelectField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { AdvertisementFormState } from "@/features/admin/actions/createAdvertisement";
import type { Advertisement } from "@/types/product";

type FormAction = (
  state: AdvertisementFormState,
  formData: FormData,
) => Promise<AdvertisementFormState>;

const initialState: AdvertisementFormState = { success: false };

export function AdvertisementForm({
  action,
  ad,
  onSuccess,
}: {
  action: FormAction;
  ad?: Advertisement;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      {ad && <input type="hidden" name="adId" value={ad.id} />}

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <FormSection title="Details">
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
      </FormSection>

      <FormSection title="Creative" description="Upload the banner image from your computer.">
        <ImageUploadField
          name="imageUrl"
          label="Banner image"
          defaultValue={ad?.imageUrl}
          errors={errors.imageUrl}
        />
      </FormSection>

      <FormSection title="Placement">
        <SelectField label="Position" name="position" defaultValue={ad?.position ?? "top_left"}>
          <option value="top_left">Top left</option>
          <option value="top_right">Top right</option>
        </SelectField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <label className="flex items-center gap-2 text-sm font-medium text-black">
          <input
            type="checkbox"
            name="active"
            defaultChecked={ad?.active ?? true}
            className="h-4 w-4 rounded border-zinc-300 text-accent focus:ring-accent"
          />
          Active
        </label>
      </FormSection>

      <SubmitButton>{ad ? "Save changes" : "Create advertisement"}</SubmitButton>
    </form>
  );
}
