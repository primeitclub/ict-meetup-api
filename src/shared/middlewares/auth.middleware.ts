import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.utils";
import { envConfig } from "../config/env";
import { TokenPayload } from "../../modules/auth/interfaces/auth.interface";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
      try {
            console.log(req.cookies);
            const token = req.cookies.access_token
            console.log(token);
            if (!token) {
                  throw new AppError('Unauthorized', 401);
            }
            const decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET);
            console.log(decoded);
            (req as Request & { user: TokenPayload }).user = decoded as TokenPayload;
            next();
      } catch (error) {
            next(error);
      }
}