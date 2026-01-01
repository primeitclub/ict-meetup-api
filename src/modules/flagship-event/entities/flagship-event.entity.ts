import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";

export enum EventVersionStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

@Entity({
  name: "flagship_event_versions",
})
export class FlagshipEventVersion extends BaseEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  version_name: string;

  @Column({
    type: "varchar",
    length: 50,
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 1,
    nullable: false,
  })
  version_number: number;

  @Column({
    type: "enum",
    enum: EventVersionStatus,
    default: EventVersionStatus.DRAFT,
  })
  status: EventVersionStatus;

  @Column({
    type: "date",
    nullable: false,
  })
  start_date: Date;

  @Column({
    type: "date",
    nullable: false,
  })
  end_date: Date;

  @Column({
    type: "boolean",
    default: false,
  })
  is_current: boolean;
}
