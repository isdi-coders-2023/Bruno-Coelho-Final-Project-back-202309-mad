import createDebug from 'debug'; // Corregir aquí
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';

const debug = createDebug('BC:auth:interceptor'); // Corregir aquí

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.adminUserID = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async adminAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.body.adminUserID;
      const repoUsers = new UsersMongoRepo();
      const user = await repoUsers.getById(userID);
      if (!user.admin)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }
}
