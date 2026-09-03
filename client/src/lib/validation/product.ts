import { z } from "zod";

const csvToArray = (value: unknown): string[] =>
  typeof value === "string"
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const checkboxToBoolean = (value: unknown): boolean =>
  value === "on" || value === "true" || value === true;

const emptyToUndefined = (value: unknown): unknown =>
  value === "" || value === null ? undefined : value;

/**
 * An optional numeric form field. `z.coerce.number()` on `""` produces `0`
 * (not NaN — `Number("")` is `0`), which then fails a `.positive()`/`.min()`
 * check instead of being treated as "not provided". Stripping the empty
 * string to `undefined` before coercion runs is what actually makes
 * `.optional()` take effect.
 */
function optionalNumber<T extends z.ZodType<number>>(schema: T) {
  return z.preprocess(emptyToUndefined, schema.optional());
}

const baseFields = {
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(2000),
  price: z.coerce.number().positive(),
  currency: z.enum(["RWF", "USD"]),
  images: z.preprocess(csvToArray, z.array(z.string())),
  sellerId: z.string().min(1, "Choose a seller"),
  availability: z.enum(["available", "reserved", "sold", "out_of_stock"]),
  featured: z.preprocess(checkboxToBoolean, z.boolean()),
  condition: z.enum(["new", "used", "certified_pre_owned"]),
};

export const vehicleFormSchema = z
  .object({
    ...baseFields,
    type: z.literal("vehicle"),
    make: z.string().trim().min(1),
    model: z.string().trim().min(1),
    generation: z.string().trim().optional().or(z.literal("")),
    trim: z.string().trim().optional().or(z.literal("")),
    year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
    mileageKm: z.coerce.number().int().min(0),
    fuel: z.enum(["petrol", "diesel", "hybrid", "electric"]),
    transmission: z.enum(["manual", "automatic"]),
    driveType: z.enum(["fwd", "rwd", "awd", "4wd"]),
    engineCapacityL: z.coerce.number().min(0),
    bodyType: z.enum([
      "sedan",
      "suv",
      "hatchback",
      "pickup",
      "van",
      "coupe",
      "wagon",
      "minibus",
    ]),
    color: z.string().trim().min(1),
    location: z.string().trim().min(1),
    features: z.preprocess(csvToArray, z.array(z.string())),
    negotiable: z.preprocess(checkboxToBoolean, z.boolean()),
    listingType: z.enum(["sale", "rent", "both"]),
    dailyRentalRate: optionalNumber(z.coerce.number().positive()),
    minRentalDays: z.coerce.number().int().min(1).default(1),
    maxRentalDays: optionalNumber(z.coerce.number().int().min(1)),
  })
  .refine(
    (data) => data.listingType === "sale" || data.listingType === "rent" || !!data.dailyRentalRate,
    {
      message: "Set a daily rental rate for a sale-and-rent listing",
      path: ["dailyRentalRate"],
    },
  );

export const sparePartFormSchema = z.object({
  ...baseFields,
  type: z.literal("spare_part"),
  partName: z.string().trim().min(1),
  partNumber: z.string().trim().min(1),
  category: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  stock: z.coerce.number().int().min(0),
  compatibleMakes: z.preprocess(csvToArray, z.array(z.string())),
  compatibleModels: z.preprocess(csvToArray, z.array(z.string())),
  compatibleYearFrom: optionalNumber(z.coerce.number().int()),
  compatibleYearTo: optionalNumber(z.coerce.number().int()),
  compatibilityNotes: z.string().trim().optional().or(z.literal("")),
  warrantyMonths: optionalNumber(z.coerce.number().int().min(0)),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
export type SparePartFormInput = z.infer<typeof sparePartFormSchema>;
