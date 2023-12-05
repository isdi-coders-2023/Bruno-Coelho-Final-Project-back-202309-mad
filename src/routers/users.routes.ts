import { Router as createRouter } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W7E:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();

usersRouter.get(
  '/',
  // Opcional interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
// Register
usersRouter.post('/register', controller.create.bind(controller));
// Login
usersRouter.post('/login', controller.login.bind(controller));
// Login with token
usersRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
// Añadir update y delete (para que un usuario pueda cambiar los datos o eliminarlo)
