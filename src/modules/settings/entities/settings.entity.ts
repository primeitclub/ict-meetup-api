import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

@Entity({ name: 'settings' })
export class Settings extends BaseEntity {

  @Index()
  @Column({
    name: 'flagship_event_version_id',
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  versionId: string;

  @ManyToOne(() => FlagshipEventVersion)
  @JoinColumn({ name: 'flagship_event_version_id' })
  flagshipEventVersion: FlagshipEventVersion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'contact_departments', type: 'json', nullable: true })
  contactDepartments: { department: string; contacts: { name: string; phone: string }[] }[];
}
