import { Schema, model, models } from "mongoose";

const auditLogSchema = new Schema(
  {
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const AuditLogModel = models.AuditLog || model("AuditLog", auditLogSchema);
