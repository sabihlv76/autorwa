import { Schema, model, models } from "mongoose";

const productSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { _id: false },
);

const sellerSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
  },
  { _id: false },
);

const callBookingSchema = new Schema(
  {
    bookingReference: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    reason: { type: String, required: true },
    product: { type: productSnapshotSchema },
    seller: { type: sellerSnapshotSchema },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled", "no_show"],
      required: true,
      default: "requested",
      index: true,
    },
  },
  { timestamps: true },
);

export const CallBookingModel =
  models.CallBooking || model("CallBooking", callBookingSchema);
