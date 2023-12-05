import createDeug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';

const debug = createDeug('W7E:auth:interceptor');

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

  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      // Eres el usuario
      const userID = req.body.id;
      // Queres actuar sobre la care req.params.id
      const userToAddID = req.params.id;
      const repoUsers = new UsersMongoRepo();
      const user = await repoUsers.getById(userToAddID);
      if (user.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }
}

// Import createDeug from 'debug';
// import { Request, Response, NextFunction } from 'express';
// import { HttpError } from '../types/http.error.js';
// import { Auth } from '../services/auth.js';
// import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo.js';

// const debug = createDeug('auth:interceptor');

// export class AuthInterceptor {
//   constructor() {
//     debug('Instantiated');
//   }

//   authorization(req: Request, res: Response, next: NextFunction) {
//     try {
//       const tokenHeader = req.get('Authorization');
//       if (!tokenHeader?.startsWith('Bearer'))
//         throw new HttpError(401, 'Unauthorized');
//       const token = tokenHeader.split(' ')[1];
//       const tokenPayload = Auth.verifyAndGetPayload(token);
//       req.body.id = tokenPayload.id;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }

//   async authenticationCares(req: Request, res: Response, next: NextFunction) {
//     try {
//       // Eres el usuario
//       const userID = req.body.id; // Explicación: userId equivaldría a tokenUserId (para poder entender mejor de dónde viene)
//       // Queres actuar sobre la care req.params.id
//       const careId = req.params.id;
//       const repoCares = new CaresMongoRepo();
//       const care = await repoCares.getById(careId);
//       if (care.client.id !== userID)
//         throw new HttpError(401, 'Unauthorized', 'User not valid');
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// }
