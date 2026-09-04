"use client";

import { useActionState, useEffect, useState } from "react";
import { Flag, type FlagCode } from "@/components/ui/Flag";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { IconSelect } from "@/components/ui/IconSelect";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { SelectField } from "@/components/ui/SelectField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { currencies } from "@/lib/currency";
import type { ProductFormState } from "@/features/admin/actions/productForm";
import type { Currency, Product, ProductType, Seller } from "@/types/product";

type FormAction = (
  state: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

const initialState: ProductFormState = { success: false };

const currencyFlags: Record<Currency, FlagCode> = {
  USD: "US",
  RWF: "RW",
};

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-black">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-zinc-300 text-accent focus:ring-accent"
      />
      {label}
    </label>
  );
}

export function ProductForm({
  action,
  sellers,
  product,
  onSuccess,
}: {
  action: FormAction;
  sellers: Seller[];
  product?: Product;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const [type, setType] = useState<ProductType>(product?.type ?? "vehicle");
  const [currency, setCurrency] = useState<Currency>(product?.currency ?? "RWF");
  const [listingType, setListingType] = useState<string>(
    product?.type === "vehicle" ? product.listingType : "sale",
  );
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="productId" value={product.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="currency" value={currency} />

      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SelectField
        label="Product type"
        value={type}
        disabled={!!product}
        onChange={(e) => setType(e.target.value as ProductType)}
      >
        <option value="vehicle">Vehicle</option>
        <option value="spare_part">Spare part</option>
      </SelectField>

      <FormSection title="Basic information">
        <FormField
          label="Title"
          name="title"
          defaultValue={product?.title}
          required
          errors={errors.title}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-black">Description</label>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={4}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          {errors.description?.map((m) => (
            <p key={m} className="text-xs text-red-600">
              {m}
            </p>
          ))}
        </div>
        <SelectField label="Seller" name="sellerId" defaultValue={product?.seller.id} required errors={errors.sellerId}>
          <option value="">Choose a seller</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectField>
      </FormSection>

      <FormSection title="Pricing" description="Set the listing price and preferred currency.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price}
            required
            errors={errors.price}
          />
          <div className="space-y-1">
            <span className="block text-sm font-medium text-black">Preferred currency</span>
            <IconSelect
              value={currency}
              onChange={setCurrency}
              ariaLabel="Preferred currency"
              options={currencies.map((c) => ({
                value: c,
                label: c,
                icon: <Flag code={currencyFlags[c]} />,
              }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Availability"
            name="availability"
            defaultValue={product?.availability ?? "available"}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="out_of_stock">Out of stock</option>
          </SelectField>
          <SelectField label="Condition" name="condition" defaultValue={product?.condition ?? "used"}>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_pre_owned">Certified pre-owned</option>
          </SelectField>
        </div>
        <Checkbox name="featured" label="Featured listing" defaultChecked={product?.featured} />
      </FormSection>

      <FormSection title="Photos" description="Upload images from your computer.">
        <ImageUploadField
          name="images"
          label="Product photos"
          defaultValue={product?.images.join(", ")}
          multiple
          errors={errors.images}
        />
      </FormSection>

      {type === "vehicle" ? (
        <>
          <FormSection title="Vehicle details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Make"
                name="make"
                defaultValue={product?.type === "vehicle" ? product.make : ""}
                required
              />
              <FormField
                label="Model"
                name="model"
                defaultValue={product?.type === "vehicle" ? product.model : ""}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Generation (optional)"
                name="generation"
                defaultValue={product?.type === "vehicle" ? product.generation : ""}
              />
              <FormField
                label="Trim (optional)"
                name="trim"
                defaultValue={product?.type === "vehicle" ? product.trim : ""}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Year"
                name="year"
                type="number"
                defaultValue={product?.type === "vehicle" ? product.year : undefined}
                required
              />
              <FormField
                label="Mileage (km)"
                name="mileageKm"
                type="number"
                defaultValue={product?.type === "vehicle" ? product.mileageKm : undefined}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SelectField
                label="Fuel"
                name="fuel"
                defaultValue={product?.type === "vehicle" ? product.fuel : "petrol"}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </SelectField>
              <SelectField
                label="Transmission"
                name="transmission"
                defaultValue={product?.type === "vehicle" ? product.transmission : "manual"}
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </SelectField>
              <SelectField
                label="Drive type"
                name="driveType"
                defaultValue={product?.type === "vehicle" ? product.driveType : "fwd"}
              >
                <option value="fwd">FWD</option>
                <option value="rwd">RWD</option>
                <option value="awd">AWD</option>
                <option value="4wd">4WD</option>
              </SelectField>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Engine capacity (L)"
                name="engineCapacityL"
                type="number"
                step="0.1"
                defaultValue={product?.type === "vehicle" ? product.engineCapacityL : undefined}
                required
              />
              <SelectField
                label="Body type"
                name="bodyType"
                defaultValue={product?.type === "vehicle" ? product.bodyType : "sedan"}
              >
                {["sedan", "suv", "hatchback", "pickup", "van", "coupe", "wagon", "minibus"].map(
                  (bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ),
                )}
              </SelectField>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Color"
                name="color"
                defaultValue={product?.type === "vehicle" ? product.color : ""}
                required
              />
              <FormField
                label="Location"
                name="location"
                defaultValue={product?.type === "vehicle" ? product.location : ""}
                required
              />
            </div>
            <FormField
              label="Features (comma-separated)"
              name="features"
              defaultValue={product?.type === "vehicle" ? product.features.join(", ") : ""}
            />
            <Checkbox
              name="negotiable"
              label="Price negotiable"
              defaultChecked={product?.type === "vehicle" ? product.negotiable : false}
            />
          </FormSection>

          <FormSection title="Rental options">
            <SelectField
              label="Listing type"
              name="listingType"
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
            >
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
              <option value="both">For sale &amp; rent</option>
            </SelectField>
            {listingType !== "sale" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {listingType === "both" && (
                  <FormField
                    label="Daily rental rate"
                    name="dailyRentalRate"
                    type="number"
                    step="0.01"
                    defaultValue={
                      product?.type === "vehicle" ? product.dailyRentalRate : undefined
                    }
                    errors={errors.dailyRentalRate}
                  />
                )}
                <FormField
                  label="Min rental days"
                  name="minRentalDays"
                  type="number"
                  defaultValue={product?.type === "vehicle" ? product.minRentalDays : 1}
                />
                <FormField
                  label="Max rental days (optional)"
                  name="maxRentalDays"
                  type="number"
                  defaultValue={product?.type === "vehicle" ? product.maxRentalDays : undefined}
                />
              </div>
            )}
          </FormSection>
        </>
      ) : (
        <FormSection title="Spare part details">
          <FormField
            label="Part name"
            name="partName"
            defaultValue={product?.type === "spare_part" ? product.partName : ""}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Part number"
              name="partNumber"
              defaultValue={product?.type === "spare_part" ? product.partNumber : ""}
              required
            />
            <FormField
              label="Brand"
              name="brand"
              defaultValue={product?.type === "spare_part" ? product.brand : ""}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Category"
              name="category"
              defaultValue={product?.type === "spare_part" ? product.category : ""}
              required
            />
            <FormField
              label="Stock"
              name="stock"
              type="number"
              defaultValue={product?.type === "spare_part" ? product.stock : 0}
              required
            />
          </div>
          <FormField
            label="Compatible makes (comma-separated)"
            name="compatibleMakes"
            defaultValue={
              product?.type === "spare_part" ? product.compatibleMakes.join(", ") : ""
            }
          />
          <FormField
            label="Compatible models (comma-separated)"
            name="compatibleModels"
            defaultValue={
              product?.type === "spare_part" ? product.compatibleModels.join(", ") : ""
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Compatible from year"
              name="compatibleYearFrom"
              type="number"
              defaultValue={
                product?.type === "spare_part" ? product.compatibleYears?.[0] : undefined
              }
            />
            <FormField
              label="Compatible to year"
              name="compatibleYearTo"
              type="number"
              defaultValue={
                product?.type === "spare_part" ? product.compatibleYears?.[1] : undefined
              }
            />
          </div>
          <FormField
            label="Compatibility notes"
            name="compatibilityNotes"
            defaultValue={product?.type === "spare_part" ? product.compatibilityNotes : ""}
          />
          <FormField
            label="Warranty (months)"
            name="warrantyMonths"
            type="number"
            defaultValue={product?.type === "spare_part" ? product.warrantyMonths : undefined}
          />
        </FormSection>
      )}

      <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
    </form>
  );
}
