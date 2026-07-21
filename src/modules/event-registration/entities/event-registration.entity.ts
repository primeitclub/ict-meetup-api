import { Entity, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Event } from "../../event/entities/event.entity";

export enum EventRegistrationStatus {
      PENDING = "pending",
      APPROVED = "approved",
      REJECTED = "rejected",
}

@Entity({ name: "event_registration" })
export class EventRegistration extends BaseEntity {
      @Column({ type: "varchar", length: 150 })
      trackingId: string;

      @Column({ type: "varchar", length: 150 })
      username: string;

      @Column({ type: "varchar", length: 150 })
      email: string;

      @Column({ type: "varchar", length: 150 })
      contactNumber: string;

      @Column({ type: "boolean" })
      isStudent: boolean;

      @Column({ type: "varchar", length: 150, nullable: true })
      educationLevel: string | null;

      @Column({ name: "college_name", type: "varchar", length: 150, nullable: true })
      collegeName: string | null;

      @Column({ type: "varchar", length: 150, nullable: true })
      faculty: string | null;

      @Column({ type: "int", nullable: true })
      year: number | null;

      @Column({ type: "varchar", length: 150, nullable: true })
      attachedPaymentScreenshot: string | null;

      @Column({ name: "team_name", type: "varchar", length: 150, nullable: true })
      teamName: string | null;

      @Column({ type: "json", nullable: true })
      participants: { fullName: string; email: string; phoneNumber?: string }[] | null;

      @Column({ type: "varchar", length: 150 })
      eventId: string;

      @ManyToOne(() => Event, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'eventId' })
      event: Event;

      @Column({ type: "varchar", length: 150 })
      versionId: string;

      @ManyToOne(() => FlagshipEventVersion, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'versionId' })
      version: FlagshipEventVersion;

      @Column({ type: "enum", enum: EventRegistrationStatus })
      status: EventRegistrationStatus;

      @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true, default: null })
      deletedAt?: Date;
}