import { DataSource, Repository } from "typeorm";
import { Speaker } from "../entities/speaker.entity";
import { CreateSpeakerDto } from "../validators/speaker.validator";
import { Category, CategoryType } from "../../category/entities/category.entity";
import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";

export class SpeakerService {
      private dataSource: DataSource;
      private speakerRepository: Repository<Speaker>;
      private categoryRepository: Repository<Category>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      constructor(dataSource: DataSource) {
            this.dataSource = dataSource;
            this.speakerRepository = dataSource.getRepository(Speaker);
            this.categoryRepository = dataSource.getRepository(Category);
            this.flagshipEventVersionRepository = dataSource.getRepository(FlagshipEventVersion);
      }

      async create(data: CreateSpeakerDto) {
            const versionExists = await this.flagshipEventVersionRepository.findOne({ where: { id: data.versionId } });
            if (!versionExists) {
                  throw new Error('Version not found');
            }
            const categoryExists = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
            if (!categoryExists) {
                  throw new Error('Category not found');
            }
            const speaker = this.speakerRepository.create(data);
            return await this.speakerRepository.save(speaker);
      }

      async findAll(query: any = {}) {
            const { versionId, categoryId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            where.category = { type: CategoryType.SPEAKER };

            const { page = 1, limit = 10 } = rest;
            const skip = (Number(page) - 1) * Number(limit);

            const [items, total] = await this.speakerRepository.findAndCount({
                  where,
                  relations: ['category', 'flagshipEvent'],
                  select: {
                        id: true,
                        // versionId: true,
                        // categoryId: true,
                        name: true,
                        designation: true,
                        company: true,
                        imagePath: true,
                        socialLinks: true as any,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,
                        // designationId: true,
                        category: {
                              id: true,
                              type: true,
                              name: true,
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

      async findById(id: string) {
            const speaker = await this.speakerRepository.findOne({
                  where: { id },
                  relations: ['category', 'flagshipEvent'],
                  select: {
                        id: true,
                        name: true,
                        designation: true,
                        company: true,
                        imagePath: true,
                        socialLinks: true as any,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,
                        category: {
                              id: true,
                              type: true,
                              name: true,
                              displayOrder: true,
                        },
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                        },
                  },
            });
            if (!speaker) {
                  throw new Error('Speaker not found');
            }
            return speaker;
      }

      async update(id: string, data: any, userId: string) {
            const speaker = await this.findById(id);
            Object.assign(speaker, data);
            speaker.modifiedById = userId;
            return await this.speakerRepository.save(speaker);
      }

      async delete(id: string, userId: string) {
            const speaker = await this.findById(id);
            await this.speakerRepository.remove(speaker);
            return { message: 'Speaker deleted successfully' };
      }

}