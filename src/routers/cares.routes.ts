import { Router as createRouter } from 'express';
import { CaresController } from '../controllers/cares.controller.js';
import createDebug from 'debug';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('BC:cares:router');

export const caresRouter = createRouter();
debug('Starting');

const repo = new CaresMongoRepo();
const controller = new CaresController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

caresRouter.get('/', controller.getAll.bind(controller));

caresRouter.get('/search/type/:type', controller.search.bind(controller));

caresRouter.get(
  '/search/type/:type/:page',
  controller.getByPage.bind(controller)
);

caresRouter.post(
  '/', // Antes estaba con '/create' por las indicaciones de Sergi y elias le puso solo '/'
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  fileInterceptor.singleFileStore('careImg').bind(fileInterceptor),
  controller.create.bind(controller)
);

caresRouter.patch(
  '/update/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  controller.update.bind(controller)
);

caresRouter.delete(
  '/delete/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  controller.delete.bind(controller)
);
