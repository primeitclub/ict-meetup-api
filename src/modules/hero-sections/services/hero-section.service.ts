import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { HeroSection } from '../entities/hero-section.entity';
import { CreateHeroSectionDto, UpdateHeroSectionDto } from '../validators/hero-section.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';

export class HeroSectionService {
  private heroSectionRepository: Repository<HeroSection>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.heroSectionRepository = dataSource.getRepository(HeroSection);
  }

  async create(data: CreateHeroSectionDto, userId: string): Promise<HeroSection> {
    logger.info(`Creating new hero section`, {
      module: 'HeroSectionService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.flagshipEventVersionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }


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

    return savedHeroSection;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all hero sections', {
      module: 'HeroSectionService',
      query,
    });

    const { flagshipEventVersionId, page = 1, limit = 10 } = query;
    const where = flagshipEventVersionId ? { flagshipEventVersionId } : {};
    const parsedLimit = Math.min(Number(limit) || 10, 100);
    const skip = (Number(page) - 1) * parsedLimit;

    const [items, total] = await this.heroSectionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: parsedLimit,
      relations: ['flagshipEventVersion'],
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
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

    // Only validate the target version when it is being changed to a different one.
    if (data.flagshipEventVersionId && data.flagshipEventVersionId !== heroSection.flagshipEventVersionId) {
      const versionExists = await this.dataSource
        .getRepository(FlagshipEventVersion)
        .findOne({ where: { id: data.flagshipEventVersionId } });

      if (!versionExists) {
        throw new AppError('Flagship event version not found', 404);
      }
      if (versionExists.status === EventVersionStatus.ARCHIVED) {
        throw new AppError('Cannot move hero section to an archived flagship event version', 400);
      }
    }

    // Strip empty-string version to avoid overwriting with blank FK.
    const { flagshipEventVersionId, ...rest } = data;
    const safeData = {
      ...rest,
      ...(flagshipEventVersionId ? { flagshipEventVersionId } : {}),
    };

    const payload = {
      ...safeData,
      modifiedById: userId
    };

    Object.assign(heroSection, payload);
    const updatedHeroSection = await this.heroSectionRepository.save(heroSection);

    return updatedHeroSection;
  }

  async delete(id: string, userId: string): Promise<void> {
    const heroSection = await this.findById(id);

    logger.warn(`Deleting hero section: ${id}`, {
      module: 'HeroSectionService',
    });

    await this.heroSectionRepository.remove(heroSection);

    return;
  }

  // Delete every hero section belonging to a version (cascade on version delete).
  // Pass `manager` to run inside the version-delete transaction. Hero sections
  // hold no uploaded files, so this is rows-only.
  async deleteByVersion(versionId: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(HeroSection) : this.heroSectionRepository;
    const rows = await repo.find({ where: { flagshipEventVersionId: versionId } });
    if (!rows.length) return;

    logger.warn(`Deleting ${rows.length} hero section(s) for version ${versionId}`, {
      module: 'HeroSectionService',
    });

    await repo.remove(rows);
  }
}
