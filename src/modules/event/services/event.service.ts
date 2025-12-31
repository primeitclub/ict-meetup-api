import { Repository } from "typeorm";
import connectDatabase from "../../../shared/config/typeorm/db.config";
import { AppError } from "../../../shared/utils/error.utils";
import logger from "../../../shared/utils/logger.utils";
import {
  EventVersionStatus,
  FlagshipEventVersion,
} from "../entities/event.entity";

export class FlagshipEventVersionService {
  private versionRepository: Repository<FlagshipEventVersion>;
  // private auditLogRepository: Repository<AuditLog>;

  constructor() {
    this.versionRepository =
      connectDatabase.getRepository(FlagshipEventVersion);
    // this.auditLogRepository = connectDatabase.getRepository(AuditLog);
  }

  private async createAuditLog(
    versionId: string | null | undefined,
    tableName: string,
    recordId: string | null | undefined,
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

  async create(data: Partial<FlagshipEventVersion>, userId: string) {
    logger.info(`Creating new flagship event version: ${data.version_name}`, {
      module: "FlagshipEventVersionService",
    });

    // Check if slug or version_number already exists
    const existing = await this.versionRepository.findOne({
      where: [{ slug: data.slug }, { version_number: data.version_number }],
    });

    if (existing) {
      throw new AppError(
        "Version with this slug or version number already exists",
        400
      );
    }

    const newVersion = this.versionRepository.create({
      ...data,
      status: EventVersionStatus.DRAFT,
      is_current: false,
    });

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
    if (!version) {
      throw new AppError("Flagship event version not found", 404);
    }
    return version;
  }

  async findBySlug(slug: string) {
    const version = await this.versionRepository.findOne({ where: { slug } });
    if (!version) {
      throw new AppError("Flagship event version not found", 404);
    }
    return version;
  }

  async findCurrent() {
    return await this.versionRepository.findOne({
      where: { is_current: true },
    });
  }

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

    // Validate state transitions
    if (data.status && data.status !== version.status) {
      await this.handleStatusTransition(version, data.status);
    }

    Object.assign(version, data);
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

  private async handleStatusTransition(
    version: FlagshipEventVersion,
    newStatus: EventVersionStatus
  ) {
    // draft -> active
    // active -> archived
    // draft -> archived
    // archived -> active (only if no active exists)

    if (newStatus === EventVersionStatus.ACTIVE) {
      // Archive existing active version
      const currentActive = await this.findCurrent();
      if (currentActive && currentActive.id !== version.id) {
        currentActive.status = EventVersionStatus.ARCHIVED;
        currentActive.is_current = false;
        await this.versionRepository.save(currentActive);
        logger.info(`Archived previously active version: ${currentActive.id}`, {
          module: "FlagshipEventVersionService",
        });
      }
      version.is_current = true;
    } else if (
      newStatus === EventVersionStatus.ARCHIVED ||
      newStatus === EventVersionStatus.DRAFT
    ) {
      version.is_current = false;
    }
  }

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
