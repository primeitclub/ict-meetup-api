import { Column, Entity, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';
import { AssetSourceTable } from './asset-source-table.enum';

@Entity({ name: 'asset_library' })
@Unique(['source_table', 'source_table_id'])
export class AssetLibrary extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  flagship_event_version_id: string;

  @Column({
    type: 'enum',
    enum: AssetSourceTable,
    nullable: false,
  })
  source_table: AssetSourceTable;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  source_table_id: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
  })
  max_image_upload: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  extra_options?: any;

  @ManyToOne(() => FlagshipEventVersion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flagship_event_version_id' })
  flagshipEventVersion: FlagshipEventVersion;
}
