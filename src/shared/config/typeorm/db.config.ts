import { DataSource } from "typeorm";
import { User } from "../../../modules/user/entities/user.entity";

import dotenv from "dotenv";
import { FlagshipEventVersion } from "../../../modules/flagship-event/entities/flagship-event.entity";
import { AuditLog } from "../../../modules/auditlogs/entities/audit-log.entity";
import { Category } from "../../../modules/category/entities/category.entity";
import { TeamMember } from "../../../modules/team-members/entities/team-member.entity";
import { AccessToken } from "../../../modules/auth/entities/access-token.entity";
import { RefreshToken } from "../../../modules/auth/entities/refresh-token.entity";
import { envConfig } from "../env";
import { AssetLibrary } from "../../../modules/asset-library/entities/asset-library.entity";
import { Asset } from "../../../modules/asset-library/entities/asset.entity";

dotenv.config();

const dbConfigOptions = {
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_DATABASE,
  synchronize: true,
  logging: false,
};

const connectDatabase = new DataSource({
  type: 'mysql',
  host: dbConfigOptions.host,
  port: dbConfigOptions.port,
  username: dbConfigOptions.username,
  password: dbConfigOptions.password,
  database: dbConfigOptions.database,
  synchronize: dbConfigOptions.synchronize,
  logging: dbConfigOptions.logging,
  entities: [User, FlagshipEventVersion, AuditLog, AccessToken, RefreshToken, Category, TeamMember, AssetLibrary, Asset ],  //Note: Add your entities here
  migrations: [__dirname + '/../typeorm/migrations/*{.ts,.js}'],
});
export default connectDatabase;
