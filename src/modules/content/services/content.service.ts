import { DataSource } from "typeorm";
import { AppError } from "../../../shared/utils/error.utils";
import logger from "../../../shared/utils/logger.utils";
import { FlagshipEventVersionService } from "../../flagship-event/services/flagship-event.service";
import { HeroSectionService } from "../../hero-sections/services/hero-section.service";
import { AboutSectionService } from "../../about-sections/services/about-section.service";
import { SpeakerService } from "../../speaker/services/speaker.service";
import { GalleryService } from "../../gallery/services/gallery.service";
import { SponsorService } from "../../sponsor/services/sponsor.service";
import { FaqService } from "../../faq/services/faq.service";
import { EventService } from "../../event/services/event.service";
import { EventStatus } from "../../event/entities/event.entity";

// High enough to return the full set per section for a landing page — the
// underlying findAll() methods default to a page size of 10, which would
// silently truncate speakers/sponsors/events lists.
const ALL = 1000;

/**
 * Aggregates every landing-page section for a single edition (flagship event
 * version) into one payload, so the client makes one request instead of one
 * per section. The differing version-param names across modules
 * (flagshipEventVersionId / versionId / version_id) are normalized here.
 */
export class ContentService {
  private versionService: FlagshipEventVersionService;
  private heroService: HeroSectionService;
  private aboutService: AboutSectionService;
  private speakerService: SpeakerService;
  private galleryService: GalleryService;
  private sponsorService: SponsorService;
  private faqService: FaqService;
  private eventService: EventService;

  constructor(dataSource: DataSource) {
    this.versionService = new FlagshipEventVersionService(dataSource);
    this.heroService = new HeroSectionService(dataSource);
    this.aboutService = new AboutSectionService(dataSource);
    this.speakerService = new SpeakerService(dataSource);
    this.galleryService = new GalleryService(dataSource);
    this.sponsorService = new SponsorService(dataSource);
    this.faqService = new FaqService(dataSource);
    this.eventService = new EventService(dataSource);
  }

  /**
   * Resolve the edition: explicit slug wins, otherwise fall back to the
   * current edition. "current" is purely a server-side fallback — the client
   * never sends the literal string "current".
   */
  async getHomeContent(versionSlug?: string) {
    const version = versionSlug
      ? await this.versionService.findBySlug(versionSlug)
      : await this.versionService.findCurrent();

    if (!version) {
      throw new AppError(
        versionSlug
          ? "No edition found for the given version"
          : "No current edition is set",
        404,
      );
    }

    const versionId = version.id;
    const isCurrent = !!version.is_current;

    logger.info(
      `Aggregating landing content for edition ${version.slug} (${versionId})`,
      { module: "ContentService" },
    );

    const [hero, about, speakers, gallery, sponsors, events] =
      await Promise.all([
        this.heroService.findAll({
          flagshipEventVersionId: versionId,
          limit: ALL,
        }),
        this.aboutService.findAll({ versionId, limit: ALL }),
        this.speakerService.findAll({ versionId, limit: ALL }),
        this.galleryService.findAll({ version_id: versionId, limit: ALL }),
        this.sponsorService.findAll({ versionId, limit: ALL }),
        this.eventService.findAll({ versionId, limit: ALL }),
      ]);

    console.log({ sponsors });

    // FAQ is exposed for the current edition only — past editions omit it.
    const faqItems = isCurrent
      ? (await this.faqService.findAll({ versionId, limit: ALL })).items
      : undefined;

    // Highlights are the published events for this edition; drafts/archived
    // never reach the public landing page.
    const highlights = (events.items ?? []).filter(
      (e: any) => e.status === EventStatus.PUBLISHED,
    );

    return {
      edition: {
        slug: version.slug,
        name: version.version_name,
        isCurrent,
        logo: version.logo ?? null,
        logoPath: version.logoPath ?? null,
        startDate: version.start_date ?? null,
        endDate: version.end_date ?? null,
      },
      sections: {
        hero: hero.items?.[0] ?? null,
        about: about.items?.[0] ?? null,
        highlights,
        speakers: speakers.items ?? [],
        gallery: gallery.items?.[0]?.images ?? [],
        sponsors: sponsors.items ?? [],
        ...(faqItems ? { faq: faqItems } : {}),
      },
    };
  }
}
