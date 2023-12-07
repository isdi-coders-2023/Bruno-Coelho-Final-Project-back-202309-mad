import { Router as createRouter } from 'express';
import { CaresController } from '../controllers/cares.controller.js';
import createDebug from 'debug';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
// A import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('BC:cares:router');

export const caresRouter = createRouter();
debug('Starting');

const repo = new CaresMongoRepo();
const controller = new CaresController(repo);
const interceptor = new AuthInterceptor();
// A const fileInterceptor = new FileInterceptor();

// GET all cares
caresRouter.get('/all', controller.getAll.bind(controller));

// GET care by type
caresRouter.get('/search/type/:type', controller.search.bind(controller));

// GET cares by page
caresRouter.get(
  '/search/type/:type/:page',
  controller.getByPage.bind(controller)
);

// GET care by ID
// caresRouter.get('/search/id/:id', controller.getById.bind(controller));

// POST create care
caresRouter.post(
  '/create',
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  // A fileInterceptor.singleFileStore('careFrontImg').bind(fileInterceptor),
  controller.create.bind(controller)
);

// PATCH update care
caresRouter.patch(
  '/update/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  controller.update.bind(controller)
);

// DELETE delete care
caresRouter.delete(
  '/delete/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.adminAuthentication.bind(interceptor),
  controller.delete.bind(controller)
);
