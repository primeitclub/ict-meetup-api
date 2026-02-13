import { AssetLibrary } from '../entities/asset-library.entity';
import { CreateAssetLibraryDto, UpdateAssetLibraryDto } from '../dto/asset-library.dto';
import { IAssetLibraryService, IAssetLibraryRepository } from '../interfaces/asset-library.interface';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';

export class AssetLibraryService implements IAssetLibraryService {
  constructor(private readonly assetLibraryRepository: IAssetLibraryRepository) {}

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'AssetLibraryService',
      recordId,
      changes,
    });
  }

  async create(data: CreateAssetLibraryDto, userId: string): Promise<AssetLibrary> {
    logger.info(`Creating new asset library for ${data.source_table}:${data.source_table_id}`, {
      module: 'AssetLibraryService',
    });

    
    const existingLibrary = await this.assetLibraryRepository.findBySection(data.source_table, data.source_table_id);
    if (existingLibrary) {
      throw new AppError('Asset library already exists for this section', 400);
    }

    const newLibrary = Object.assign(new AssetLibrary(), data);
    const savedLibrary = await this.assetLibraryRepository.save(newLibrary);

    await this.createAuditLog(
      'asset_library',
      savedLibrary.id,
      'CREATE',
      userId,
      savedLibrary
    );

    return savedLibrary;
  }

  async findAll(): Promise<AssetLibrary[]> {
    logger.debug('Fetching all asset libraries', {
      module: 'AssetLibraryService',
    });
    return await this.assetLibraryRepository.findAll();
  }

  async findById(id: string): Promise<AssetLibrary> {
    const library = await this.assetLibraryRepository.findById(id);
    if (!library) {
      throw new AppError('Asset library not found', 404);
    }
    return library;
  }

  async findBySection(sourceTable: string, sourceTableId: string): Promise<AssetLibrary | null> {
    return await this.assetLibraryRepository.findBySection(sourceTable, sourceTableId);
  }

  async update(
    id: string,
    data: UpdateAssetLibraryDto,
    userId: string
  ): Promise<AssetLibrary> {
    const library = await this.findById(id);

    logger.info(`Updating asset library: ${id}`, {
      module: 'AssetLibraryService',
    });

    const oldState = { ...library };

    const updatedLibrary = await this.assetLibraryRepository.update(id, data);

    await this.createAuditLog(
      'asset_library',
      updatedLibrary.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedLibrary }
    );

    return updatedLibrary;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const library = await this.findById(id);

    logger.warn(`Deleting asset library: ${id}`, {
      module: 'AssetLibraryService',
    });

    await this.assetLibraryRepository.delete(id);

    await this.createAuditLog(
      'asset_library',
      id,
      'DELETE',
      userId,
      { deleted_library: library }
    );

    return { message: 'Asset library deleted successfully' };
  }
}
