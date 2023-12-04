import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repository } from '../repos/repo.js';
import { Care } from '../entities/care.js';
import { Controller } from './controller.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('Services:controller');
export class CaresMongoRepo extends Controller<Care> {
  constructor(protected repo: Repository<Care>) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.creator = { id: req.body.userId };
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.filmFrontImg = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
