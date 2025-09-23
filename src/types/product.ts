// types/product.ts

import { Brand } from "./brand";
import { Category } from "./category";
import { Stock } from "./stock";

export type Image = {
  id?: string;
  image: string;
};

export type Variant = {
  id?: string;
  color: string;
  size: "SM" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
  qte: number;
  images: Image[];
  stock?: Stock;
};

// export type Category = {
//   id?: string; // UUID, optional if creating a new category
//   category?: string; // internal identifier or slug
//   displayText?: string; // text shown in the dropdown
//   imageUrl?: string; // category image URL
//   products?: any[]; // optional, can be omitted or typed if needed
// };

export type Review = {
  id?: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  brand?: Brand;
  gender: string;
  quantity?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  price: number;
  newPrice?: number;
  status?: "active" | "inactive" | "archived" | string;
  trending?: boolean;
  tags?: string[]; // <-- Add this line
  createAt?: string;
  category: Category;
  variants: Variant[];
  reviews?: Review[];
  averageRating?: number;
};

// -------------------- CREATE / UPDATE TYPES --------------------

export type ImageInput = {
  id?: string; // present if editing existing image
  file?: File; // for uploading new image
  image?: string; // keep if updating and reusing old image
};

export type VariantInput = {
  id?: string; // present if updating existing variant
  color: string;
  size: "SM" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
  qte: number;
  images: (File | ImageInput)[]; // allow mixing uploaded files and existing images
};

export type ProductCreateInput = {
  name: string;
  description?: string;
  brand: string;
  gender: string;
  weight?: string;
  quantity?: number;
  image?: File | string; // main product image as file
  price: number;
  newPrice?: number;
  trending?: boolean;
  categoryId: string; // for linking category
  variants?: VariantInput[];
  tags?: string[]; // <-- Add this line
};

export type ProductUpdateInput = Partial<ProductCreateInput> & {
  id: string; // id is required for updates
  imageFile?: File; // main product image as file
  status?: string;
};
