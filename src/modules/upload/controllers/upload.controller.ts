import { NextFunction, Request, Response } from 'express';
import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';

export const createUploadController = () => {
  
   //Upload single image
  
  const uploadSingle = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { version, moduleName } = req.params;
    
    const middleware = imageUploadHandler(version, moduleName, {
      fieldName: 'image',
      multiple: false,
    });
    
    middleware(req, res, (err) => {
      if (err) {
        return next(err);
      }
      
      const uploadedImage = req.body.uploadedImages;
      
      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: uploadedImage,
      });
    });
  };

  
   //Upload multiple images

  const uploadMultiple = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { version, moduleName } = req.params;
    const maxCount = parseInt(req.query.maxCount as string) || 10;
    
    const middleware = imageUploadHandler(version, moduleName, {
      fieldName: 'images',
      multiple: true,
      maxCount,
    });
    
    middleware(req, res, (err) => {
      if (err) {
        return next(err);
      }
      
      const uploadedImages = req.body.uploadedImages;
      
      return res.status(201).json({
        success: true,
        message: `${uploadedImages.length} images uploaded successfully`,
        data: uploadedImages,
      });
    });
  };

  return {
    uploadSingle,
    uploadMultiple,
  };
};
