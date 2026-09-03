import { connectToDatabase } from "@/lib/db/connect";
import { AuditLogModel } from "@/models/AuditLog";

export interface AuditLogEntry {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface AuditLogDoc {
  _id: { toString(): string };
  adminUserId: { toString(): string };
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

function toEntry(doc: AuditLogDoc): AuditLogEntry {
  return {
    id: doc._id.toString(),
    adminUserId: doc.adminUserId.toString(),
    action: doc.action,
    targetType: doc.targetType,
    targetId: doc.targetId,
    metadata: doc.metadata,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function log({
  adminUserId,
  action,
  targetType,
  targetId,
  metadata,
}: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await connectToDatabase();
  await AuditLogModel.create({ adminUserId, action, targetType, targetId, metadata });
}

export async function listRecent(limit = 50): Promise<AuditLogEntry[]> {
  await connectToDatabase();
  const docs = await AuditLogModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<AuditLogDoc[]>();
  return docs.map(toEntry);
}
