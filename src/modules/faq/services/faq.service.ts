import { DataSource, EntityManager, Repository } from 'typeorm';
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

  async create(data: CreateFaqDto, userId: string): Promise<Faq[]> {
    logger.info(`Creating ${data.faqs.length} faq(s) for version ${data.versionId}`, {
      module: 'FaqService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    const newFaqs = data.faqs.map((item, index) =>
      this.faqRepository.create({
        versionId: data.versionId,
        title: item.title,
        description: item.description,
        order: index,
        createdById: userId,
      })
    );

    return this.faqRepository.save(newFaqs);
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
      order: { order: 'ASC', createdAt: 'ASC' },
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

  // Returns every faq bucketed under its version — one call powers a
  // "version → its faqs" table on the frontend.
  async findAllGroupedByVersion(): Promise<any> {
    logger.debug('Fetching all faqs grouped by version', {
      module: 'FaqService',
    });

    const faqs = await this.faqRepository.find({
      relations: ['flagshipEventVersion'],
      order: { order: 'ASC', createdAt: 'ASC' },
    });

    const groups = new Map<string, any>();
    for (const faq of faqs) {
      const version = faq.flagshipEventVersion;
      if (!groups.has(faq.versionId)) {
        groups.set(faq.versionId, {
          versionId: faq.versionId,
          versionName: version?.version_name ?? null,
          versionNumber: version?.version_number ?? null,
          status: version?.status ?? null,
          faqs: [],
        });
      }
      groups.get(faq.versionId).faqs.push({
        id: faq.id,
        title: faq.title,
        description: faq.description,
        order: faq.order,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      });
    }

    const items = Array.from(groups.values()).sort(
      (a, b) => (Number(b.versionNumber) || 0) - (Number(a.versionNumber) || 0)
    );

    return { items, meta: { totalVersions: items.length } };
  }

  async findById(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new AppError('Faq not found', 404);
    }
    return faq;
  }

  // Version-based sync: the submitted array becomes the full set of faqs for the
  // version — items with an id are updated, items without an id are created, and
  // any existing faq omitted from the array is deleted. All in one transaction.
  async syncByVersion(
    versionId: string,
    faqs: UpdateFaqDto['faqs'],
    userId: string
  ): Promise<Faq[]> {
    logger.info(`Syncing ${faqs.length} faq(s) for version ${versionId}`, {
      module: 'FaqService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update faqs for an archived flagship event version', 400);
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Faq);
      const existing = await repo.find({ where: { versionId } });
      const existingById = new Map(existing.map((faq) => [faq.id, faq]));

      const incomingIds = new Set(
        faqs.filter((item) => item.id).map((item) => item.id as string)
      );

      // Every provided id must already belong to this version.
      for (const id of incomingIds) {
        if (!existingById.has(id)) {
          throw new AppError(`Faq ${id} does not belong to this version`, 400);
        }
      }

      // Delete faqs the client removed from the array.
      const toDelete = existing.filter((faq) => !incomingIds.has(faq.id));
      if (toDelete.length) {
        await repo.remove(toDelete);
      }

      // Update existing + create new. `order` is always set from the item's
      // position in the submitted array — this is the single source of truth
      // for display order, independent of createdAt/updatedAt.
      const toSave = faqs.map((item, index) => {
        if (item.id) {
          const current = existingById.get(item.id)!;
          current.title = item.title;
          current.description = item.description;
          current.order = index;
          current.modifiedById = userId;
          return current;
        }
        return repo.create({
          versionId,
          title: item.title,
          description: item.description,
          order: index,
          createdById: userId,
        });
      });

      return toSave.length ? repo.save(toSave) : [];
    });
  }

  // Delete every faq belonging to a version. Used when its parent flagship
  // event version is deleted (cascade). Pass `manager` to run inside the
  // version-delete transaction. Faqs hold no files, so this is rows-only.
  async deleteByVersion(versionId: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Faq) : this.faqRepository;
    const rows = await repo.find({ where: { versionId } });
    if (!rows.length) return;

    logger.warn(`Deleting ${rows.length} faq(s) for version ${versionId}`, {
      module: 'FaqService',
    });

    await repo.remove(rows);
  }

}
