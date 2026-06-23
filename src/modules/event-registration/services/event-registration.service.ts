import { EventRegistration, EventRegistrationStatus } from "../entities/event-registration.entity";
import { DataSource, Repository } from "typeorm";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Event, EventStatus } from "../../event/entities/event.entity";
import { CreateEventRegistrationDto } from "../validators/event-registration.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";

export class EventRegistrationService {
      private eventRegistrationRepository: Repository<EventRegistration>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      private eventRepository: Repository<Event>;
      constructor(dataSources: DataSource) {
            this.eventRegistrationRepository = dataSources.getRepository(EventRegistration);
            this.flagshipEventVersionRepository = dataSources.getRepository(FlagshipEventVersion);
            this.eventRepository = dataSources.getRepository(Event);
      }

      async create(data: CreateEventRegistrationDto) {
            const versionExists = await this.flagshipEventVersionRepository.findOne({ where: { id: data.versionId } });
            const eventExists = await this.eventRepository.findOne({ where: { id: data.eventId, versionId: data.versionId } });
            if (!versionExists || !eventExists) {
                  throw new Error("Version or Event not found");
            }
            if (versionExists.status === EventVersionStatus.ARCHIVED) {
                  throw new AppError("Version is archived, must be draft or published to create event", 400);
            }
            if (eventExists.status === EventStatus.ARCHIVED) {
                  throw new AppError("Event is archived, must be draft or published to create event", 400);
            }
            const eventRegistration = await this.eventRegistrationRepository.findOne({ where: { eventId: data.eventId, versionId: data.versionId, email: data.email } });
            if (eventRegistration) {
                  throw new AppError("You have already registered for this event", 400);
            }
            if (eventExists.feeType === 'paid' && !data.attachedPaymentScreenshot) {
                  throw new AppError("Payment screenshot is required for paid events", 400);
            }
            if (eventExists.feeType === 'free') {
                  data.attachedPaymentScreenshot = 'free';
            }
            if (!data.isStudent) {
                  (data as any).faculty = null;
                  (data as any).year = null;
                  (data as any).educationLevel = null;
            }
            const savedEventRegistration = await this.eventRegistrationRepository.save(data as any);
            return savedEventRegistration as EventRegistration;
      }


      async findAll(query: any) {
            const { versionId, eventId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (eventId) where.eventId = eventId;
            const { page = 1, limit = 10 } = rest;
            const skip = (Number(page) - 1) * Number(limit);
            const [items, total] = await this.eventRegistrationRepository.findAndCount({
                  where,
                  skip,
                  take: Number(limit),
                  relations: ['event', 'version'],
                  select: {
                        id: true,
                        versionId: true,
                        eventId: true,
                        username: true,
                        email: true,
                        contactNumber: true,
                        isStudent: true,
                        educationLevel: true,
                        faculty: true,
                        year: true,
                        attachedPaymentScreenshot: true,
                        status: true,
                        event: {
                              id: true,
                              versionId: true,
                              title: true,
                        },
                        version: {
                              id: true,
                              version_name: true,
                              status: true,
                        },
                  },
                  order: {
                        id: 'ASC',
                  }
            });
            return { items, meta: { total, page, limit, totalPages: Math.ceil(total / Number(limit)) } };
      }
      async findById(id: string) {
            const eventRegistration = await this.eventRegistrationRepository.findOne({
                  where: { id },
                  relations: ['event', 'version'],
                  select: {
                        id: true,
                        versionId: true,
                        eventId: true,
                        username: true,
                        email: true,
                        contactNumber: true,
                        isStudent: true,
                        educationLevel: true,
                        faculty: true,
                        year: true,
                        attachedPaymentScreenshot: true,
                        status: true,
                        event: {
                              id: true,
                              versionId: true,
                              title: true,
                              date: true,
                              location: true,
                              fee: true,
                              feeType: true,
                        },
                        version: {
                              id: true,
                              version_name: true,
                              status: true,
                        },
                  }
            });
            if (!eventRegistration) {
                  throw new AppError("Event registration not found", 404);
            }
            return eventRegistration;
      }
      async updateStatus(id: string, status: EventRegistrationStatus) {
            const eventRegistration = await this.eventRegistrationRepository.findOne({ where: { id } });
            if (!eventRegistration) {
                  throw new AppError("Event registration not found", 404);
            }
            eventRegistration.status = status;
            const updatedEventRegistration = await this.eventRegistrationRepository.save(eventRegistration);
            return updatedEventRegistration;
      }
      async delete(id: string, versionId: string, userId: string) {
            const eventRegistration = await this.eventRegistrationRepository.findOne({ where: { id, versionId } });
            if (!eventRegistration) {
                  throw new AppError("Event registration not found", 404);
            }
            const deletedEventRegistration = await this.eventRegistrationRepository.softDelete(id);
            return deletedEventRegistration;
      }
}