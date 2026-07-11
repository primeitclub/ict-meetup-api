import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { SeedController } from './seed.controller';
import { createAuthenticate } from '../../shared/middlewares/auth.middleware';
import { envConfig } from '../../shared/config/env';

const createSeedRouter = (dataSource: DataSource) => {
      const seedRouter = Router();
      const seedController = new SeedController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      const blockInProd = (_req: Request, res: Response, next: NextFunction) => {
            if (envConfig.NODE_ENV === 'prod') {
                  return res.status(403).json({ status: 'error', message: 'Seeding is disabled in production' });
            }
            next();
      };

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
      seedRouter.post('/init', blockInProd,seedController.seedStaticUsers);
      seedRouter.post('/create', blockInProd, authenticate, seedController.seedCustomUser);

      return seedRouter;
};

export default createSeedRouter;
