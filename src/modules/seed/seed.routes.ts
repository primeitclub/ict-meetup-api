import { Router } from 'express';
import { SeedController } from './seed.controller';

const seedRouter = Router();
const seedController = new SeedController();

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

export default seedRouter;
