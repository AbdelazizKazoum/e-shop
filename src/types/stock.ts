// types/stock.ts

import { Product } from "./product";

export type Variant = {
  id?: string;
  color: string;
  size: "SM" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
  qte: number;
  images: string;
  product: Product | { id: string; name: string; image: string };
};

export interface Stock {
  id: string;
  quantity: number;
  variantId: string;
  variant: Variant;
  product: Product;
  createdAt: string;
  updated: string;
}

export interface StockProduct {
  id: string;
  name: string;
  image: string;
}

export interface StockVariant {
  id: string;
  color: string;
  size: string;
  product: StockProduct;
}

export interface StockItem {
  id: string;
  quantity: number;
  updated: string;
  variant: StockVariant;
}
