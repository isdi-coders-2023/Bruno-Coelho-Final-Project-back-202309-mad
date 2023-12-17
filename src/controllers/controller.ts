import { Repository } from '../repos/repo.js';
import { NextFunction, Request, Response } from 'express';
import { MediaFiles } from '../services/media.files.js';

export abstract class Controller<T extends { id: unknown }> {
  cloudinaryService: MediaFiles;
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: Repository<T>) {
    this.cloudinaryService = new MediaFiles();
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByPage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getByPage(
        req.params.type,
        req.params.page
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.search(req.params.type);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // console.log('controller', req.body);
    try {
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.body.adminUserID, req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
