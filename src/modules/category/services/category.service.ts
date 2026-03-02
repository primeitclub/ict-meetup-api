import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Category, CategoryType } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../validators/category.validator';

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor(dataSource: DataSource) {
    this.categoryRepository = dataSource.getRepository(Category);
  }

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'CategoryService',
      recordId,
      changes,
    });
  }

  async create(data: CreateCategoryDto, type: CategoryType, userId: string): Promise<Category> {
    logger.info(`Creating new category: ${data.name}`, {
      module: 'CategoryService',
    });

    const existing = await this.categoryRepository.findOne({
      where: { name: data.name, type: type, displayOrder: data.displayOrder, displayName: data.displayName },
    });

    if (existing) {
      throw new AppError(
        `Category with name '${data.name}' and type '${type}' and display order '${data.displayOrder}' and display name '${data.displayName}' already exists`,
        400
      );
    }
    const payload = {
      ...data,
      createdById: userId,
      type: type
    }
    const savedCategory = await this.categoryRepository.save(payload);

    await this.createAuditLog(
      'category',
      savedCategory.id,
      'CREATE',
      userId,
      savedCategory
    );

    return savedCategory;
  }

  async findAll(query: any = {}, type: CategoryType): Promise<any> {
    logger.debug('Fetching all categories', {
      module: 'CategoryService',
      query,
    });

    const { page = 1, limit = 10, versionId } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    queryBuilder.where('category.type = :type', { type });

    if (versionId) {
      let tableName = '';
      switch (type) {
        case CategoryType.TEAM:
          tableName = 'team_members';
          break;
        case CategoryType.EVENT:
          tableName = 'events';
          break;
        case CategoryType.SPEAKER:
          tableName = 'speakers';
          break;
        default:
          break;
      }

      if (tableName) {
        queryBuilder
          .innerJoin(tableName, 'target', 'target.category_id = category.id')
          .andWhere('target.version_id = :versionId', { versionId })
          .groupBy('category.id');
      }
    }

    const [items, total] = await Promise.all([
      queryBuilder
        .orderBy('category.displayOrder', 'ASC')
        .skip(skip)
        .take(Number(limit))
        .getMany(),
      queryBuilder.getCount(),
    ]);

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

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async update(
    id: string,
    type: CategoryType,
    data: UpdateCategoryDto,
    userId: string
  ): Promise<Category> {
    const category = await this.findById(id);

    logger.info(`Updating category: ${id}`, {
      module: 'CategoryService',
    });

    const oldState = { ...category };


    if (data.name) {
      const checkType = type || category.type;
      const checkName = data.name || category.name;
      const existing = await this.categoryRepository.findOne({
        where: { name: checkName, type: checkType, displayOrder: data.displayOrder, displayName: data.displayName },
      });
      if (existing && existing.id !== id) {
        throw new AppError(
          `Category with name '${checkName}' and type '${checkType}' and display order '${data.displayOrder}' and display name '${data.displayName}' already exists`,
          400
        );
      }
    }
    const payload = {
      ...data,
      modifiedById: userId,
      type: type
    }
    Object.assign(category, payload);
    const updatedCategory = await this.categoryRepository.save(category);

    await this.createAuditLog(
      'category',
      updatedCategory.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedCategory }
    );

    return updatedCategory;
  }

  async delete(id: string, type: CategoryType, userId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id, type } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    logger.warn(`Deleting category: ${id}`, {
      module: 'CategoryService',
    });

    await this.categoryRepository.remove(category);

    await this.createAuditLog(
      'category',
      id,
      'DELETE',
      userId,
      { deleted_category: category }
    );

    return;
  }
}
