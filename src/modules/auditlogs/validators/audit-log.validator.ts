import { z } from 'zod';
import { AuditLogType, AuditLogActionType, AuditLogScope } from '../../../shared/constants/audit-log.constants';
import { paginationShape } from '../../../shared/validators/pagination.validator';

// export const createAuditLogSchema = z.object({
//       logType: z.enum(AuditLogType),
//       userId: z.uuid().optional(),
//       logActionType: z.enum(AuditLogActionType),
//       message: z.string().min(1),
//       versionId: z.uuid().optional(),
//       scope: z.enum(AuditLogScope),
//       ipAddress: z.string().optional(),
// });

export const auditLogQuerySchema = z.object({
      userId: z.uuid().optional(),
      logType: z.enum(AuditLogType).optional(),
      logActionType: z.enum(AuditLogActionType).optional(),
      scope: z.enum(AuditLogScope).optional(),
      versionId: z.uuid().optional(),
      ...paginationShape
});
