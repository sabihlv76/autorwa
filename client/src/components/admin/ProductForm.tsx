"use client";

import { useActionState, useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ProductFormState } from "@/features/admin/actions/productForm";
import type { Product, ProductType, Seller } from "@/types/product";

type FormAction = (
  state: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

const initialState: ProductFormState = { success: false };

const inputClass = "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm";
const labelClass = "block text-sm font-medium text-black";

function Field({
  label,
  children,
  errors,
}: {
  label: string;
  children: React.ReactNode;
  errors?: string[];
}) {
  return (
    <div className="space-y-1">
      <label className={labelClass}>{label}</label>
      {children}
      {errors?.map((message) => (
        <p key={message} className="text-xs text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}

export function ProductForm({
  action,
  sellers,
  product,
}: {
  action: FormAction;
  sellers: Seller[];
  product?: Product;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const [type, setType] = useState<ProductType>(product?.type ?? "vehicle");
  const [listingType, setListingType] = useState<string>(
    product?.type === "vehicle" ? product.listingType : "sale",
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {product && <input type="hidden" name="productId" value={product.id} />}
      <input type="hidden" name="type" value={type} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Field label="Product type">
        <select
          value={type}
          disabled={!!product}
          onChange={(e) => setType(e.target.value as ProductType)}
          className={inputClass}
        >
          <option value="vehicle">Vehicle</option>
          <option value="spare_part">Spare part</option>
        </select>
      </Field>

      <FormField
        label="Title"
        name="title"
        defaultValue={product?.title}
        required
        errors={errors.title}
      />
      <div className="space-y-1">
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={4}
          required
          className={inputClass}
        />
        {errors.description?.map((m) => (
          <p key={m} className="text-xs text-red-600">
            {m}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          required
          errors={errors.price}
        />
        <Field label="Currency">
          <select name="currency" defaultValue={product?.currency ?? "RWF"} className={inputClass}>
            <option value="RWF">RWF</option>
            <option value="USD">USD</option>
          </select>
        </Field>
      </div>

      <FormField
        label="Image URLs (comma-separated)"
        name="images"
        defaultValue={product?.images.join(", ")}
        errors={errors.images}
      />

      <Field label="Seller" errors={errors.sellerId}>
        <select name="sellerId" defaultValue={product?.seller.id} required className={inputClass}>
          <option value="">Choose a seller</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Availability">
          <select
            name="availability"
            defaultValue={product?.availability ?? "available"}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </Field>
        <Field label="Condition">
          <select
            name="condition"
            defaultValue={product?.condition ?? "used"}
            className={inputClass}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_pre_owned">Certified pre-owned</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-black">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Featured
      </label>

      {type === "vehicle" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-3 gap-4">
            <Field label="Fuel">
              <select
                name="fuel"
                defaultValue={product?.type === "vehicle" ? product.fuel : "petrol"}
                className={inputClass}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </Field>
            <Field label="Transmission">
              <select
                name="transmission"
                defaultValue={product?.type === "vehicle" ? product.transmission : "manual"}
                className={inputClass}
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </Field>
            <Field label="Drive type">
              <select
                name="driveType"
                defaultValue={product?.type === "vehicle" ? product.driveType : "fwd"}
                className={inputClass}
              >
                <option value="fwd">FWD</option>
                <option value="rwd">RWD</option>
                <option value="awd">AWD</option>
                <option value="4wd">4WD</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Engine capacity (L)"
              name="engineCapacityL"
              type="number"
              step="0.1"
              defaultValue={product?.type === "vehicle" ? product.engineCapacityL : undefined}
              required
            />
            <Field label="Body type">
              <select
                name="bodyType"
                defaultValue={product?.type === "vehicle" ? product.bodyType : "sedan"}
                className={inputClass}
              >
                {["sedan", "suv", "hatchback", "pickup", "van", "coupe", "wagon", "minibus"].map(
                  (bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ),
                )}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          <label className="flex items-center gap-2 text-sm text-black">
            <input
              type="checkbox"
              name="negotiable"
              defaultChecked={product?.type === "vehicle" ? product.negotiable : false}
            />
            Negotiable
          </label>

          <div className="rounded-md border border-zinc-200 p-3">
            <Field label="Listing type">
              <select
                name="listingType"
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className={inputClass}
              >
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
                <option value="both">For sale & rent</option>
              </select>
            </Field>
            {listingType !== "sale" && (
              <div className="mt-3 grid grid-cols-3 gap-4">
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
          </div>
        </>
      ) : (
        <>
          <FormField
            label="Part name"
            name="partName"
            defaultValue={product?.type === "spare_part" ? product.partName : ""}
            required
          />
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
        </>
      )}

      <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
    </form>
  );
}
