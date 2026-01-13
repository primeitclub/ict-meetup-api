import { Response } from "express";

export const responseHandler = (res: Response) => {
      return (message: string, data: any = null, statusCode: number) => {
            res.status(statusCode).json({
                  status: 'success',
                  message,
                  ...(data ? { data } : {}),
            });
      };
};