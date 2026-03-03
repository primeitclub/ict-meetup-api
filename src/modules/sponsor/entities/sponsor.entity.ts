import { Column, Entity, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { Category } from "../../category/entities/category.entity";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";

@Entity({ name: 'sponsors' })
export class Sponsor extends BaseEntity {
      @Index()
      @Column({ name: 'version_id', type: 'uuid' })
      versionId: string;

      @ManyToOne(() => FlagshipEventVersion, { onDelete: 'CASCADE' })
      @JoinColumn({ name: 'version_id' })
      flagshipEvent: FlagshipEventVersion;

      @Column({ name: 'image_path', type: 'varchar', length: 255 })
      imagePath: string;

      @Column({ type: 'varchar', length: 150 })
      name: string;

      @Column({ type: 'varchar', length: 255, nullable: true })
      link: string;

      @Index()
      @Column({ name: 'category_id', type: 'varchar', length: 36 })
      categoryId: string;

      @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
      @JoinColumn({ name: 'category_id' })
      category: Category;

      @Column({ name: 'display_order', type: 'int', default: 0 })
      displayOrder: number;

}
