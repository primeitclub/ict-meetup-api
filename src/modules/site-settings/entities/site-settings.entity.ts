import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';

/**
 * Singleton table — a single club has one contact email/phone, one set of
 * social links, and one payment QR code, shared across all flagship event
 * versions. Always exactly zero or one row.
 */
@Entity({ name: 'site_settings' })
export class SiteSettings extends BaseEntity {
  @Column({ name: 'club_email', type: 'varchar', length: 255, nullable: true })
  clubEmail: string;

  @Column({ name: 'club_phone_number', type: 'varchar', length: 20, nullable: true })
  clubPhoneNumber: string;

  @Column({ name: 'social_media_links', type: 'json', nullable: true })
  socialMediaLinks: { platform: string; link: string }[];

  @Column({ name: 'qr_code_url', type: 'text', nullable: true })
  qrCodeUrl: string;

  @Column({ name: 'qr_code_path', type: 'text', nullable: true })
  qrCodePath: string;

  @Column({ name: 'qr_code_local_path', type: 'text', nullable: true })
  qrCodeLocalPath: string;

  @Column({ name: 'proposal_url', type: 'text', nullable: true })
  proposalUrl: string;

  @Column({ name: 'proposal_path', type: 'text', nullable: true })
  proposalPath: string;

  @Column({ name: 'proposal_local_path', type: 'text', nullable: true })
  proposalLocalPath: string;
}
