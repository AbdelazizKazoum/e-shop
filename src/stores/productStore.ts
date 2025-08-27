// stores/productStore.ts
import { create } from "zustand";
import { productService } from "@/services/productService";
import type {
  Category,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  VariantInput,
} from "@/types/product";
import { toast } from "react-toastify";

type ProductState = {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;

  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;

  fetchProducts: (
    page?: number,
    limit?: number,
    filters?: {
      name?: string;
      brand?: string;
      gender?: string;
      rating?: number;
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
    }
  ) => Promise<void>;
  createProduct: (product: ProductCreateInput) => Promise<Product | null>;
  updateProduct: (product: ProductUpdateInput) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (productId: string) => Promise<Product | null>;

  createVariants: (
    productId: string,
    variants: VariantInput[]
  ) => Promise<string | void>;
  updateVariants: (
    productId: string,
    variants: VariantInput[]
  ) => Promise<void>;

  resetError: () => void;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  categories: [],

  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  // =================================================================
  // === FETCH PRODUCTS WITH OPTIONAL FILTERS ========================
  // =================================================================
  fetchProducts: async (
    page = 1,
    limit = 10,
    filters?: {
      name?: string;
      brand?: string;
      gender?: string;
      rating?: number;
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
    }
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.fetchProducts(page, limit, filters);
      console.log("🚀 ~ data:", res);

      const { data, total } = res;

      set({ products: data, total, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch products", loading: false });
    }
  },

  // =================================================================
  // === FETCH SINGLE PRODUCT BY ID ==================================
  // =================================================================
  fetchProductById: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(productId);
      set({ selectedProduct: product, loading: false });
      return product;
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch product",
        loading: false,
      });
      return null;
    }
  },

  // =================================================================
  // === FETCH ALL CATEGORIES ========================================
  // =================================================================
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await productService.fetchCategories();
      set({ categories, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch categories",
        loading: false,
      });
    }
  },

  // =================================================================
  // === CREATE PRODUCT =============================================
  // =================================================================
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productService.createProduct(productData);
      await get().fetchProducts(get().page, get().limit); // 🔄 refresh list
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

  // =================================================================
  // === UPDATE PRODUCT =============================================
  // =================================================================
  updateProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(productData);
      await get().fetchProducts(get().page, get().limit); // 🔄 refresh list
      return updatedProduct;
    } catch (err: any) {
      set({ error: err.message || "Failed to update product" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // =================================================================
  // === CREATE VARIANTS FOR A PRODUCT ==============================
  // =================================================================
  createVariants: async (productId, variants) => {
    set({ loading: true, error: null });
    try {
      return await productService.createVariants(productId, variants);
    } catch (err: any) {
      set({ error: err.message || "Failed to create variants" });
    } finally {
      set({ loading: false });
    }
  },

  // =================================================================
  // === UPDATE VARIANTS FOR A PRODUCT ==============================
  // =================================================================
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

  // =================================================================
  // === RESET ERROR STATE ===========================================
  // =================================================================
  resetError: () => set({ error: null }),
}));
