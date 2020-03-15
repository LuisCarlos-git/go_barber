import { Router } from 'express';

import UserController from './app/controllers/Usercontroller';
import SessionControler from './app/controllers/SessionControler';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionControler.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
