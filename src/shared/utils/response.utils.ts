import { Response } from "express";

export const sendResponse = (res: Response, message: string, data: any, statusCode: number) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};
