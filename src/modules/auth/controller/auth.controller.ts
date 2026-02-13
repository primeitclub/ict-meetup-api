import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/auth.dto";

import { responseHandler } from "../../../shared/utils/helpers/response.helper";
import { TokenPayload } from "../interfaces/auth.interface";
import { AppError } from "../../../shared/utils/error.utils";
import { parseExpiryToMs, clearCookie, setCookie } from "../../../shared/utils/common.utils";
import { envConfig } from "../../../shared/config/env";

export class AuthController {
      private authService: AuthService;
      constructor() {
            this.authService = new AuthService();
      }

      login = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const loginDto: LoginDto = req.body;
                  const ipAddress = req.ip || 'unknown';
                  const userAgent = req.headers['user-agent'] || 'unknown';
                  const data: LoginDto = {
                        ...loginDto,
                        ipAddress,
                        userAgent,
                  };
                  const result = await this.authService.login(data);
                  const accessTokenCookie = setCookie('access_token', result.accessToken, { maxAge: parseExpiryToMs(envConfig.JWT_ACCESS_EXPIRY) });
                  const refreshTokenCookie = setCookie('refresh_token', result.refreshToken, { maxAge: parseExpiryToMs(envConfig.JWT_REFRESH_EXPIRY) });
                  res.cookie(accessTokenCookie.name, accessTokenCookie.value, accessTokenCookie.options);
                  res.cookie(refreshTokenCookie.name, refreshTokenCookie.value, refreshTokenCookie.options);
                  responseHandler(res)("Login successful", null, 200);
            } catch (error) {
                  next(error);
            }
      }

      logout = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = (req as Request & { user: TokenPayload }).user.userId;
                  await this.authService.logout(userId);
                  const accessTokenCookie = clearCookie('access_token');
                  const refreshTokenCookie = clearCookie('refresh_token');
                  res.clearCookie(accessTokenCookie.name);
                  res.clearCookie(refreshTokenCookie.name);
                  responseHandler(res)("Logout successful", null, 200);
            } catch (error) {
                  next(error);
            }
      }

      refreshToken = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const refreshToken = req.cookies.refresh_token;
                  if (!refreshToken) {
                        throw new AppError('Refresh token not found', 401);
                  }
                  const ipAddress = req.ip || 'unknown';
                  const userAgent = req.headers['user-agent'] || 'unknown';
                  const result = await this.authService.refreshToken(refreshToken, ipAddress, userAgent);
                  const accessTokenCookie = setCookie('access_token', result.accessToken, { maxAge: parseExpiryToMs(envConfig.JWT_ACCESS_EXPIRY) });
                  const refreshTokenCookie = setCookie('refresh_token', result.refreshToken, { maxAge: parseExpiryToMs(envConfig.JWT_REFRESH_EXPIRY) });
                  res.cookie(accessTokenCookie.name, accessTokenCookie.value, accessTokenCookie.options);
                  res.cookie(refreshTokenCookie.name, refreshTokenCookie.value, refreshTokenCookie.options);
                  responseHandler(res)("Refresh token successful", null, 200);
            } catch (error) {
                  next(error);
            }
      }
}