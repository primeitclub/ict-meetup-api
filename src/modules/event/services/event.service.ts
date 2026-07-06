import { DataSource, Repository } from "typeorm";
import { Event as EventEntity, EventStatus } from "../entities/event.entity";
import { CreateEventDto, UpdateEventDto } from "../validators/event.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { Category, CategoryType } from "../../category/entities/category.entity";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { Speaker } from "../../speaker/entities/speaker.entity";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { randomInt, randomUUID } from "crypto";

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

            const trackingId = `ICT-Meetup-${versionExists.version_number}-${randomUUID().slice(0, 8)}`

            const newEvent = this.eventRepository.create({
                  trackingId: trackingId,
                  title: rest.title,
                  subtitle: rest.subtitle,
                  description: rest.description,
                  imagePath: rest.imagePath,
                  imageUrl: rest.imageUrl,
                  startTime: rest.startTime,
                  endTime: rest.endTime,
                  date: rest.date,
                  totalSeats: rest.totalSeats,
                  feeType: rest.feeType,
                  fee: rest.fee ?? "",
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
            const { versionId, categoryId, status, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            if (status) where.status = status;
            const { page = 1, limit = 10 } = rest;
            const parsedLimit = Math.min(Number(limit) || 10, 100);
            const skip = (Number(page) - 1) * parsedLimit;
            const [items, total] = await this.eventRepository.findAndCount({
                  where,
                  skip,
                  take: parsedLimit,
                  relations: ['flagshipEvent', 'category', 'speaker'],
                  select: {
                        id: true,
                        versionId: true,
                        categoryId: true,
                        speakerId: true,
                        trackingId: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        imagePath: true,
                        imageUrl: true,
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
                              version_number: true,
                              is_current: true,
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
                              imageUrl: true,
                              socialLinks: true,
                        },
                  },
                  order: {
                        displayOrder: 'ASC',
                  }
            });
            return { items, meta: { total, page, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit) } };
      }

      async findById(id: string) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            const selectFields = {
                  id: true,
                  versionId: true,
                  categoryId: true,
                  speakerId: true,
                  trackingId: true,
                  title: true,
                  subtitle: true,
                  description: true,
                  imagePath: true,
                  imageUrl: true,
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
                  isHighlighted: true,
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
                        company: true,
                        description: true,
                        imagePath: true,
                        imageUrl: true,
                        socialLinks: true,
                  },
            };

            let event;
            if (isUuid) {
                  event = await this.eventRepository.findOne({
                        where: { id },
                        relations: ['flagshipEvent', 'category', 'speaker'],
                        select: selectFields as any,
                  });
            } else {
                  // Fallback: slug lookup
                  const allEvents = await this.eventRepository.find({
                        relations: ['flagshipEvent', 'category', 'speaker'],
                        select: selectFields as any,
                  });
                  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  event = allEvents.find(e => slugify(e.title) === id);
            }

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

            const resolvedVersionId = data.versionId ?? event.versionId;
            const resolvedCategoryId = data.categoryId ?? event.categoryId;

            if (data.versionId) {
                  const versionExists = await this.versionRepository
                        .findOne({ where: { id: data.versionId } });
                  if (!versionExists) {
                        throw new AppError('Flagship event version not found', 404);
                  }
                  if (versionExists.status === EventVersionStatus.ARCHIVED) {
                        throw new AppError('Cannot update events for an archived flagship event version', 400);
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
                  const speaker = await this.speakerRepository.findOne({ where: { id: data.speakerId, versionId: resolvedVersionId } });
                  if (!speaker) {
                        throw new AppError("Speaker not found in this version", 404);
                  }
            }
            if (data.displayOrder) {
                  const existingOrder = await this.eventRepository.findOne({
                        where: { categoryId: resolvedCategoryId, displayOrder: data.displayOrder }
                  });
                  if (existingOrder && existingOrder.id !== id) {
                        throw new AppError(`Display order ${data.displayOrder} is already taken in this category`, 400);
                  }
            }

            // Use update() instead of save() to avoid TypeORM merging loaded relation
            // objects (flagshipEvent, category, speaker) back over the FK columns we
            // just changed — that was silently reverting versionId/categoryId.
            await this.eventRepository.update(id, {
                  ...(data.title !== undefined && { title: data.title }),
                  ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
                  ...(data.description !== undefined && { description: data.description }),
                  ...(data.startTime !== undefined && { startTime: data.startTime }),
                  ...(data.endTime !== undefined && { endTime: data.endTime }),
                  ...(data.date !== undefined && { date: data.date }),
                  versionId: resolvedVersionId,
                  categoryId: resolvedCategoryId,
                  // speakerId undefined means the form sent "" which Zod converted to undefined
                  // (the form always submits this field). null clears it in the DB.
                  speakerId: data.speakerId || null,
                  ...(data.totalSeats !== undefined && { totalSeats: data.totalSeats }),
                  ...(data.feeType !== undefined && { feeType: data.feeType }),
                  ...(data.fee !== undefined && { fee: data.fee === null ? "" : data.fee }),
                  ...(data.location !== undefined && { location: data.location }),
                  ...(data.status !== undefined && { status: data.status }),
                  ...(data.registrationDeadline !== undefined && { registrationDeadline: data.registrationDeadline }),
                  ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
                  ...(data.isHighlighted !== undefined && { isHighlighted: data.isHighlighted }),
                  ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
                  ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
                  modifiedById: userId,
            });

            return await this.findById(id);
      }

      async findByHighlighted(query: any) {
            const { versionId, categoryId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (categoryId) where.categoryId = categoryId;
            where.isHighlighted = true;
            const { page = 1, limit = 10 } = rest;
            const parsedLimit = Math.min(Number(limit) || 10, 100);
            const skip = (Number(page) - 1) * parsedLimit;
            const [items, total] = await this.eventRepository.findAndCount({
                  where,
                  skip,
                  take: parsedLimit,
                  relations: ['flagshipEvent', 'category', 'speaker'],
                  select: {
                        id: true,
                        versionId: true,
                        categoryId: true,
                        speakerId: true,
                        trackingId: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        imagePath: true,
                        imageUrl: true,
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
                              imageUrl: true,
                              socialLinks: true,
                        },
                  },
                  order: {
                        displayOrder: 'ASC',
                  }
            });
            return { items, meta: { total, page, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit) } };
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
