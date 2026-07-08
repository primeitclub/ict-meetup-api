import { DataSource, Repository } from "typeorm";
import { AuditLog } from "../entities/audit-log.entity";
import { CreateAuditLogDto, AuditLogQueryDto } from "../dto/audit-log.dto";
import logger from "../../../shared/utils/logger.utils";
import { AppError } from "../../../shared/utils/error.utils";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";

export class AuditLogService {
      private auditLogRepository: Repository<AuditLog>;
      private versionRepository: Repository<FlagshipEventVersion>;

      constructor(dataSource: DataSource) {
            this.auditLogRepository = dataSource.getRepository(AuditLog);
            this.versionRepository = dataSource.getRepository(FlagshipEventVersion);
      }

      async create(data: CreateAuditLogDto): Promise<AuditLog> {
            try {
                  const auditLog = this.auditLogRepository.create({
                        logType: data.logType,
                        userId: data.userId ?? null,
                        logActionType: data.logActionType,
                        message: data.message,
                        versionId: data.versionId ?? null,
                        scope: data.scope,
                        ipAddress: data.ipAddress ?? null,
                  });

                  const savedLog = await this.auditLogRepository.save(auditLog);

                  logger.info('Audit log created', {
                        module: 'AuditLogService',
                        logType: data.logType,
                        action: data.logActionType,
                        scope: data.scope,
                        userId: data.userId,
                  });

                  return savedLog;
            } catch (error: any) {
                  logger.error('Failed to create audit log', {
                        module: 'AuditLogService',
                        error: error instanceof Error ? error.message : String(error),
                        data,
                  });
                  throw error;
            }
      }

      async getAll(query: AuditLogQueryDto) {
            const {
                  userId,
                  logType,
                  logActionType,
                  scope,
                  versionId,
                  page = 1,
                  limit = 10
            } = query;

            const pageNum = Number(page);
            const limitNum = Math.min(Number(limit) || 10, 100);
            const skip = (pageNum - 1) * limitNum;

            const queryBuilder = this.auditLogRepository.createQueryBuilder('auditLog');

            const versionExists = await this.versionRepository.findOne({ where: { id: versionId } });

            if (!versionExists) {
                  throw new AppError('Version not found', 404);
            }

            if (userId) {
                  queryBuilder.andWhere('auditLog.userId = :userId', { userId });
            }

            if (logType) {
                  queryBuilder.andWhere('auditLog.logType = :logType', { logType });
            }

            if (logActionType) {
                  queryBuilder.andWhere('auditLog.logActionType = :logActionType', { logActionType });
            }

            if (scope) {
                  queryBuilder.andWhere('auditLog.scope = :scope', { scope });
            }

            if (versionId) {
                  queryBuilder.andWhere('auditLog.versionId = :versionId', { versionId });
            }

            queryBuilder
                  .orderBy('auditLog.createdAt', 'DESC')
                  .skip(skip)
                  .take(limitNum);

            const [items, total] = await queryBuilder.getManyAndCount();

            return {
                  items,
                  meta: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum),
                  },
            };
      }
}