import { Asset } from '../entities/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from '../dto/asset.dto';

export interface IAssetRepository {
  save(asset: Asset): Promise<Asset>;
  findAllByLibrary(assetLibraryId: string): Promise<Asset[]>;
  findById(id: string): Promise<Asset | null>;
  update(id: string, data: Partial<Asset>): Promise<Asset>;
  delete(id: string): Promise<void>;
  countByLibrary(assetLibraryId: string): Promise<number>;
}

export interface IAssetService {
  create(assetLibraryId: string, data: CreateAssetDto, userId: string): Promise<Asset>;
  findAllByLibrary(assetLibraryId: string): Promise<Asset[]>;
  findById(id: string): Promise<Asset>;
  update(id: string, data: UpdateAssetDto, userId: string): Promise<Asset>;
  softDelete(id: string, userId: string): Promise<{ message: string }>;
  hardDelete(id: string, userId: string): Promise<{ message: string }>;
}
