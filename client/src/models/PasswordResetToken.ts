import { Schema, model, models } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const PasswordResetTokenModel =
  models.PasswordResetToken || model("PasswordResetToken", passwordResetTokenSchema);
