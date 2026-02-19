import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'designations' })
export class Designation extends BaseEntity {
      @Column({ name: 'name', type: 'varchar', length: 255 })
      name: string;
}