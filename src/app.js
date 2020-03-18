import express from 'express';

import routes from './routes';

import './database/index'; // arquivo de configuração do banco de dados

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // usar o json
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
