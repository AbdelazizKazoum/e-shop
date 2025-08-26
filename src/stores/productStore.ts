// stores/productStore.ts
import { create } from "zustand";
import { productService } from "@/services/productService";
import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  VariantInput,
} from "@/types/product";
import { toast } from "react-toastify";

type ProductState = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;

  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  createProduct: (product: ProductCreateInput) => Promise<Product | null>;
  updateProduct: (product: ProductUpdateInput) => Promise<Product | null>;

  createVariants: (
    productId: string,
    variants: VariantInput[]
  ) => Promise<void>;
  updateVariants: (
    productId: string,
    variants: VariantInput[]
  ) => Promise<void>;

  resetError: () => void;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  // PRODUCT ACTIONS
  fetchProducts: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { items, total } = await productService.fetchProducts(page, limit);
      set({ products: items, total, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch products", loading: false });
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productService.createProduct(productData);
      await get().fetchProducts(get().page, get().limit);
      toast.success(`Product "${newProduct?.name}" created successfully!`);
      return newProduct;
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
      set({ error: err.message || "Failed to create product" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(productData);
      await get().fetchProducts(get().page, get().limit);
      return updatedProduct;
    } catch (err: any) {
      set({ error: err.message || "Failed to update product" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // VARIANT ACTIONS
  createVariants: async (productId, variants) => {
    set({ loading: true, error: null });
    try {
      await productService.createVariants(productId, variants);
    } catch (err: any) {
      set({ error: err.message || "Failed to create variants" });
    } finally {
      set({ loading: false });
    }
  },

  updateVariants: async (productId, variants) => {
    set({ loading: true, error: null });
    try {
      await productService.updateVariants(productId, variants);
    } catch (err: any) {
      set({ error: err.message || "Failed to update variants" });
    } finally {
      set({ loading: false });
    }
  },

  resetError: () => set({ error: null }),
}));
