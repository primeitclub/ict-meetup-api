export interface CreateTeamMemberDto {
  versionId: string;
  categoryId: string;
  name: string;
  designation?: string;
  role?: string;
  imagePath?: string;
  imageUrl?: string;
  socialLinks?: Record<string, string>;
  displayOrder?: number;
}

export interface UpdateTeamMemberDto {
  versionId?: string;
  categoryId?: string;
  name?: string;
  designation?: string;
  role?: string;
  imagePath?: string;
  imageUrl?: string;
  socialLinks?: Record<string, string>;
  displayOrder?: number;
}

export interface TeamMemberResponseDto {
  id: string;
  versionId: string;
  categoryId: string;
  name: string;
  designation?: string;
  role?: string;
  imagePath?: string;
  imageUrl?: string;
  socialLinks?: Record<string, string>;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    type: string;
    name: string;
  };
  flagshipEvent?: {
    id: string;
    versionName: string;
  };
}

export interface TeamMemberQueryDto {
  versionId?: string;
  categoryId?: string;
}
