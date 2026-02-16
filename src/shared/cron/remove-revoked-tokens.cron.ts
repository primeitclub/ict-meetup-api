import { DataSource, LessThan, Repository } from "typeorm";
import { AccessToken } from "../../modules/auth/entities/access-token.entity";
import { RefreshToken } from "../../modules/auth/entities/refresh-token.entity";
import logger from "../utils/logger.utils";

class RemoveRevokedTokensCron {
      private accessTokenRepository: Repository<AccessToken>;
      private refreshTokenRepository: Repository<RefreshToken>;

      constructor(dataSource: DataSource) {
            this.accessTokenRepository = dataSource.getRepository(AccessToken);
            this.refreshTokenRepository = dataSource.getRepository(RefreshToken);
      }

      async run() {
            try {
                  logger.info('Token cleanup cron job started', { module: 'Remove-Revoked-Tokens-Cron' });
                  const now = new Date();

                  // Delete tokens that are EITHER revoked OR expired
                  const [accessResult, refreshResult] = await Promise.all([
                        this.accessTokenRepository.delete([
                              { isRevoked: true },
                              { expiresAt: LessThan(now) }
                        ]),
                        this.refreshTokenRepository.delete([
                              { isRevoked: true },
                              { expiresAt: LessThan(now) }
                        ])
                  ]);

                  const deletedAccess = accessResult.affected || 0;
                  const deletedRefresh = refreshResult.affected || 0;

                  if (deletedAccess > 0 || deletedRefresh > 0) {
                        logger.info(`Cleanup Successful: Removed ${deletedAccess} access tokens and ${deletedRefresh} refresh tokens (revoked or expired)`, { module: 'Remove-Revoked-Tokens-Cron' });
                  }
            } catch (error) {
                  logger.error("Error during token cleanup cron job:", error, { module: 'Remove-Revoked-Tokens-Cron' });
            }
      }
}

export const cleanTokens = (dataSource: DataSource) => new RemoveRevokedTokensCron(dataSource).run();