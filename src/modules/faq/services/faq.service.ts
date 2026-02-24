import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto, UpdateFaqDto } from '../dto/faq.dto';

export class FaqService {
  private faqRepository: Repository<Faq>;

  constructor(dataSource: DataSource) {
    this.faqRepository = dataSource.getRepository(Faq);
  }

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'FaqService',
      recordId,
      changes,
    });
  }

  async create(data: CreateFaqDto, userId: string): Promise<Faq> {
    logger.info(`Creating new faq: ${data.title}`, {
      module: 'FaqService',
    });

    const payload = {
      ...data,
      createdById: userId
    };
    const newFaq = this.faqRepository.create(payload);
    const savedFaq = await this.faqRepository.save(newFaq);

    await this.createAuditLog(
      'faqs',
      savedFaq.id,
      'CREATE',
      userId,
      savedFaq
    );

    return savedFaq;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all faqs', {
      module: 'FaqService',
      query,
    });

    const { flagshipEventVersionId, page = 1, limit = 10 } = query;
    const where = flagshipEventVersionId ? { flagshipEventVersionId } : {};
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

    const oldState = { ...faq };

    const payload = {
      ...data,
      modifiedById: userId
    };
    Object.assign(faq, payload);
    const updatedFaq = await this.faqRepository.save(faq);

    await this.createAuditLog(
      'faqs',
      updatedFaq.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedFaq }
    );

    return updatedFaq;
  }

  async delete(id: string, userId: string): Promise<void> {
    const faq = await this.findById(id);

    logger.warn(`Deleting faq: ${id}`, {
      module: 'FaqService',
    });

    await this.faqRepository.remove(faq);

    await this.createAuditLog(
      'faqs',
      id,
      'DELETE',
      userId,
      { deleted_faq: faq }
    );

    return;
  }
}
