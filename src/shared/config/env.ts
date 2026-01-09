import z from "zod";

const envSchema = z.object({
      PORT: z.number().default(3000),
      DB_HOST: z.string().default('localhost'),
      DB_PORT: z.number().default(3306),
      DB_USERNAME: z.string().default('nirjla'),
      DB_PASSWORD: z.string().default('prime@prime123'),
      DB_DATABASE: z.string().default('ict-meetup'),
      NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
      JWT_ACCESS_SECRET: z.string().default('secret'),
      JWT_REFRESH_SECRET: z.string().default('refresh-secret'),
      JWT_ACCESS_EXPIRY: z.string().default('15m'),
      JWT_REFRESH_EXPIRY: z.string().default('7d'),
});

export const envConfig = envSchema.parse(process.env);
export const isProd = envConfig.NODE_ENV === 'prod';