// types/brand.ts

export interface Brand {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandCreateInput {
  name: string;
  imageFile?: File;
  description?: string;
}

export interface BrandUpdateInput {
  id: string;
  name?: string;
  imageFile?: File;
  description?: string;
}
