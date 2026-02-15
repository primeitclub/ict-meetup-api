import { Repository } from "typeorm";
import connectDatabase from "../../../shared/config/typeorm/db.config";
import { AppError } from "../../../shared/utils/error.utils";
import logger from "../../../shared/utils/logger.utils";
import {
  EventVersionStatus,
  FlagshipEventVersion,
} from "../entities/flagship-event.entity";

export class FlagshipEventVersionService {
  private versionRepository: Repository<FlagshipEventVersion>;

  constructor() {
    this.versionRepository =
      connectDatabase.getRepository(FlagshipEventVersion);
  }

  private async createAuditLog(
    versionId: string | null,
    tableName: string,
    recordId: string | null,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: "FlagshipEventVersionService",
      versionId,
      recordId,
      changes,
    });
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
        400
      );
    }

    // Use client-provided values if present, fallback to defaults
    const newVersion = this.versionRepository.create({
      ...data,
      status: data.status ?? EventVersionStatus.DRAFT,
      is_current: data.is_current ?? false,
      createdById: userId,
    });

    // Handle activation if status is ACTIVE
    if (newVersion.status === EventVersionStatus.ACTIVE) {
      await this.handleStatusTransition(newVersion, EventVersionStatus.ACTIVE);
    }

    const savedVersion = await this.versionRepository.save(newVersion);

    await this.createAuditLog(
      savedVersion.id,
      "flagship_event_versions",
      savedVersion.id,
      "CREATE",
      userId,
      savedVersion
    );

    return savedVersion;
  }

  async findAll() {
    logger.debug("Fetching all flagship event versions", {
      module: "FlagshipEventVersionService",
    });
    return await this.versionRepository.find({
      order: { version_number: "DESC" },
    });
  }

  async findById(id: string) {
    const version = await this.versionRepository.findOne({ where: { id } });
    if (!version) throw new AppError("Flagship event version not found", 404);
    return version;
  }

  async findBySlug(slug: string) {
    const version = await this.versionRepository.findOne({ where: { slug } });
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
    userId: string
  ) {
    const version = await this.findById(id);

    if (version.status === EventVersionStatus.ARCHIVED) {
      throw new AppError("Archived versions cannot be updated", 400);
    }

    logger.info(`Updating flagship event version: ${id}`, {
      module: "FlagshipEventVersionService",
    });

    const oldState = { ...version };

    // Handle status transition if status changes
    if (data.status && data.status !== version.status) {
      await this.handleStatusTransition(version, data.status);
    }

    Object.assign(version, data);
    version.modifiedBy = userId;

    const updatedVersion = await this.versionRepository.save(version);

    await this.createAuditLog(
      updatedVersion.id,
      "flagship_event_versions",
      updatedVersion.id,
      "UPDATE",
      userId,
      { before: oldState, after: updatedVersion }
    );

    return updatedVersion;
  }

  /**
   * Handles status transitions
   * Ensures only one active version exists
   */
  private async handleStatusTransition(
    version: FlagshipEventVersion,
    newStatus: EventVersionStatus
  ) {
    if (newStatus === EventVersionStatus.ACTIVE) {
      const currentActive = await this.findCurrent();
      if (currentActive && currentActive.id !== version.id) {
        currentActive.status = EventVersionStatus.ARCHIVED;
        currentActive.is_current = false;
        await this.versionRepository.save(currentActive);
        logger.info(`Archived previously active version: ${currentActive.id}`, {
          module: "FlagshipEventVersionService",
        });
      }
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

    logger.warn(`Deleting flagship event version: ${id}`, {
      module: "FlagshipEventVersionService",
    });

    await this.versionRepository.remove(version);

    await this.createAuditLog(
      null,
      "flagship_event_versions",
      id,
      "DELETE",
      userId,
      { deleted_version: version }
    );

    return { message: "Version deleted successfully" };
  }
}
