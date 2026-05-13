import { DataSource } from 'typeorm';
import { AuditLogService } from '../../modules/auditlogs/services/audit-log.service';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../constants/audit-log.constants';
import logger from '../utils/logger.utils';

export abstract class BaseController {
      protected auditLogService: AuditLogService;
      protected abstract moduleName: string;

      constructor(dataSource: DataSource) {
            this.auditLogService = new AuditLogService(dataSource);
      }

      protected async createAuditLog(
            logType: AuditLogType,
            logActionType: AuditLogActionType,
            message: string,
            versionId: string | null,
            scope: AuditLogScope,
            ipAddress: string | undefined,
            userId: string,
      ) {
            logger.info(`Audit Log: ${logActionType} on ${scope} by ${userId}`, {
                  module: this.moduleName,
                  versionId,
                  ipAddress,
            });

            await this.auditLogService.create({
                  logType: logType,
                  userId,
                  logActionType: logActionType,
                  message: message,
                  versionId: versionId,
                  scope: scope,
                  ipAddress: ipAddress,
            });
      }
}
