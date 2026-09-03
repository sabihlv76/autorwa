import { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const FavoriteModel = models.Favorite || model("Favorite", favoriteSchema);
