import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

@Entity({ name: 'gallery_images' })
export class GalleryImage extends BaseEntity {

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

  @Column({ type: 'varchar', length: 255, nullable: false })
  imagePath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cloudImageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link?: string | null;
}

