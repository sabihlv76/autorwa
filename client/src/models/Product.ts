import { Schema, model, models } from "mongoose";

const sellerSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    verified: { type: Boolean, required: true },
    location: { type: String, required: true },
    whatsapp: { type: String, required: true },
    enterprise: { type: Boolean },
    rating: { type: Number },
    createdAt: { type: Date },
  },
  { _id: false },
);

const baseOptions = { discriminatorKey: "type", timestamps: true } as const;

const productBaseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    currency: { type: String, enum: ["RWF", "USD"], required: true },
    images: { type: [String], default: [] },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    seller: { type: sellerSnapshotSchema, required: true },
    availability: {
      type: String,
      enum: ["available", "reserved", "sold", "out_of_stock"],
      required: true,
      index: true,
    },
    condition: {
      type: String,
      enum: ["new", "used", "certified_pre_owned"],
      required: true,
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
  },
  baseOptions,
);

export const ProductModel = models.Product || model("Product", productBaseSchema);

const vehicleSchema = new Schema({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true },
  generation: String,
  trim: String,
  year: { type: Number, required: true, index: true },
  mileageKm: { type: Number, required: true, index: true },
  fuel: {
    type: String,
    enum: ["petrol", "diesel", "hybrid", "electric"],
    required: true,
    index: true,
  },
  transmission: {
    type: String,
    enum: ["manual", "automatic"],
    required: true,
    index: true,
  },
  driveType: {
    type: String,
    enum: ["fwd", "rwd", "awd", "4wd"],
    required: true,
  },
  engineCapacityL: { type: Number, required: true },
  bodyType: {
    type: String,
    enum: ["sedan", "suv", "hatchback", "pickup", "van", "coupe", "wagon", "minibus"],
    required: true,
    index: true,
  },
  color: { type: String, required: true },
  location: { type: String, required: true, index: true },
  features: { type: [String], default: [] },
  negotiable: { type: Boolean, default: false },
  listingType: {
    type: String,
    enum: ["sale", "rent", "both"],
    required: true,
    default: "sale",
    index: true,
  },
  dailyRentalRate: { type: Number },
  minRentalDays: { type: Number, required: true, default: 1 },
  maxRentalDays: { type: Number },
});

export const VehicleProductModel =
  models.vehicle || ProductModel.discriminator("vehicle", vehicleSchema);

const sparePartSchema = new Schema({
  partName: { type: String, required: true },
  partNumber: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  stock: { type: Number, required: true, default: 0 },
  compatibleMakes: { type: [String], default: [] },
  compatibleModels: { type: [String], default: [] },
  compatibleYears: {
    type: [Number],
    // Without this, Mongoose defaults an unset array path to `[]`, which
    // then fails the length-2 validator below — breaking the common case
    // of a spare part with no compatible-years range specified at all.
    default: undefined,
    validate: {
      validator: (v: number[]) => v.length === 2,
      message: "compatibleYears must be a [min, max] pair",
    },
  },
  compatibilityNotes: String,
  warrantyMonths: Number,
});

export const SparePartProductModel =
  models.spare_part || ProductModel.discriminator("spare_part", sparePartSchema);
