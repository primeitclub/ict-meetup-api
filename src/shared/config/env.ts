import z from "zod";
import dotenv from "dotenv";
dotenv.config();
const envSchema = z.object({
      PORT: z.coerce.number().default(3000),
      DB_HOST: z.string().default('localhost'),
      DB_PORT: z.coerce.number().default(3306),
      DB_USERNAME: z.string().default('root'),
      DB_PASSWORD: z.string().default(''),
      DB_DATABASE: z.string().default('primeitc_ictmeetup_dev'),
      NODE_ENV: z.enum(['dev', 'prod', 'local']).default('dev'),
      JWT_ACCESS_SECRET: z.string().default('secret'),
      JWT_REFRESH_SECRET: z.string().default('refresh-secret'),
      JWT_ACCESS_EXPIRY: z.string().default('15m'),
      JWT_REFRESH_EXPIRY: z.string().default('7d'),
      CLOUDINARY_CLOUD_NAME: z.string().default('dmjgb9sfv'),
      CLOUDINARY_API_KEY: z.string().default('257648886367978'),
      CLOUDINARY_API_SECRET: z.string().default('3M9cgR50m7y69ygWO8vHR2KLhX0'),
      CRON_REVOKED_TOKENS_SCHEDULE: z.string().default('0 0 * * *'),
      ALLOWED_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176'),
      MAIL_USER: z.string().default(''),
      MAIL_PASSWORD: z.string().default(''),
      MAIL_FROM: z.string().default(''),
});

export const envConfig = envSchema.parse(process.env);
export const isProd = envConfig.NODE_ENV === 'prod';