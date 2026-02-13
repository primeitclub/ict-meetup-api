import { Repository, DataSource, IsNull } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { IAssetRepository } from '../interfaces/asset.interface';

export class AssetRepository implements IAssetRepository {
  private repository: Repository<Asset>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Asset);
  }

  async save(asset: Asset): Promise<Asset> {
    return await this.repository.save(asset);
  }

  async findAllByLibrary(assetLibraryId: string): Promise<Asset[]> {
    return await this.repository.find({
      where: {
        asset_library_id: assetLibraryId,
        deleted_at: IsNull(),
      },
      order: { display_order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Asset | null> {
    return await this.repository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });
  }

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Asset not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countByLibrary(assetLibraryId: string): Promise<number> {
    return await this.repository.count({
      where: {
        asset_library_id: assetLibraryId,
        deleted_at: IsNull(),
      },
    });
  }
}
