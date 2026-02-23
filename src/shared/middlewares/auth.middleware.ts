import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.utils";
import { envConfig } from "../config/env";
import { TokenPayload } from "../../modules/auth/interfaces/auth.interface";
import { AccessToken } from "../../modules/auth/entities/access-token.entity";

export const createAuthenticate = (dataSource: DataSource) =>
      async (req: Request, _res: Response, next: NextFunction) => {
            try {
                  const token = req.cookies.access_token;
                  if (!token) {
                        throw new AppError('Unauthorized', 401);
                  }

                  let decoded: TokenPayload;
                  try {
                        decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as TokenPayload;
                  } catch (jwtErr) {
                        throw new AppError('Unauthorized - Invalid or expired token', 401);
                  }

                  const accessTokenRepository = dataSource.getRepository(AccessToken);
                  const storedToken = await accessTokenRepository.findOne({ where: { token, isRevoked: false } });

                  if (!storedToken) {
                        throw new AppError('Unauthorized - Token revoked', 401);
                  }

                  (req as Request & { user: TokenPayload }).user = decoded;
                  next();
            } catch (error) {
                  next(error);
            }
      };