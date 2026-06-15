import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";

@Entity({ name: 'speakers' })
export class Speaker extends BaseEntity {
      @Column({ type: 'varchar', length: 150 })
      name: string;

      @Column({ type: 'varchar', length: 150 })
      designation: string;

      @Column({ type: 'varchar', length: 150, nullable: true })
      company: string;

      @Column({ name: 'version_id', type: 'varchar', length: 36 })
      versionId: string;

      @Column({ name: 'image_path', type: 'varchar' })
      imagePath: string;

      @Column({ name: 'image_url', type: 'varchar', nullable: true })
      imageUrl: string;

      @ManyToOne(() => FlagshipEventVersion, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'version_id' })
      flagshipEvent: FlagshipEventVersion;


      @Column({ name: 'display_order', type: 'int', default: 0 })
      displayOrder: number;

      @Column({ type: 'json', nullable: true })
      socialLinks: {
            instagram?: string;
            linkedin?: string;
            portfolio?: string;
      };
}