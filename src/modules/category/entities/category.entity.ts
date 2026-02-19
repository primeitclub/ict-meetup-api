import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
@Entity({ name: 'category' })
export class Category extends BaseEntity {

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

}
