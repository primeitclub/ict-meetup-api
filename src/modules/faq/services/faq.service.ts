import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto, UpdateFaqDto } from '../validators/faq.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';

export class FaqService {
  private faqRepository: Repository<Faq>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.faqRepository = dataSource.getRepository(Faq);
  }

  async create(data: CreateFaqDto, userId: string): Promise<Faq> {
    logger.info(`Creating new faq: ${data.title}`, {
      module: 'FaqService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only create faqs for a flagship event version that is in "draft" status', 400);
    }

    const payload = {
      ...data,
      createdById: userId
    };
    const newFaq = this.faqRepository.create(payload);
    const savedFaq = await this.faqRepository.save(newFaq);

    return savedFaq;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all faqs', {
      module: 'FaqService',
      query,
    });

    const { versionId, page = 1, limit = 10 } = query;
    const where = versionId ? { versionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.faqRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
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

  async findById(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new AppError('Faq not found', 404);
    }
    return faq;
  }

  async update(
    id: string,
    data: UpdateFaqDto,
    userId: string
  ): Promise<Faq> {
    const faq = await this.findById(id);

    logger.info(`Updating faq: ${id}`, {
      module: 'FaqService',
    });

    const versionId = data.versionId || faq.versionId;
    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update faqs for an archived flagship event version', 400);
    }

    const oldState = { ...faq };

    const payload = {
      ...data,
      modifiedById: userId
    };
    Object.assign(faq, payload);
    const updatedFaq = await this.faqRepository.save(faq);

    return updatedFaq;
  }

  async delete(id: string, userId: string): Promise<void> {
    const faq = await this.findById(id);

    logger.warn(`Deleting faq: ${id}`, {
      module: 'FaqService',
    });

    await this.faqRepository.remove(faq);

    return;
  }
}
