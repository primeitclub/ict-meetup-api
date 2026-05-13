import { AuditLogType, AuditLogActionType, AuditLogScope } from '../../../shared/constants/audit-log.constants';

export interface CreateAuditLogDto {
      logType: AuditLogType;
      userId?: string;
      logActionType: AuditLogActionType;
      message: string;
      versionId?: string | null;
      scope: AuditLogScope;
      ipAddress?: string;
}

export interface AuditLogQueryDto {
      userId?: string;
      logType?: AuditLogType;
      logActionType?: AuditLogActionType;
      scope?: AuditLogScope;
      versionId?: string;
      page?: number;
      limit?: number;
}

export interface AuditLogResponseDto {
      id: string;
      logType: AuditLogType;
      userId: string | null;
      logActionType: AuditLogActionType;
      message: string;
      versionId: string | null;
      scope: AuditLogScope;
      ipAddress: string | null;
      createdAt: Date;
      updatedAt: Date;
}
