import { DataSource } from 'typeorm';
import cron from 'node-cron';
import { cleanTokens } from './remove-revoked-tokens.cron';
import { envConfig } from '../config/env';
import logger from '../utils/logger.utils';

export const startCronJobs = (dataSource: DataSource) => {
      logger.info('Cron jobs started', { module: 'Cron', systemMessage: 'Cron-Job' });
      cron.schedule(envConfig.CRON_REVOKED_TOKENS_SCHEDULE, () => {
            cleanTokens(dataSource);
      });
}