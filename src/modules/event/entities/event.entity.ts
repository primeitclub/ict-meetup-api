import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
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

export enum EventType {
      SINGLE = "SINGLE",
      GROUP = "GROUP",
}

@Entity({ name: 'events' })
export class Event extends BaseEntity {
      @Column({ name: 'event_type', type: "enum", enum: EventType, default: EventType.SINGLE })
      eventType: EventType;

      @Column({ name: 'max_participants', type: 'int', nullable: true })
      maxParticipants: number | null;

      @Column({ type: 'varchar', length: 150 })
      title: string;

      @Column({ type: 'varchar', length: 150 })
      subtitle: string;

      @Column({ type: 'text' })
      description: string;

      @Column({ name: 'image_path', type: 'varchar' })
      imagePath: string;

      @Column({ name: 'image_url', type: 'varchar', nullable: true })
      imageUrl: string;

      /**
       * External registration URL (e.g. a Google Form). When set, it takes
       * precedence over the in-app registration flow.
       */
      @Column({ name: 'register_link', type: 'varchar', length: 500, nullable: true })
      registerLink: string | null;

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

      @ManyToMany(() => Speaker, { onDelete: 'RESTRICT' })
      @JoinTable({
            name: 'event_speakers',
            joinColumn: { name: 'event_id', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'speaker_id', referencedColumnName: 'id' },
      })
      speakers: Speaker[];

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