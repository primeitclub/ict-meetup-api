export interface CreateCategoryDto {
  versionId: string;
  type: string;
  name: string;
  displayOrder: number;
}

export interface UpdateCategoryDto {
  versionId: string;
  type?: string;
  name?: string;
  displayOrder?: number;
}

export interface CategoryResponseDto {
  id: string;
  type: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
