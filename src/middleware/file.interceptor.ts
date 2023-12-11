import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
export class FileInterceptor {
  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const options: multer.Options = {
      // Temp dest: 'uploads',
      storage: multer.diskStorage({
        destination: './public/uploads',
        filename(_req, file, callback) {
          const prefix = crypto.randomUUID();
          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize },
    };

    const middleware = multer(options).single(fileName); // Para varias imagens=> Aquicoloco  'fields'
    // Save as req.file is the 'fileName' file
    // req.body will hold the text fields, if there were any

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, next);

      req.body = { ...previousBody, ...req.body };
    };
  }
}
