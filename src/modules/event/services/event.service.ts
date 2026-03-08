import { DataSource, Repository } from "typeorm";
import { Event as EventEntity, EventStatus } from "../entities/event.entity";
import { CreateEventDto, UpdateEventDto } from "../validators/event.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { Category, CategoryType } from "../../category/entities/category.entity";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { Speaker } from "../../speaker/entities/speaker.entity";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";

export class EventService {
      private eventRepository: Repository<EventEntity>;
      private categoryRepository: Repository<Category>;
      private speakerRepository: Repository<Speaker>;
      private versionRepository: Repository<FlagshipEventVersion>;

      constructor(dataSource: DataSource) {
            this.eventRepository = dataSource.getRepository(EventEntity);
            this.categoryRepository = dataSource.getRepository(Category);
            this.speakerRepository = dataSource.getRepository(Speaker);
            this.versionRepository = dataSource.getRepository(FlagshipEventVersion);
      }

      async create(event: CreateEventDto, userId: string): Promise<EventEntity> {
            const { versionId, categoryId, ...rest } = event;
            const versionExists = await this.versionRepository.findOne({ where: { id: versionId } });
            const categoryExists = await this.categoryRepository.findOne({ where: { id: categoryId } });

            if (!versionExists || !categoryExists) {
                  throw new AppError("Version or Category not found", 404);
            }
            if (versionExists.status === EventVersionStatus.ARCHIVED) {
                  throw new AppError("Version is archived, must be draft or published to create event", 400);
            }

            if (categoryExists.type !== CategoryType.EVENT) {
                  throw new AppError("Only categories of type 'events' can be assigned to events", 400);
            }

            if (event.speakerId) {
                  const speaker = await this.speakerRepository.findOne({ where: { id: event.speakerId, versionId } });
                  if (!speaker) {
                        throw new AppError("Speaker not found", 404);
                  }
            }

            // Check for unique displayOrder within category
            const existingOrder = await this.eventRepository.findOne({
                  where: { categoryId, displayOrder: rest.displayOrder }
            });

            if (existingOrder) {
                  throw new AppError(`Display order ${rest.displayOrder} is already taken in this category`, 400);
            }

            const newEvent = this.eventRepository.create({
                  title: rest.title,
                  subtitle: rest.subtitle,
                  description: rest.description,
                  imagePath: rest.imagePath,
                  startTime: rest.startTime,
                  endTime: rest.endTime,
                  date: rest.date,
                  totalSeats: rest.totalSeats,
                  feeType: rest.feeType,
                  fee: rest.fee,
                  location: rest.location,
                  status: rest.status,
                  registrationDeadline: rest.registrationDeadline,
                  displayOrder: rest.displayOrder,
                  versionId,
                  categoryId,
                  speakerId: event.speakerId,
                  createdById: userId,
            });

            const savedEvent = await this.eventRepository.save(newEvent);

            return savedEvent;
      }

      async findAll(query: any) {
            const { versionId, categoryId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            const { page = 1, limit = 10 } = rest;
            const skip = (Number(page) - 1) * Number(limit);
            const [items, total] = await this.eventRepository.findAndCount({
                  where,
                  skip,
                  take: Number(limit),
                  relations: ['flagshipEvent', 'category', 'speaker'],
                  select: {
                        id: true,
                        versionId: true,
                        categoryId: true,
                        speakerId: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        imagePath: true,
                        startTime: true,
                        endTime: true,
                        date: true,
                        totalSeats: true,
                        feeType: true,
                        fee: true,
                        location: true,
                        status: true,
                        registrationDeadline: true,
                        displayOrder: true,
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                              status: true,
                        },
                        category: {
                              id: true,
                              name: true,
                              type: true,
                        },
                        speaker: {
                              id: true,
                              name: true,
                              designation: true,
                              imagePath: true,
                              socialLinks: true,
                        },
                  },
                  order: {
                        displayOrder: 'ASC',
                  }
            });
            return { items, meta: { total, page, limit, totalPages: Math.ceil(total / Number(limit)) } };
      }

      async findById(id: string) {
            const event = await this.eventRepository.findOne({
                  where: { id },
                  relations: ['flagshipEvent', 'category', 'speaker'],
                  select: {
                        id: true,
                        versionId: true,
                        categoryId: true,
                        speakerId: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        imagePath: true,
                        startTime: true,
                        endTime: true,
                        date: true,
                        totalSeats: true,
                        feeType: true,
                        fee: true,
                        location: true,
                        status: true,
                        registrationDeadline: true,
                        createdAt: true,
                        updatedAt: true,
                        displayOrder: true,
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                              status: true,
                        },
                        category: {
                              id: true,
                              name: true,
                              type: true,
                        },
                        speaker: {
                              id: true,
                              name: true,
                              designation: true,
                              imagePath: true,
                              socialLinks: true,
                        },
                  },
            });
            if (!event) {
                  throw new AppError("Event not found", 404);
            }
            return event;
      }

      async update(id: string, data: UpdateEventDto, userId: string) {
            const event = await this.findById(id);
            if (!event) {
                  throw new AppError('Event not found', 404);
            }
            if (data.versionId) {
                  const versionExists = await this.versionRepository
                        .findOne({ where: { id: data.versionId } });
                  if (!versionExists) {
                        throw new AppError('Flagship event version not found', 404);
                  }
                  if (versionExists.status === EventVersionStatus.ARCHIVED) {
                        throw new AppError('Cannot update team members for an archived flagship event version', 400);
                  }
            }
            if (data.categoryId) {
                  const categoryExists = await this.categoryRepository
                        .findOne({ where: { id: data.categoryId } });
                  if (!categoryExists) {
                        throw new AppError('Category not found', 404);
                  }
                  if (categoryExists.type !== CategoryType.EVENT) {
                        throw new AppError('Only categories of type "events" can be assigned to events', 400);
                  }
            }
            if (data.speakerId) {
                  const speaker = await this.speakerRepository.findOne({ where: { id: data.speakerId, versionId: data.versionId || event.versionId } });
                  if (!speaker) {
                        throw new AppError("Speaker not found in this version", 404);
                  }
            }

            if (data.displayOrder) {
                  const targetCategoryId = data.categoryId || event.categoryId;
                  const existingOrder = await this.eventRepository.findOne({
                        where: {
                              categoryId: targetCategoryId,
                              displayOrder: data.displayOrder
                        }
                  });

                  // If found another event with same order
                  if (existingOrder && existingOrder.id !== id) {
                        throw new AppError(`Display order ${data.displayOrder} is already taken in this category`, 400);
                  }
            }

            const updatedEvent = await this.eventRepository.save({
                  ...event,
                  ...data,
                  versionId: data.versionId || event.versionId,
                  categoryId: data.categoryId || event.categoryId,
                  speakerId: data.speakerId || event.speakerId,
                  modifiedById: userId,
            });

            return updatedEvent;
      }

      async findByHighlighted(query: any) {
            const { versionId, categoryId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            where.isHighlighted = true;
            const { page = 1, limit = 10 } = rest;
            const skip = (Number(page) - 1) * Number(limit);
            const [items, total] = await this.eventRepository.findAndCount({
                  where,
                  skip,
                  take: Number(limit),
                  relations: ['flagshipEvent', 'category', 'speaker'],
                  select: {
                        id: true,
                        versionId: true,
                        categoryId: true,
                        speakerId: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        imagePath: true,
                        startTime: true,
                        endTime: true,
                        date: true,
                        totalSeats: true,
                        feeType: true,
                        fee: true,
                        location: true,
                        status: true,
                        registrationDeadline: true,
                        createdAt: true,
                        updatedAt: true,
                        displayOrder: true,
                        flagshipEvent: {
                              id: true,
                              version_name: true,
                              status: true,
                        },
                        category: {
                              id: true,
                              name: true,
                              type: true,
                        },
                        speaker: {
                              id: true,
                              name: true,
                              designation: true,
                              imagePath: true,
                              socialLinks: true,
                        },
                  },
                  order: {
                        displayOrder: 'ASC',
                  }
            });
            return { items, meta: { total, page, limit, totalPages: Math.ceil(total / Number(limit)) } };
      }

      async delete(id: string, versionId: string) {
            const event = await this.eventRepository.findOne({ where: { id, versionId } });
            if (!event) {
                  throw new AppError('Event not found in this version', 404);
            }
            await this.eventRepository.remove(event);
            if (event.imagePath) {
                  await removeFile(event.imagePath);
            }
            return { versionId: event.versionId };
      }
}