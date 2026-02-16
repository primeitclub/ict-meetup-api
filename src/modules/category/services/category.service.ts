import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Category, CategoryType } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

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

  async create(data: CreateCategoryDto, userId: string): Promise<Category> {
    logger.info(`Creating new category: ${data.name}`, {
      module: 'CategoryService',
    });

    const existing = await this.categoryRepository.findOne({
      where: { name: data.name, type: data.type },
    });

    if (existing) {
      throw new AppError(
        `Category with name '${data.name}' and type '${data.type}' already exists`,
        400
      );
    }

    const newCategory = this.categoryRepository.create(data);
    const savedCategory = await this.categoryRepository.save(newCategory);

    await this.createAuditLog(
      'category',
      savedCategory.id,
      'CREATE',
      userId,
      savedCategory
    );

    return savedCategory;
  }

  async findAll(type?: CategoryType): Promise<Category[]> {
    logger.debug('Fetching all categories', {
      module: 'CategoryService',
      type,
    });

    const where = type ? { type } : {};
    return await this.categoryRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
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
    data: UpdateCategoryDto,
    userId: string
  ): Promise<Category> {
    const category = await this.findById(id);

    logger.info(`Updating category: ${id}`, {
      module: 'CategoryService',
    });

    const oldState = { ...category };


    if (data.name || data.type) {
      const checkType = data.type || category.type;
      const checkName = data.name || category.name;
      const existing = await this.categoryRepository.findOne({
        where: { name: checkName, type: checkType },
      });
      if (existing && existing.id !== id) {
        throw new AppError(
          `Category with name '${checkName}' and type '${checkType}' already exists`,
          400
        );
      }
    }

    Object.assign(category, data);
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

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const category = await this.findById(id);

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

    return { message: 'Category deleted successfully' };
  }
}
