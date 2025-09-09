// types/cart.ts

export interface Variant {
  id: string;
  color: string;
  size: string;
  qte: number; // Available quantity (stock)
  images: { id: string; image: string }[];
}

export interface ProductInfo {
  id: string;
  name: string;
  image: string; // Main product image
  price: number;
  newPrice?: number | null;
  brand: string;
  category: {
    id: string;
    category: string;
    displayText: string;
    imageUrl: string;
  };
}

export interface CartItem {
  product: ProductInfo; // Core product data
  variant: Variant; // The specific variant chosen by the user
  quantity: number; // How many of this specific variant are in the cart
  selected?: boolean; // Whether the item is selected for checkout
}
