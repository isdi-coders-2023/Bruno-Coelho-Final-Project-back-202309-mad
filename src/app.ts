import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Import { caresRouter } from './routers/cares.routes.js';
import createDebug from 'debug';

import { errorMiddleware } from './middleware/error.middleware.js';
import { usersRouter } from './routers/users.routes.js';

const debug = createDebug('W7E:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

// App.use('/cares', caresRouter); // Todo que empiece por /cares lo redirige a caresRouter
app.use('/users', usersRouter); // Todo que empiece por /users lo redirige a usersRouter

app.use(errorMiddleware);
