import { Asset } from '../entities/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from '../dto/asset.dto';
import { IAssetService, IAssetRepository } from '../interfaces/asset.interface';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';

export class AssetService implements IAssetService {
  constructor(private readonly assetRepository: IAssetRepository) { }

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'AssetService',
      recordId,
      changes,
    });
  }

  async create(assetLibraryId: string, data: CreateAssetDto, userId: string): Promise<Asset> {
    logger.info(`Creating new asset in library ${assetLibraryId}`, {
      module: 'AssetService',
    });


    const activeAssetsCount = await this.assetRepository.countByLibrary(assetLibraryId);


    const newAsset = Object.assign(new Asset(), {
      ...data,
      asset_library_id: assetLibraryId,
    });

    const savedAsset = await this.assetRepository.save(newAsset);

    await this.createAuditLog(
      'assets',
      savedAsset.id,
      'CREATE',
      userId,
      savedAsset
    );

    return savedAsset;
  }

  async findAllByLibrary(assetLibraryId: string): Promise<Asset[]> {
    logger.debug(`Fetching assets for library ${assetLibraryId}`, {
      module: 'AssetService',
    });

    return await this.assetRepository.findAllByLibrary(assetLibraryId);
  }

  async findById(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }
    return asset;
  }

  async update(id: string, data: UpdateAssetDto, userId: string): Promise<Asset> {
    const asset = await this.findById(id);

    logger.info(`Updating asset: ${id}`, {
      module: 'AssetService',
    });

    const oldState = { ...asset };

    const updatedAsset = await this.assetRepository.update(id, data);

    await this.createAuditLog(
      'assets',
      updatedAsset.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedAsset }
    );

    return updatedAsset;
  }

  async softDelete(id: string, userId: string): Promise<{ message: string }> {
    const asset = await this.findById(id);

    logger.warn(`Soft deleting asset: ${id}`, {
      module: 'AssetService',
    });

    asset.deleted_at = new Date();
    await this.assetRepository.save(asset);

    await this.createAuditLog(
      'assets',
      id,
      'SOFT_DELETE',
      userId,
      { soft_deleted_asset: asset }
    );

    return { message: 'Asset deleted successfully' };
  }

  async hardDelete(id: string, userId: string): Promise<{ message: string }> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }

    logger.warn(`Hard deleting asset: ${id}`, {
      module: 'AssetService',
    });

    await this.assetRepository.delete(id);

    await this.createAuditLog(
      'assets',
      id,
      'HARD_DELETE',
      userId,
      { hard_deleted_asset: asset }
    );

    return { message: 'Asset permanently deleted successfully' };
  }
}
