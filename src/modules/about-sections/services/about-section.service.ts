import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { AboutSection } from '../entities/about-section.entity';
import { CreateAboutSectionDto, UpdateAboutSectionDto } from '../validators/about-section.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';

export class AboutSectionService {
  private aboutSectionRepository: Repository<AboutSection>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.aboutSectionRepository = dataSource.getRepository(AboutSection);
  }

  async create(data: CreateAboutSectionDto, userId: string): Promise<AboutSection> {
    logger.info(`Creating new about section`, {
      module: 'AboutSectionService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.flagshipEventVersionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only create about sections for a flagship event version that is in "draft" status', 400);
    }

    const existing = await this.aboutSectionRepository.findOne({
      where: { flagshipEventVersionId: data.flagshipEventVersionId },
    });

    if (existing) {
      throw new AppError(
        `About section already exists for this flagship event version`,
        400
      );
    }

    const payload = {
      ...data,
      createdById: userId
    };

    const newAboutSection = this.aboutSectionRepository.create(payload);
    const savedAboutSection = await this.aboutSectionRepository.save(newAboutSection);

    return savedAboutSection;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all about sections', {
      module: 'AboutSectionService',
      query,
    });

    const { flagshipEventVersionId, page = 1, limit = 10 } = query;
    const where = flagshipEventVersionId ? { flagshipEventVersionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.aboutSectionRepository.findAndCount({
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

  async findById(id: string): Promise<AboutSection> {
    const aboutSection = await this.aboutSectionRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
    if (!aboutSection) {
      throw new AppError('About section not found', 404);
    }
    return aboutSection;
  }

  async update(
    id: string,
    data: UpdateAboutSectionDto,
    userId: string
  ): Promise<AboutSection> {
    const aboutSection = await this.findById(id);

    logger.info(`Updating about section: ${id}`, {
      module: 'AboutSectionService',
    });

    const versionId = data.flagshipEventVersionId || aboutSection.flagshipEventVersionId;
    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update about sections for an archived flagship event version', 400);
    }

    const oldState = { ...aboutSection };

    const payload = {
      ...data,
      modifiedById: userId
    };

    Object.assign(aboutSection, payload);
    const updatedAboutSection = await this.aboutSectionRepository.save(aboutSection);

    return updatedAboutSection;
  }

  async delete(id: string, userId: string): Promise<void> {
    const aboutSection = await this.findById(id);

    logger.warn(`Deleting about section: ${id}`, {
      module: 'AboutSectionService',
    });

    await this.aboutSectionRepository.remove(aboutSection);

    return;
  }
}
