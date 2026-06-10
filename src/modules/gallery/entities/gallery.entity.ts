import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

// A single image inside a version's gallery. Stored as an element of the
// `images` JSON array below — it is NOT its own table row. The `id` is an
// app-generated uuid so the frontend can still address one image in the group.
export interface GalleryImageItem {
  id: string;
  imagePath: string;
  cloudImageUrl: string;
  link?: string | null;
}

@Entity({ name: 'galleries' })
export class Gallery extends BaseEntity {

  @Index({ unique: true })
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

  // The whole gallery for this version: a bounded (1-7) array of image objects.
  @Column({ type: 'json', nullable: false })
  images: GalleryImageItem[];
}
