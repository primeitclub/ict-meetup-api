import { DataSource } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";

import dotenv from "dotenv";
import { FlagshipEventVersion } from "../../../modules/flagship-event/entities/flagship-event.entity";
import { AuditLog } from "../../../modules/auditlogs/entities/audit-log.entity";

dotenv.config();

const dbConfigOptions = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "ict-meetup",
  synchronize: false,
  logging: false,
};

const connectDatabase = new DataSource({
  type: 'postgres',
  host: dbConfigOptions.host,
  port: dbConfigOptions.port,
  username: dbConfigOptions.username,
  password: dbConfigOptions.password,
  database: dbConfigOptions.database,
  synchronize: dbConfigOptions.synchronize,
  logging: dbConfigOptions.logging,
  entities: [User, FlagshipEventVersion, AuditLog],  //Note: Add your entities here
  migrations: [__dirname + '/../typeorm/migrations/*{.ts,.js}'],
});
export default connectDatabase;
