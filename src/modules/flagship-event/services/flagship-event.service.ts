import { DataSource, Repository } from "typeorm";
import { AppError } from "../../../shared/utils/error.utils";
import logger from "../../../shared/utils/logger.utils";
import {
  EventVersionStatus,
  FlagshipEventVersion,
} from "../entities/flagship-event.entity";

export class FlagshipEventVersionService {
  private versionRepository: Repository<FlagshipEventVersion>;

  constructor(dataSource: DataSource) {
    this.versionRepository = dataSource.getRepository(FlagshipEventVersion);
  }

  /**
   * Create a new flagship event version
   * Respects client-provided status and is_current
   */
  async create(data: Partial<FlagshipEventVersion>, userId: string) {
    logger.info(`Creating new flagship event version: ${data.version_name}`, {
      module: "FlagshipEventVersionService",
    });

    // Check for duplicate slug or version_number
    const existing = await this.versionRepository.findOne({
      where: [{ slug: data.slug }, { version_number: data.version_number }],
    });

    if (existing) {
      throw new AppError(
        "Version with this slug or version number already exists",
        400,
      );
    }

    // is_current is derived from status only — never accepted directly from the client
    const newVersion = this.versionRepository.create({
      ...data,
      status: data.status ?? EventVersionStatus.DRAFT,
      is_current: false,
      createdById: userId,
    });

    // Handle activation if status is ACTIVE (sets is_current = true and clears others)
    if (newVersion.status === EventVersionStatus.ACTIVE) {
      await this.handleStatusTransition(newVersion, EventVersionStatus.ACTIVE);
    }

    const savedVersion = await this.versionRepository.save(newVersion);

    return savedVersion;
  }

  async findAll(query: any = {}) {
    logger.debug("Fetching all flagship event versions", {
      module: "FlagshipEventVersionService",
      query,
    });

    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.versionRepository.findAndCount({
      order: { version_number: "DESC" },
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
      },
    };
  }

  async findById(id: string) {
    const version = await this.versionRepository.findOne({ where: { id } });
    if (!version) throw new AppError("Flagship event version not found", 404);
    return version;
  }

  async findBySlug(slug: string) {
    let version = await this.versionRepository.findOne({ where: { slug } });
    if (!version) {
      // Fallback: search for slug ending with -slug or suffix (e.g. ict-meetup-v7 or ictmeetupv7 matches v7)
      version = await this.versionRepository.createQueryBuilder("version")
        .where("version.slug = :slug", { slug })
        .orWhere("version.slug LIKE :likeSlug", { likeSlug: `%-${slug}` })
        .orWhere("version.slug LIKE :likeSuffix", { likeSuffix: `%${slug}` })
        .getOne();
    }
    if (!version) throw new AppError("Flagship event version not found", 404);
    return version;
  }

  async findCurrent() {
    return await this.versionRepository.findOne({
      where: { is_current: true },
    });
  }

  /**
   * Update a version
   * Handles status transitions automatically
   */
  async update(
    id: string,
    data: Partial<FlagshipEventVersion>,
    userId: string,
  ) {
    const version = await this.findById(id);

    if (version.status === EventVersionStatus.ARCHIVED) {
      throw new AppError("Archived versions cannot be updated", 400);
    }

    logger.info(`Updating flagship event version: ${id}`, {
      module: "FlagshipEventVersionService",
    });

    // Strip is_current from the incoming data — it must only be set via
    // handleStatusTransition to guarantee the single-current invariant.
    const { is_current: _ignored, ...safeData } = data as Partial<FlagshipEventVersion> & { is_current?: boolean };

    // Handle status transition if status changes
    if (safeData.status && safeData.status !== version.status) {
      await this.handleStatusTransition(version, safeData.status);
    }

    Object.assign(version, safeData);
    version.modifiedById = userId;

    const updatedVersion = await this.versionRepository.save(version);

    return updatedVersion;
  }

  /**
   * Handles status transitions
   * Ensures only one active version exists
   */
  private async handleStatusTransition(
    version: FlagshipEventVersion,
    newStatus: EventVersionStatus,
  ) {
    if (newStatus === EventVersionStatus.ACTIVE) {
      // Clear ALL versions that currently have is_current = true (handles duplicates too)
      await this.versionRepository
        .createQueryBuilder()
        .update(FlagshipEventVersion)
        .set({ is_current: false, status: EventVersionStatus.ARCHIVED })
        .where("is_current = :val AND id != :id", { val: true, id: version.id ?? "" })
        .execute();

      logger.info(`Cleared previously active version(s) before activating ${version.id ?? "(new)"}`, {
        module: "FlagshipEventVersionService",
      });

      version.status = EventVersionStatus.ACTIVE;
      version.is_current = true;
    } else if (
      newStatus === EventVersionStatus.DRAFT ||
      newStatus === EventVersionStatus.ARCHIVED
    ) {
      version.is_current = false;
      version.status = newStatus;
    }
  }

  /**
   * Delete a version
   * Cannot delete active versions
   */
  async delete(id: string, userId: string) {
    const version = await this.findById(id);

    if (version.status === EventVersionStatus.ACTIVE) {
      throw new AppError("Active versions cannot be deleted", 400);
    }

    if (version.status === EventVersionStatus.ARCHIVED) {
      throw new AppError("Archived versions cannot be deleted", 400);
    }

    logger.warn(`Deleting flagship event version: ${id} (by user: ${userId})`, {
      module: "FlagshipEventVersionService",
    });

    await this.versionRepository.remove(version);

    return { message: "Version deleted successfully" };
  }
}
