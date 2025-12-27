import { Request, Response } from "express";

export const uploadUserAvatar = async (req: Request, res: Response) => {
  const image = req.body.image;

  return res.status(201).json({
    message: "Image uploaded successfully",
    image,
  });
};
