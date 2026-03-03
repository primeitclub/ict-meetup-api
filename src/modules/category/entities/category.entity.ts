import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';

export enum CategoryType {
  TEAM = 'teams',
  DESIGNATION = 'designations',
  EVENT = 'events',
  SPEAKER = 'speakers',
  SPONSOR = 'sponsors',
}

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @Index()
  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

}
