import { NextFunction, Request, Response } from "express";

export const responseHandler = (_req: Request, res: Response, _next: NextFunction) => {
      return (message: string, data: any, statusCode: number) => {
            res.status(statusCode).json({
                  status: 'success',
                  message,
                  data,
            });
      };
};