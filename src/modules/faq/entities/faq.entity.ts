import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

@Entity({ name: 'faqs' })
export class Faq extends BaseEntity {

  @Index()
  @Column({
    name: 'flagship_event_version_id',
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  versionId: string;

  @ManyToOne(() => FlagshipEventVersion)
  @JoinColumn({ name: 'flagship_event_version_id' })
  flagshipEventVersion: FlagshipEventVersion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Explicit display order within a version, set from the array index the
  // admin submits. Lower sorts first. Not derived from createdAt/updatedAt,
  // which change independently and previously caused list order to drift.
  @Index()
  @Column({ name: 'order', type: 'int', nullable: false, default: 0 })
  order: number;
}
