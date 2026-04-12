import { DataSource, Repository } from "typeorm";
import { Speaker } from "../entities/speaker.entity";
import { CreateSpeakerDto } from "../validators/speaker.validator";

import { FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { AppError } from "../../../shared/utils/error.utils";

export class SpeakerService {
      private dataSource: DataSource;
      private speakerRepository: Repository<Speaker>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      constructor(dataSource: DataSource) {
            this.dataSource = dataSource;
            this.speakerRepository = dataSource.getRepository(Speaker);
            this.flagshipEventVersionRepository = dataSource.getRepository(FlagshipEventVersion);
      }

      async create(data: CreateSpeakerDto) {
            const versionExists = await this.flagshipEventVersionRepository.findOne({ where: { id: data.versionId } });
            if (!versionExists) {
                  throw new AppError('Version not found', 404);
            }
            if (data.displayOrder) {
                  const existingOrder = await this.speakerRepository.findOne({
                        where: { versionId: data.versionId, displayOrder: data.displayOrder }
                  });

                  if (existingOrder) {
                        throw new AppError(`Display order ${data.displayOrder} is already taken in this version`, 400);
                  }
            }

            const speaker = this.speakerRepository.create(data);
            return await this.speakerRepository.save(speaker);
      }

      async findAll(query: any = {}) {
            const { versionId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;

            const { page = 1, limit = 10 } = rest;
            const skip = (Number(page) - 1) * Number(limit);

            const [items, total] = await this.speakerRepository.findAndCount({
                  where,
                  relations: ['flagshipEvent'],
                  select: {
id: true,
                        // categoryId: true,
                        name: true,
                        designation: true,
                        company: true,
                        versionId: true,
                        imagePath: true,
                        socialLinks: true as any,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,
                        // designationId: true,

                        flagshipEvent: {
                              id: true,
                              version_name: true,
                        },
                  },
                  order: {
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
                  relations: ['flagshipEvent'],
                  select: {
id: true,
                        name: true,
                        designation: true,
                        company: true,
                        versionId: true,
                        imagePath: true,
                        socialLinks: true as any,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,

                        flagshipEvent: {
                              id: true,
                              version_name: true,
                        },
                  },
            });
            if (!speaker) {
                  throw new AppError('Speaker not found', 404);
            }
            return speaker;
      }

      async update(id: string, data: any, userId: string) {
            const speaker = await this.findById(id);
            if (!speaker) {
                  throw new AppError('Speaker not found', 404);
            }

            if (data.displayOrder) {
                  const existingOrder = await this.speakerRepository.findOne({
                        where: {
                              versionId: speaker.versionId,
                              displayOrder: data.displayOrder
                        }
                  });

                  if (existingOrder && existingOrder.id !== id) {
                        throw new AppError(`Display order ${data.displayOrder} is already taken in this version`, 400);
                  }
            }

            Object.assign(speaker, data);
            speaker.modifiedById = userId;
            return await this.speakerRepository.save(speaker);
      }

      async delete(id: string, versionId: string, userId: string) {
            const speaker = await this.speakerRepository.findOne({ where: { id, versionId } });
            if (!speaker) {
                  throw new AppError('Speaker not found in this version', 404);
            }
            await removeFile(speaker.imagePath);
            await this.speakerRepository.remove(speaker);
            return { message: 'Speaker deleted successfully' };
      }

}