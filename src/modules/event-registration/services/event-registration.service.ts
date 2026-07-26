import { EventRegistration, EventRegistrationStatus } from "../entities/event-registration.entity";
import { DataSource, Repository } from "typeorm";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Event, EventStatus } from "../../event/entities/event.entity";
import { CreateEventRegistrationDto } from "../validators/event-registration.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { mailService, ClubInfo } from "../../mail/mail.service";
import { SiteSettingsService } from "../../site-settings/services/site-settings.service";
import { HeroSection } from "../../hero-sections/entities/hero-section.entity";
import { randomUUID } from "crypto";

export class EventRegistrationService {
      private eventRegistrationRepository: Repository<EventRegistration>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      private eventRepository: Repository<Event>;
      private siteSettingsService: SiteSettingsService;
      private heroSectionRepository: Repository<HeroSection>;
      constructor(dataSources: DataSource) {
            this.eventRegistrationRepository = dataSources.getRepository(EventRegistration);
            this.flagshipEventVersionRepository = dataSources.getRepository(FlagshipEventVersion);
            this.eventRepository = dataSources.getRepository(Event);
            this.siteSettingsService = new SiteSettingsService(dataSources);
            this.heroSectionRepository = dataSources.getRepository(HeroSection);
      }

      private async getClubInfo(versionId: string, version: FlagshipEventVersion): Promise<ClubInfo> {
            const [siteSettings, hero] = await Promise.all([
                  this.siteSettingsService.get(),
                  this.heroSectionRepository.findOne({ where: { flagshipEventVersionId: versionId } }),
            ]);
            return {
                  versionName: version?.version_name ?? "ICT Meetup",
                  logoUrl: version?.logo ?? null,
                  logoPath: version?.logoPath ?? null,
                  heroTitle: hero?.heading ?? null,
                  heroDescription: hero?.paragraph ?? null,
                  clubEmail: siteSettings?.clubEmail ?? null,
                  clubPhoneNumber: siteSettings?.clubPhoneNumber ?? null,
                  socialMediaLinks: siteSettings?.socialMediaLinks ?? null,
            };
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
                  (data as any).collegeName = null;
            }

            // Group Event Validation
            const { EventType } = require("../../event/entities/event.entity");
            if (eventExists.eventType === EventType.GROUP) {
                  if (!data.teamName || data.teamName.trim() === "") {
                        throw new AppError("Team name is required for group events", 400);
                  }
                  if (!data.participants || !Array.isArray(data.participants) || data.participants.length === 0) {
                        throw new AppError("At least one participant is required for group events", 400);
                  }
                  const maxAllowed = eventExists.maxParticipants ?? 20;
                  if (data.participants.length > maxAllowed) {
                        throw new AppError(`Number of participants exceeds the limit of ${maxAllowed} configured for this event`, 400);
                  }
            } else {
                  // Ensure single events don't get populated with group details
                  (data as any).teamName = null;
                  (data as any).participants = null;
            }

            const versionLabel = Number(versionExists.version_number).toString();
            const trackingId = `ICT-Meetup-${versionLabel}-${randomUUID().slice(0, 8)}`;

            const savedEventRegistration = await this.eventRegistrationRepository.save({
                  ...data,
                  trackingId,
                  status: EventRegistrationStatus.PENDING,
} as any);

            this.getClubInfo(data.versionId, versionExists)
                  .then((club) => mailService.sendRegistrationReceived({ to: data.email, username: data.username, eventTitle: eventExists.title, trackingId, club }))
                  .catch((err) => console.error("[MailService] getClubInfo failed:", err));

            return savedEventRegistration as EventRegistration;
      }


      async findAll(query: any) {
            const { versionId, eventId, ...rest } = query;
            const where: any = {};
            if (versionId) where.versionId = versionId;
            if (eventId) where.eventId = eventId;
            const { page = 1, limit = 10 } = rest;
            const parsedLimit = Math.min(Number(limit) || 10, 100);
            const skip = (Number(page) - 1) * parsedLimit;
            const [items, total] = await this.eventRegistrationRepository.findAndCount({
                  where,
                  skip,
                  take: parsedLimit,
                  relations: ['event', 'version'],
            select: {
                        id: true,
                        trackingId: true,
                        versionId: true,
                        eventId: true,
                        username: true,
                        email: true,
                        contactNumber: true,
                        isStudent: true,
                        educationLevel: true,
                        collegeName: true,
                        faculty: true,
                        year: true,
                        attachedPaymentScreenshot: true,
                        status: true,
                        teamName: true,
                        participants: true,
                        createdAt: true,
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
                        createdAt: 'DESC',
                  }
            });
            return { items, meta: { total, page, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit) } };
      }
      async getStatusCounts(query: any) {
            const { versionId, eventId } = query;
            const qb = this.eventRegistrationRepository
                  .createQueryBuilder('registration')
                  .select('registration.status', 'status')
                  .addSelect('COUNT(*)', 'count')
                  .groupBy('registration.status');
            if (versionId) qb.andWhere('registration.versionId = :versionId', { versionId });
            if (eventId) qb.andWhere('registration.eventId = :eventId', { eventId });

            const rows = await qb.getRawMany<{ status: EventRegistrationStatus; count: string }>();
            const counts: Record<EventRegistrationStatus, number> = {
                  [EventRegistrationStatus.PENDING]: 0,
                  [EventRegistrationStatus.APPROVED]: 0,
                  [EventRegistrationStatus.REJECTED]: 0,
            };
            rows.forEach((row) => {
                  if (row.status in counts) counts[row.status] = Number(row.count);
            });
            return counts;
      }
      async findById(id: string) {
            const eventRegistration = await this.eventRegistrationRepository.findOne({
                  where: { id },
                  relations: ['event', 'version'],
            });
            if (!eventRegistration) {
                  throw new AppError("Event registration not found", 404);
            }
            return eventRegistration;
      }
      async updateStatus(id: string, status: EventRegistrationStatus, rejectionReason?: string) {
            const eventRegistration = await this.eventRegistrationRepository.findOne({
                  where: { id },
                  relations: ['event', 'version'],
            });
            if (!eventRegistration) {
                  throw new AppError("Event registration not found", 404);
            }

            if (status === EventRegistrationStatus.APPROVED && eventRegistration.status !== EventRegistrationStatus.APPROVED) {
                  const totalSeats = eventRegistration.event?.totalSeats;
                  if (typeof totalSeats === 'number') {
                        const approvedCount = await this.eventRegistrationRepository.count({
                              where: { eventId: eventRegistration.eventId, status: EventRegistrationStatus.APPROVED },
                        });
                        if (approvedCount >= totalSeats) {
                              throw new AppError("Registration is full for this event", 400);
                        }
                  }
            }

            eventRegistration.status = status;
            const updatedEventRegistration = await this.eventRegistrationRepository.save(eventRegistration);

            const eventTitle = eventRegistration.event?.title ?? 'the event';

            this.getClubInfo(eventRegistration.versionId, eventRegistration.version)
                  .then((club) => {
                        if (status === EventRegistrationStatus.APPROVED) {
                              mailService.sendRegistrationApproved({ to: eventRegistration.email, username: eventRegistration.username, eventTitle, trackingId: eventRegistration.trackingId, club });
                        } else if (status === EventRegistrationStatus.REJECTED) {
                              mailService.sendRegistrationRejected({ to: eventRegistration.email, username: eventRegistration.username, eventTitle, trackingId: eventRegistration.trackingId, club, rejectionReason });
                        }
                  })
                  .catch((err) => console.error("[MailService] getClubInfo failed:", err));

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