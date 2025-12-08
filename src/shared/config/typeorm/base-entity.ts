import {
      Column,
      CreateDateColumn,
      Index,
      PrimaryGeneratedColumn,
      UpdateDateColumn,
} from 'typeorm';

// Note: This is a base entity class to be extended by other entities
// Indexes are added to frequently queried columns for performance optimization
export class BaseEntity {
      @PrimaryGeneratedColumn('uuid')
      @Index()
      id: string;

      @CreateDateColumn({
            type: 'timestamp without time zone',
            nullable: true,
            default: null,
      })
      @Index()
      createdAt?: Date;

      @UpdateDateColumn({
            type: 'timestamp without time zone',
            nullable: true,
            default: null,
      })
      @Index()
      updatedAt?: Date;

      @Column({
            type: 'uuid',
            nullable: true,
            default: null,
      })
      createdById?: string;

      @Column({
            type: 'uuid',
            nullable: true,
            default: null,
      })
      modifiedBy?: string;
}
