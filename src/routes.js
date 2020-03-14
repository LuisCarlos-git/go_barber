import { Router } from 'express';
import User from './app/models/User';

const routes = Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Luis Carlos',
    email: 'luiscarlos@gmail.com',
    password_hash: '1234',
  });

  return res.json(user);
});

export default routes;
