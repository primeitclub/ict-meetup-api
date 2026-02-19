export interface CreateCategoryDto {
  type: string;
  name: string;
  displayOrder: number;
}

export interface UpdateCategoryDto {
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
