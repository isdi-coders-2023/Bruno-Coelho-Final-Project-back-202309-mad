import { Router as createRouter } from 'express';
import { CaresController } from '../controllers/cares.controller.js';
import createDebug from 'debug';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('EPV:clothes:router');

export const clothesRouter = createRouter();
debug('Starting');

const repo = new CaresMongoRepo();
const controller = new CaresMongoRepo(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

clothesRouter.get(
  '/',
  // Opcional interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
clothesRouter.get('/search', controller.search.bind(controller));
clothesRouter.get('/:id', controller.getById.bind(controller));
// Revisar para cambiar por fields y que lo pueda hacer el admin
clothesRouter.post(
  '/',
  interceptor.authorization.bind(interceptor),
  fileInterceptor.singleFileStore('clothingItemFrontImg').bind(fileInterceptor),
  controller.create.bind(controller)
);
// Revisar para que lo pueda hacer el admin
clothesRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.authenticationClothes.bind(interceptor),
  controller.update.bind(controller)
);
clothesRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  // Los usuarios borran lo suyo -> interceptor.authenticationClothes.bind(interceptor),
  // Los admin pueden borrar
  interceptor.isAdmin.bind(interceptor),
  controller.delete.bind(controller)
);
