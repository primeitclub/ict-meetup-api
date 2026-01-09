import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/config/typeorm/base-entity";
import { User } from "../../user/entities/user.entity";

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends BaseEntity {
      @Column({ type: 'varchar', length: 500, nullable: false })
      token: string;

      @Column({ type: 'datetime', nullable: false })
      expiresAt: Date;


      @Column({ type: 'varchar', length: 36, nullable: false })
      @Index()
      userId: string;

      @Column({ type: 'varchar', length: 255, nullable: false })
      @Index()
      ipAddress: string;

      @Column({ type: 'varchar', length: 255, nullable: false })
      @Index()
      userAgent: string;

      @Column({ type: 'boolean', default: false, nullable: false })
      isRevoked: boolean;

      @ManyToOne(() => User, (user) => user.id)
      @JoinColumn({ name: 'userId' })
      user: User;

}