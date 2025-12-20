import {
  Column,
  Entity,
  Index,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import {
  AuditLogType,
  AuditLogActionType,
  AuditLogScope,
} from '../../constants/audit-log.constants';

@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @Column({
    type: 'enum',
    enum: AuditLogType,
  })
  @Index()
  logType: AuditLogType;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string | null;

  @Column({
    type: 'enum',
    enum: AuditLogActionType,
  })
  @Index()
  logActionType: AuditLogActionType;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'uuid', nullable: true })
  versionId: string | null;

  @Column({
    type: 'enum',
    enum: AuditLogScope,
  })
  @Index()
  scope: AuditLogScope;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;
}
