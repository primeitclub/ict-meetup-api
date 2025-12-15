import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";

@Entity({
      name: 'user',
})
export class User extends BaseEntity {
      @Column({
            length: 255,
            unique: true,
            nullable: false,
      })
      email: string;

      @Column({
            length: 200,
            nullable: false,
            select: false,
      })
      password: string;

      @Column({
            length: 100,
            nullable: false,
      })
      name: string;

      @Column({ enum: ['superadmin', 'admin'], default: 'superadmin' })
      role: 'superadmin' | 'admin';

}