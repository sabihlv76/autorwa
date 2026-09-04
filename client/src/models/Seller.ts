import { Schema, model, models, type InferSchemaType } from "mongoose";

const sellerSchema = new Schema(
  {
    name: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    location: { type: String, required: true, index: true },
    whatsapp: { type: String, required: true },
    enterprise: { type: Boolean, required: true, default: false },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true },
);

export type SellerDocument = InferSchemaType<typeof sellerSchema>;

export const SellerModel = models.Seller || model("Seller", sellerSchema);
