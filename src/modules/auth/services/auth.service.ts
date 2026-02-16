import { DataSource, Repository } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { LoginDto } from "../dto/auth.dto";
import { AppError } from "../../../shared/utils/error.utils";
import bcrypt from "bcrypt";
import { envConfig } from "../../../shared/config/env";
import jwt from "jsonwebtoken";
import { AccessToken } from "../entities/access-token.entity";
import { RefreshToken } from "../entities/refresh-token.entity";
import { TokenPayload } from "../interfaces/auth.interface";
import { parseExpiryToMs, parseExpiryToSeconds } from "../../../shared/utils/common.utils";

export class AuthService {
      private accessTokenRepository: Repository<AccessToken>;
      private refreshTokenRepository: Repository<RefreshToken>;
      private userRepository: Repository<User>;

      constructor(dataSource: DataSource) {
            this.accessTokenRepository = dataSource.getRepository(AccessToken);
            this.refreshTokenRepository = dataSource.getRepository(RefreshToken);
            this.userRepository = dataSource.getRepository(User);
      }

      public async login(data: LoginDto) {
            const user = await this.userRepository.findOne({ where: { email: data.email }, select: ['id', 'email', 'password', 'role'] });
            if (!user) {
                  throw new AppError('User not found', 404);
            }
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                  throw new AppError('Invalid password', 401);
            }
            const payload: TokenPayload = {
                  userId: user.id,
                  email: user.email,
                  role: user.role,
            };
            const tokens = await this.generateTokens(payload);
            console.log(tokens);
            console.log(user)
            await this.accessTokenRepository.save({
                  userId: user.id,
                  token: tokens.accessToken,
                  expiresAt: new Date(Date.now() + parseExpiryToMs(envConfig.JWT_ACCESS_EXPIRY)),
                  ipAddress: data.ipAddress,
                  userAgent: data.userAgent,
            });

            await this.refreshTokenRepository.save({
                  userId: user.id,
                  token: tokens.refreshToken,
                  expiresAt: new Date(Date.now() + parseExpiryToMs(envConfig.JWT_REFRESH_EXPIRY)),
                  ipAddress: data.ipAddress,
                  userAgent: data.userAgent,
            });

            return tokens;
      }

      private async generateAccessToken(payload: TokenPayload) {
            return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: parseExpiryToSeconds(envConfig.JWT_ACCESS_EXPIRY) });
      }

      private async generateRefreshToken(payload: TokenPayload) {
            return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: parseExpiryToSeconds(envConfig.JWT_REFRESH_EXPIRY) });
      }

      private async generateTokens(payload: TokenPayload) {
            const accessToken = await this.generateAccessToken(payload);
            const refreshToken = await this.generateRefreshToken(payload);
            return { accessToken, refreshToken };
      }

      public async logout(userId: string) {
            await this.accessTokenRepository.update({ userId }, { isRevoked: true });
            await this.refreshTokenRepository.update({ userId }, { isRevoked: true });
            return { message: 'Logged out successfully' };
      }

      public async refreshToken(refreshToken: string, ipAddress: string, userAgent: string) {
            try {
                  jwt.verify(refreshToken, envConfig.JWT_REFRESH_SECRET);
            } catch (error) {
                  throw new AppError("Invalid refresh token", 401);
            }

            const storedToken = await this.refreshTokenRepository.findOne({
                  where: {
                        token: refreshToken,
                        isRevoked: false,
                  },
                  relations: ["user"],
            });

            if (!storedToken) {
                  throw new AppError("Invalid refresh token", 401);
            }
            // Check if token has expired
            if (new Date() > storedToken.expiresAt) {
                  // Revoke the expired token
                  storedToken.isRevoked = true;
                  await this.refreshTokenRepository.save(storedToken);
                  throw new AppError("Refresh token has expired", 401);
            }

            // Revoke the old refresh token (rotation strategy for security)
            storedToken.isRevoked = true;
            await this.refreshTokenRepository.save(storedToken);

            // Generate new tokens
            const payload: TokenPayload = {
                  userId: storedToken.user.id,
                  email: storedToken.user.email,
                  role: storedToken.user.role,
            };

            const tokens = await this.generateTokens(payload);

            // Revoke old access token for this device
            await this.accessTokenRepository.update(
                  { userId: storedToken.user.id, ipAddress, userAgent, isRevoked: false },
                  { isRevoked: true }
            );

            // Save new access token record
            await this.accessTokenRepository.save({
                  userId: storedToken.user.id,
                  token: tokens.accessToken,
                  expiresAt: new Date(Date.now() + parseExpiryToMs(envConfig.JWT_ACCESS_EXPIRY)),
                  ipAddress,
                  userAgent,
            });

            // Save new refresh token record
            await this.refreshTokenRepository.save({
                  userId: storedToken.user.id,
                  token: tokens.refreshToken,
                  expiresAt: new Date(Date.now() + parseExpiryToMs(envConfig.JWT_REFRESH_EXPIRY)),
                  ipAddress,
                  userAgent,
            });

            return tokens;
      }
}