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

  @Column({ name: 'social_media_links', type: 'json', nullable: true })
  socialMediaLinks: { platform: string; link: string }[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'team_name', type: 'varchar', length: 255, nullable: true })
  teamName: string;

  @Column({ name: 'qr_code_url', type: 'text', nullable: true })
  qrCodeUrl: string;

  @Column({ name: 'qr_code_path', type: 'text', nullable: true })
  qrCodePath: string;

  @Column({ name: 'qr_code_local_path', type: 'text', nullable: true })
  qrCodeLocalPath: string;
}
