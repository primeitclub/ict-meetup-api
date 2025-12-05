import z from "zod";

const envSchema = z.object({
      port: z.number().default(3000),
      db_host: z.string().default('localhost'),
      db_port: z.number().default(5432),
      db_username: z.string().default('postgres'),
      db_password: z.string().default('postgres'),
      db_database: z.string().default('ict-meetup'),
      node_env: z.enum(['dev', 'prod']).default('dev'),
});
export const envConfig = envSchema.parse(process.env);

export const isProd = envConfig.node_env === 'prod';