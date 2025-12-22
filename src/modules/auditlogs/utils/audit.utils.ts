import connectDatabase from '../../../shared/config/typeorm/db.config';
import { AuditLog } from '../config/typeorm/audit-log.entity';
import {
  AuditLogType,
  AuditLogActionType,
  AuditLogScope,
} from '../constants/audit-log.constants';
import logger from '../../../shared/utils/logger.utils'; 

interface AuditLogParams {
  logType: AuditLogType;
  userId?: string;
  logActionType: AuditLogActionType;
  message: string;
  versionId?: string;
  scope: AuditLogScope;
  ipAddress?: string;
}

export const logAudit = async (params: AuditLogParams): Promise<void> => {
  try {
    const auditRepo = connectDatabase.getRepository(AuditLog);

    const auditLog = auditRepo.create({
      logType: params.logType,
      userId: params.userId ?? null,
      logActionType: params.logActionType,
      message: params.message,
      versionId: params.versionId ?? null,
      scope: params.scope,
      ipAddress: params.ipAddress ?? null,
    });

    await auditRepo.save(auditLog);

    logger.info('Audit log created', {
      module: 'AuditLogger',
      logType: params.logType,
      action: params.logActionType,
      scope: params.scope,
      userId: params.userId,
      message: params.message,
    });
  } catch (e: any) {
    logger.error('Failed to create audit log', {
      module: 'AuditLogger',
      errorMessage: e?.message,
      stack: e?.stack,
      params,
    });
  }
};
