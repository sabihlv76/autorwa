import { Schema, model, models } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true },
    currencySnapshot: { type: String, enum: ["RWF", "USD"], required: true },
    isRental: { type: Boolean, required: true, default: false },
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    rentalDays: { type: Number },
    addedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true, sparse: true },
    anonymousToken: { type: String, unique: true, sparse: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const CartModel = models.Cart || model("Cart", cartSchema);
