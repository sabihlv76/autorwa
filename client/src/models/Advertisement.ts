import { Schema, model, models, type InferSchemaType } from "mongoose";

const advertisementSchema = new Schema(
  {
    position: {
      type: String,
      enum: ["top_left", "top_right"],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    targetUrl: { type: String, required: true },
    advertiser: { type: String, required: true },
    active: { type: Boolean, required: true, default: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: { type: Number, required: true, default: 0, index: true },
  },
  { timestamps: true },
);

export type AdvertisementDocument = InferSchemaType<typeof advertisementSchema>;

export const AdvertisementModel =
  models.Advertisement || model("Advertisement", advertisementSchema);
