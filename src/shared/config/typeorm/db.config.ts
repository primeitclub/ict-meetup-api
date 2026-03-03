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
import { Designation } from "../../../modules/designation/entities/designation.entity";
import { HeroSection } from "../../../modules/hero-sections/entities/hero-section.entity";
import { AboutSection } from "../../../modules/about-sections/entities/about-section.entity";
import { Faq } from "../../../modules/faq/entities/faq.entity";
import { Event } from "../../../modules/event/entities/event.entity";
import { Speaker } from "../../../modules/speaker/entities/speaker.entity";
import { Sponsor } from "../../../modules/sponsor/entities/sponsor.entity";

dotenv.config();

const dbConfigOptions = {
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_DATABASE,
  synchronize: envConfig.NODE_ENV === 'local',
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
  entities: [User, FlagshipEventVersion, AuditLog, AccessToken, RefreshToken, Category, TeamMember, AssetLibrary, Asset, Designation, HeroSection, AboutSection, Faq, Event, Speaker, Sponsor],
  migrations: [__dirname + '/../typeorm/migrations/*{.ts,.js}'],
});
export default connectDatabase;
