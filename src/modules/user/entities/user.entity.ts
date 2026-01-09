import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { AccessToken } from "../../auth/entities/access-token.entity";

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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];
}
