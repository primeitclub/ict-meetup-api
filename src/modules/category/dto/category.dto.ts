export interface CreateCategoryDto {
  name: string;
  displayOrder: number;
}

export interface UpdateCategoryDto {
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
