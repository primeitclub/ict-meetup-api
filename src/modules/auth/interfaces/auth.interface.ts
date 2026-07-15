import { Request } from "express";

export interface TokenPayload {
      userId: string;
      email: string;
      role: string;
}
export interface AuthenticatedRequest extends Request {
      user: TokenPayload;
}