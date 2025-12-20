import { Request, Response } from 'express';
import { SeedService } from './seed.service';

export class SeedController {
    private seedService: SeedService;

    constructor() {
        this.seedService = new SeedService();
    }

    seedStaticUsers = async (req: Request, res: Response) => {
        try {
            const result = await this.seedService.seedStaticUsers();
            res.status(200).json({
                message: 'Static user seeding process completed',
                details: result
            });
        } catch (error) {
            console.error('Seeding error:', error);
            res.status(500).json({ error: 'Internal server error during seeding' });
        }
    }

    seedCustomUser = async (req: Request, res: Response) => {
        try {
            const start = performance.now();
            const userData = req.body;
            const result = await this.seedService.seedUser(userData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: (error as any).message });
        }
    }
}
