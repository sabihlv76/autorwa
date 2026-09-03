import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceSnapshot: { type: Number, required: true },
    currencySnapshot: { type: String, enum: ["RWF", "USD"], required: true },
    isRental: { type: Boolean, default: false },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    rentalDays: { type: Number },
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

const statusHistoryEntrySchema = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const whatsAppOrderSchema = new Schema(
  {
    orderReference: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    seller: { type: sellerSnapshotSchema, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerNotes: { type: String },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, enum: ["RWF", "USD"], required: true },
    status: {
      type: String,
      enum: [
        "created",
        "whatsapp_opened",
        "customer_confirmed",
        "processing",
        "completed",
        "cancelled",
      ],
      required: true,
      default: "created",
      index: true,
    },
    statusHistory: { type: [statusHistoryEntrySchema], default: [] },
  },
  { timestamps: true },
);

export const WhatsAppOrderModel =
  models.WhatsAppOrder || model("WhatsAppOrder", whatsAppOrderSchema);
