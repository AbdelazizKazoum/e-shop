// types/category.ts
export interface Category {
  id: string;
  category?: string;
  displayText?: string;
  imageUrl?: string;
}

export interface CategoryCreateInput {
  category?: string;
  displayText: string;
  imageFile?: File; // 👈 for uploading image
}

export interface CategoryUpdateInput {
  id: string;
  category?: string;
  displayText?: string;
  imageFile?: File; // 👈 optional for updates
}
