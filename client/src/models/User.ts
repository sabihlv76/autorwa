import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "business", "admin", "moderator", "finance", "support"],
      required: true,
      default: "customer",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "closed"],
      required: true,
      default: "active",
    },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = models.User || model("User", userSchema);
