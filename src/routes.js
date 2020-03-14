import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.json({ okay: true }));

export default routes;
