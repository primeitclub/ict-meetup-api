import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import connectDatabase from '../../shared/config/typeorm/db.config';
import { staticUsers } from '../../seeds/static/users.seed';

export class SeedService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = connectDatabase.getRepository(User);
    }

    async seedUser(userData: any) {
        const { email, password, role, name } = userData;

        if (!email || !password || !role || !name) {
            throw new Error('Missing required user fields: name, email, role, password');
        }

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            return { message: `User ${email} already exists`, status: 'skipped', email };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            email,
            name,
            role,
            password: hashedPassword
        });

        await this.userRepository.save(newUser);
        return { message: `User ${email} seeded successfully`, status: 'seeded', email };
    }

    async seedStaticUsers() {
        const results = [];
        console.log('Seeding static users...');
        for (const user of staticUsers) {
            try {
                const result = await this.seedUser(user);
                results.push(result);
            } catch (error) {
                console.error(`Error seeding user ${user.email}:`, error);
                results.push({ message: `Error seeding user ${user.email}`, status: 'failed', error: (error as any).message });
            }
        }
        return results;
    }
}
