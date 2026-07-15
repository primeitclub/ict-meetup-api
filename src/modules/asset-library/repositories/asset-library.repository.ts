import { Repository, DataSource } from 'typeorm';
import { AssetLibrary } from '../entities/asset-library.entity';
import { IAssetLibraryRepository } from '../interfaces/asset-library.interface';
import { AppError } from '../../../shared/utils/error.utils';

export class AssetLibraryRepository implements IAssetLibraryRepository {
  private repository: Repository<AssetLibrary>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(AssetLibrary);
  }

  async save(assetLibrary: AssetLibrary): Promise<AssetLibrary> {
    return await this.repository.save(assetLibrary);
  }

  async findAll(): Promise<AssetLibrary[]> {
    return await this.repository.find({
      relations: ['flagshipEventVersion'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<AssetLibrary | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
  }

  async findBySection(sourceTable: string, sourceTableId: string): Promise<AssetLibrary | null> {
    return await this.repository.findOne({
      where: {
        source_table: sourceTable as any,
        source_table_id: sourceTableId,
      },
      relations: ['flagshipEventVersion'],
    });
  }

  async update(id: string, data: Partial<AssetLibrary>): Promise<AssetLibrary> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new AppError('Asset library not found', 404);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
