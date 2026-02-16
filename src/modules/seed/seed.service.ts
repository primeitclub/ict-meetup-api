import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { staticUsers } from '../../seeds/static/users.seed';
import { AppError } from '../../shared/utils/error.utils';

export class SeedService {
    private userRepository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
    }

    async seedUser(userData: any) {
        const { email, password, role, name } = userData;

        if (!email || !password || !role || !name) {
            throw new AppError('Missing required user fields: name, email, role, password', 400);
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
        for (const user of staticUsers) {
            try {
                const result = await this.seedUser(user);
                results.push(result);
            } catch (error) {
                results.push({ message: `Error seeding user ${user.email}`, status: 'failed', error: (error as any).message });
            }
        }
        return results;
    }
}
