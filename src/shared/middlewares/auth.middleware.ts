import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.utils";
import { envConfig } from "../config/env";
import { TokenPayload } from "../../modules/auth/interfaces/auth.interface";
import connectDatabase from "../config/typeorm/db.config";
import { AccessToken } from "../../modules/auth/entities/access-token.entity";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
      try {
            const token = req.cookies.access_token;
            if (!token) {
                  throw new AppError('Unauthorized', 401);
            }
            const decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as TokenPayload;

            const accessTokenRepository = connectDatabase.getRepository(AccessToken);
            const storedToken = await accessTokenRepository.findOne({ where: { token, isRevoked: false } });

            if (!storedToken) {
                  throw new AppError('Unauthorized - Token revoked', 401);
            }

            (req as Request & { user: TokenPayload }).user = decoded;
            next();
      } catch (error) {
            next(error);
      }
}