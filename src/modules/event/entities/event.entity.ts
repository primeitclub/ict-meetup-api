import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { Category } from "../../category/entities/category.entity";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Speaker } from "../../speaker/entities/speaker.entity";

export enum FeeType {
      FREE = "free",
      PAID = "paid",
}

export enum EventStatus {
      DRAFT = "draft",
      PUBLISHED = "published",
      ARCHIVED = "archived",
}

@Entity({ name: 'events' })
export class Event extends BaseEntity {
      @Column({ type: 'varchar', length: 150 })
      title: string;

      @Column({ type: 'varchar', length: 150 })
      subtitle: string;

      @Column({ type: 'varchar', length: 255 })
      description: string;

      @Column({ name: 'image_path', type: 'varchar' })
      imagePath: string;

      @Column({ name: 'start_time', type: 'time', nullable: true })
      startTime: string;

      @Column({ name: 'end_time', type: 'time', nullable: true })
      endTime: string;

      @Column({ name: 'date', type: 'date', nullable: true })
      date: string;

      @Column({ name: 'category_id', type: 'varchar', length: 36 })
      categoryId: string;

      @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'category_id' })
      category: Category;

      @Column({ name: 'version_id', type: 'varchar', length: 36 })
      versionId: string;

      @ManyToOne(() => FlagshipEventVersion, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'version_id' })
      flagshipEvent: FlagshipEventVersion;

      @Column({ name: 'speaker_id', type: 'varchar', length: 36, nullable: true })
      speakerId: string;

      @ManyToOne(() => Speaker, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'speaker_id' })
      speaker: Speaker;

      @Column({ name: 'total_seats', type: 'int', default: 0 })
      totalSeats: number;

      @Column({ name: 'fee_type', type: "enum", enum: FeeType })
      feeType: FeeType;

      @Column({ type: 'varchar', length: 255 })
      fee: string;

      @Column({ type: 'varchar', length: 255 })
      location: string;

      @Column({ type: "enum", enum: EventStatus })
      status: EventStatus;

      @Column({ name: 'registration_deadline', type: 'timestamp' })
      registrationDeadline: Date;

      @Column({ name: 'display_order', type: 'int', default: 0 })
      displayOrder: number

      @Column({ name: 'is_highlighted', type: 'boolean', default: false })
      isHighlighted: boolean;
}