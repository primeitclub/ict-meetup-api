import { AssetLibrary } from '../entities/asset-library.entity';
import { CreateAssetLibraryDto, UpdateAssetLibraryDto } from '../dto/asset-library.dto';

export interface IAssetLibraryRepository {
  save(assetLibrary: AssetLibrary): Promise<AssetLibrary>;
  findAll(): Promise<AssetLibrary[]>;
  findById(id: string): Promise<AssetLibrary | null>;
  findBySection(sourceTable: string, sourceTableId: string): Promise<AssetLibrary | null>;
  update(id: string, data: Partial<AssetLibrary>): Promise<AssetLibrary>;
  delete(id: string): Promise<void>;
}

export interface IAssetLibraryService {
  create(data: CreateAssetLibraryDto, userId: string): Promise<AssetLibrary>;
  findAll(): Promise<AssetLibrary[]>;
  findById(id: string): Promise<AssetLibrary>;
  findBySection(sourceTable: string, sourceTableId: string): Promise<AssetLibrary | null>;
  update(id: string, data: UpdateAssetLibraryDto, userId: string): Promise<AssetLibrary>;
  delete(id: string, userId: string): Promise<{ message: string }>;
}
