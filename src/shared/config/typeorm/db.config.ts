import { DataSource } from "typeorm";

const dbConfigOptions = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'ict-meetup',
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
      entities: [],  //Note: Add your entities here
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
export default connectDatabase;