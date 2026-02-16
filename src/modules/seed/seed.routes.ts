import { Router } from 'express';
import { DataSource } from 'typeorm';
import { SeedController } from './seed.controller';

const createSeedRouter = (dataSource: DataSource) => {
      const seedRouter = Router();
      const seedController = new SeedController(dataSource);

      /**
       * @swagger
       * /api/seeds/init:
       *   post:
       *     summary: Seed static users
       *     tags: [Seed]
       *     responses:
       *       200:
       *         description: OK
       */
      seedRouter.post('/init', seedController.seedStaticUsers);
      seedRouter.post('/create', seedController.seedCustomUser);

      return seedRouter;
};

export default createSeedRouter;
