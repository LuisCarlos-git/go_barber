import { Router } from 'express';

import UserController from './app/controllers/Usercontroller';

const routes = Router();

routes.post('/users', UserController.store);

export default routes;
