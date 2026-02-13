import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { AssetLibrary } from './asset-library.entity';

@Entity({ name: 'assets' })
@Index(['asset_library_id', 'display_order'], { unique: true, where: 'deleted_at IS NULL' })
export class Asset extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  asset_library_id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image_path?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image_url?: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  display_order: number;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null,
  })
  deleted_at?: Date;

  @ManyToOne(() => AssetLibrary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_library_id' })
  assetLibrary: AssetLibrary;
}
