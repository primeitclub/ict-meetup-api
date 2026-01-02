import { NextFunction, Request, Response } from "express";

export const responseHandler = (res: Response) => {
      return (message: string, data: any, statusCode: number) => {
            res.status(statusCode).json({
                  status: 'success',
                  message,
                  data,
            });
      };
};