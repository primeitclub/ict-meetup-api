import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity({
  name: "audit_logs",
})
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  version_id?: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  table_name: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  record_id?: string | null;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  action: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  changed_by: string;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  changes: any;

  @CreateDateColumn({
    type: "timestamp without time zone",
  })
  created_at: Date;
}
