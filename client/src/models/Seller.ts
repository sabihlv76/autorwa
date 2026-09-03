import { Schema, model, models, type InferSchemaType } from "mongoose";

const sellerSchema = new Schema(
  {
    name: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    location: { type: String, required: true, index: true },
    whatsapp: { type: String, required: true },
  },
  { timestamps: true },
);

export type SellerDocument = InferSchemaType<typeof sellerSchema>;

export const SellerModel = models.Seller || model("Seller", sellerSchema);
