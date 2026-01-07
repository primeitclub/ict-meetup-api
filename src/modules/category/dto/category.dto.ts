import { CategoryType } from '../entities/category.entity';

export interface CreateCategoryDto {
  type: CategoryType;
  name: string;
}

export interface UpdateCategoryDto {
  type?: CategoryType;
  name?: string;
}

export interface CategoryResponseDto {
  id: string;
  type: CategoryType;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
