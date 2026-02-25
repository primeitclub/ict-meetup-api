export interface CreateFaqDto {
  flagshipEventVersionId: string;
  title: string;
  description: string;
}

export interface UpdateFaqDto {
  flagshipEventVersionId?: string;
  title?: string;
  description?: string;
}

export interface FaqResponseDto {
  id: string;
  flagshipEventVersionId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
