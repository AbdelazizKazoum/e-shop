import { User } from "next-auth";
import { Product } from "./product";

export interface Review {
  id: string;
  title: string;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  reviewDate: string; // ISO string
}

export interface ReviewCreateInput {
  title: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewUpdateInput {
  title?: string;
  rating?: number;
  comment?: string;
}
