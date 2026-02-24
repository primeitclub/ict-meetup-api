import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

@Entity({ name: 'hero_sections' })
export class HeroSection extends BaseEntity {

  @Index()
  @Column({
    name: 'flagship_event_version_id',
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  flagshipEventVersionId: string;

  @ManyToOne(() => FlagshipEventVersion)
  @JoinColumn({ name: 'flagship_event_version_id' })
  flagshipEventVersion: FlagshipEventVersion;

  @Column({ type: 'text', nullable: true })
  heading: string;

  @Column({ type: 'text', nullable: true })
  paragraph: string;

  @Column({
    name: 'extra_options',
    type: 'json',
    nullable: true,
  })
  extraOptions: Record<string, any>;
}
