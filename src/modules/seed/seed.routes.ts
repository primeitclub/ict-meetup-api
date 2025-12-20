import { Router } from 'express';
import { SeedController } from './seed.controller';

const seedRouter = Router();
const seedController = new SeedController();

seedRouter.post('/init', seedController.seedStaticUsers);
seedRouter.post('/create', seedController.seedCustomUser);

export default seedRouter;
