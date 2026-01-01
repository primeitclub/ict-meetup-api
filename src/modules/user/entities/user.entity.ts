import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";

@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  @Index()
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    default: "user",
  })
  role: string;
}
