import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { Designation } from '../../designation/entities/designation.entity';

@Entity({ name: 'team_members' })
export class TeamMember extends BaseEntity {
  @Index()
  @Column({ name: 'version_id', type: 'uuid' })
  versionId: string;

  @ManyToOne(() => FlagshipEventVersion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'version_id' })
  flagshipEvent: FlagshipEventVersion;

  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

  @Column({ name: 'image_path', type: 'varchar', nullable: true })
  imagePath: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  socialLinks: Record<string, string>;

  @Column({ name: 'designation_order', type: 'int', default: 0 })
  designationOrder: number;

  @Index()
  @Column({ name: 'designation_id', type: 'uuid' })
  designationId: string;

  @ManyToOne(() => Designation, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

}
