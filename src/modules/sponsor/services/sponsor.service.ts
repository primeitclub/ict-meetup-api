import { DataSource, Repository } from "typeorm";
import { Sponsor } from "../entities/sponsor.entity";
import { CreateSponsorDto, UpdateSponsorDto } from "../validators/sponsor.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { Category, CategoryType } from "../../category/entities/category.entity";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";

export class SponsorService {
      private sponsorRepository: Repository<Sponsor>;
      private categoryRepository: Repository<Category>;

      constructor(dataSource: DataSource) {
            this.sponsorRepository = dataSource.getRepository(Sponsor);
            this.categoryRepository = dataSource.getRepository(Category);
      }

      async create(sponsor: CreateSponsorDto, userId: string): Promise<Sponsor> {
            const { versionId, categoryId, ...rest } = sponsor;
            
            const categoryExists = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!categoryExists) {
                  throw new AppError("Category not found", 404);
            }
            if (categoryExists.type !== CategoryType.SPONSOR) {
                  throw new AppError("Only categories of type 'sponsors' can be assigned to sponsors", 400);
            }

            // Check for unique displayOrder within category
            const existingOrder = await this.sponsorRepository.findOne({
                  where: { categoryId, displayOrder: rest.displayOrder }
            });

            if (existingOrder) {
                  throw new AppError(`Display order ${rest.displayOrder} is already taken in this category`, 400);
            }

            const sponsorData = {
                  ...rest,
                  link: rest.link || undefined,
                  versionId,
                  categoryId,
                  createdById: userId,
            };

            const newSponsor = this.sponsorRepository.create(sponsorData);
            const savedSponsor = await this.sponsorRepository.save(newSponsor);
            return savedSponsor;
      }

      async findAll(query: any) {
            const { versionId, categoryId, page = 1, limit = 10 } = query;
            
            const where: any = {};
            
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            
            // Add category type filter for sponsors
            where.category = { type: CategoryType.SPONSOR };

            const skip = (Number(page) - 1) * Number(limit);

            const [items, total] = await this.sponsorRepository.findAndCount({
                  where,
                  skip,
                  take: Number(limit),
                  relations: ['category', 'flagshipEvent'],
                  select: {
                        id: true,
                        versionId: true,
                        imagePath: true,
                        imageUrl: true,
                        name: true,
                        link: true,
                        categoryId: true,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,
                        category: {
                              id: true,
                              name: true,
                              type: true,
                              displayOrder: true,
                        },
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                        },
                  },
                  order: {
                        category: { displayOrder: 'ASC' },
                        displayOrder: 'ASC',
                        createdAt: 'DESC',
                  },
            });

            return { 
                  items, 
                  meta: { 
                        total, 
                        page: Number(page), 
                        limit: Number(limit), 
                        totalPages: Math.ceil(total / Number(limit)) 
                  } 
            };
      }

      async findById(id: string) {
            const sponsor = await this.sponsorRepository.findOne({
                  where: { id },
                  relations: ['category', 'flagshipEvent'],
                  select: {
                        id: true,
                        versionId: true,
                        imagePath: true,
                        imageUrl: true,
                        name: true,
                        link: true,
                        categoryId: true,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,
                        category: {
                              id: true,
                              name: true,
                              type: true,
                        },
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                        },
                  },
            });
            if (!sponsor) {
                  throw new AppError("Sponsor not found", 404);
            }
            return sponsor;
      }

      async update(id: string, data: UpdateSponsorDto, userId: string) {
            const sponsor = await this.findById(id);
            if (!sponsor) {
                  throw new AppError('Sponsor not found', 404);
            }

            if (data.categoryId) {
                  const categoryExists = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
                  if (!categoryExists) {
                        throw new AppError('Category not found', 404);
                  }
                  if (categoryExists.type !== CategoryType.SPONSOR) {
                        throw new AppError('Only categories of type "sponsors" can be assigned to sponsors', 400);
                  }
            }

            if (data.displayOrder) {
                  const targetCategoryId = data.categoryId || sponsor.categoryId;
                  const existingOrder = await this.sponsorRepository.findOne({
                        where: {
                              categoryId: targetCategoryId,
                              displayOrder: data.displayOrder
                        }
                  });

                  if (existingOrder && existingOrder.id !== id) {
                        throw new AppError(`Display order ${data.displayOrder} is already taken in this category`, 400);
                  }
            }

            const updateData = {
                  ...sponsor,
                  ...data,
                  link: data.link || sponsor.link || undefined,
                  versionId: data.versionId || sponsor.versionId,
                  categoryId: data.categoryId || sponsor.categoryId,
                  modifiedById: userId,
            };

            const updatedSponsor = await this.sponsorRepository.save(updateData);
            return updatedSponsor;
      }

      async delete(id: string) {
            const sponsor = await this.sponsorRepository.findOne({ where: { id } });
            if (!sponsor) {
                  throw new AppError('Sponsor not found', 404);
            }
            
            await this.sponsorRepository.remove(sponsor);
            
            if (sponsor.imagePath) {
                  await removeFile(sponsor.imagePath);
            }
            
            return { id: sponsor.id };
      }
}
