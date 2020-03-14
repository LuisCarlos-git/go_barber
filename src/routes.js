import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ okay: true });
});

export default routes;
