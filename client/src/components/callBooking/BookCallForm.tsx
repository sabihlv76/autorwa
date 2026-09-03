"use client";

import { useActionState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  createCallBookingAction,
  type CreateCallBookingResult,
} from "@/features/callBooking/actions/createCallBooking";

const initialState: CreateCallBookingResult = { success: false };

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BookCallForm({
  productId,
  productTitle,
  defaultName,
}: {
  productId?: string;
  productTitle?: string;
  defaultName?: string;
}) {
  const { dictionary } = useLocale();
  const [state, formAction] = useActionState(createCallBookingAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-md border border-accent bg-orange-50 p-4 text-center">
        <p className="font-semibold text-black">{dictionary.callBooking.confirmationTitle}</p>
        <p className="mt-1 text-sm text-zinc-600">{dictionary.callBooking.confirmationMessage}</p>
        <p className="mt-2 text-sm text-zinc-600">
          {dictionary.callBooking.bookingReference}:{" "}
          <span className="font-mono">{state.bookingReference}</span>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-lg font-semibold text-black">{dictionary.callBooking.title}</h1>

      {productTitle && (
        <p className="text-sm text-zinc-600">
          {dictionary.callBooking.regardingProduct.replace("{product}", productTitle)}
        </p>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      {productId && <input type="hidden" name="productId" value={productId} />}

      <FormField
        label={dictionary.cart.fullName}
        name="name"
        type="text"
        defaultValue={defaultName}
        required
        errors={state.fieldErrors?.name}
      />
      <FormField
        label={dictionary.cart.phone}
        name="phone"
        type="tel"
        required
        errors={state.fieldErrors?.phone}
      />
      <FormField
        label={dictionary.callBooking.date}
        name="date"
        type="date"
        min={todayISODate()}
        required
        errors={state.fieldErrors?.date}
      />
      <FormField
        label={dictionary.callBooking.time}
        name="time"
        type="time"
        required
        errors={state.fieldErrors?.time}
      />

      <div className="space-y-1">
        <label htmlFor="reason" className="block text-sm font-medium text-black">
          {dictionary.callBooking.reason}
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        {state.fieldErrors?.reason?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>

      <SubmitButton>{dictionary.callBooking.submit}</SubmitButton>
    </form>
  );
}
