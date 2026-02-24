import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { HeroSection } from '../entities/hero-section.entity';
import { CreateHeroSectionDto, UpdateHeroSectionDto } from '../dto/hero-section.dto';

export class HeroSectionService {
  private heroSectionRepository: Repository<HeroSection>;

  constructor(dataSource: DataSource) {
    this.heroSectionRepository = dataSource.getRepository(HeroSection);
  }

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'HeroSectionService',
      recordId,
      changes,
    });
  }

  async create(data: CreateHeroSectionDto, userId: string): Promise<HeroSection> {
    logger.info(`Creating new hero section`, {
      module: 'HeroSectionService',
    });

    const existing = await this.heroSectionRepository.findOne({
      where: { flagshipEventVersionId: data.flagshipEventVersionId },
    });

    if (existing) {
      throw new AppError(
        `Hero section already exists for this flagship event version`,
        400
      );
    }

    const payload = {
      ...data,
      createdById: userId
    };

    const newHeroSection = this.heroSectionRepository.create(payload);
    const savedHeroSection = await this.heroSectionRepository.save(newHeroSection);

    await this.createAuditLog(
      'hero_sections',
      savedHeroSection.id,
      'CREATE',
      userId,
      savedHeroSection
    );

    return savedHeroSection;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all hero sections', {
      module: 'HeroSectionService',
      query,
    });

    const { flagshipEventVersionId, page = 1, limit = 10 } = query;
    const where = flagshipEventVersionId ? { flagshipEventVersionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.heroSectionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
      relations: ['flagshipEventVersion'],
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    };
  }

  async findById(id: string): Promise<HeroSection> {
    const heroSection = await this.heroSectionRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
    if (!heroSection) {
      throw new AppError('Hero section not found', 404);
    }
    return heroSection;
  }

  async update(
    id: string,
    data: UpdateHeroSectionDto,
    userId: string
  ): Promise<HeroSection> {
    const heroSection = await this.findById(id);

    logger.info(`Updating hero section: ${id}`, {
      module: 'HeroSectionService',
    });

    const oldState = { ...heroSection };

    const payload = {
      ...data,
      modifiedById: userId
    };

    Object.assign(heroSection, payload);
    const updatedHeroSection = await this.heroSectionRepository.save(heroSection);

    await this.createAuditLog(
      'hero_sections',
      updatedHeroSection.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedHeroSection }
    );

    return updatedHeroSection;
  }

  async delete(id: string, userId: string): Promise<void> {
    const heroSection = await this.findById(id);

    logger.warn(`Deleting hero section: ${id}`, {
      module: 'HeroSectionService',
    });

    await this.heroSectionRepository.remove(heroSection);

    await this.createAuditLog(
      'hero_sections',
      id,
      'DELETE',
      userId,
      { deleted_hero_section: heroSection }
    );

    return;
  }
}
