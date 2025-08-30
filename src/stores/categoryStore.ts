// stores/categoryStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { categoryService } from "@/services/categoryService";
import type {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/types/category";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error?: string;

  // actions
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => Promise<Category | undefined>;
  createCategory: (data: CategoryCreateInput) => Promise<void>;
  updateCategory: (data: CategoryUpdateInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  devtools((set, get) => ({
    categories: [],
    loading: false,
    error: undefined,

    // =================================================================
    // === FETCH ALL CATEGORIES ========================================
    // =================================================================
    fetchCategories: async () => {
      set({ loading: true, error: undefined });
      try {
        const categories = await categoryService.fetchCategories();
        set({ categories });
      } catch (err: any) {
        set({ error: err.message || "Failed to fetch categories" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === GET CATEGORY BY ID ==========================================
    // =================================================================
    getCategoryById: async (id: string) => {
      set({ loading: true, error: undefined });
      try {
        const category = await categoryService.getCategoryById(id);
        return category;
      } catch (err: any) {
        set({ error: err.message || "Failed to fetch category" });
        return undefined;
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === CREATE CATEGORY =============================================
    // =================================================================
    createCategory: async (data: CategoryCreateInput) => {
      set({ loading: true, error: undefined });
      try {
        const newCategory = await categoryService.createCategory(data);
        set({ categories: [...get().categories, newCategory] });
      } catch (err: any) {
        set({ error: err.message || "Failed to create category" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === UPDATE CATEGORY =============================================
    // =================================================================
    updateCategory: async (data: CategoryUpdateInput) => {
      set({ loading: true, error: undefined });
      try {
        const updatedCategory = await categoryService.updateCategory(data);
        set({
          categories: get().categories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          ),
        });
      } catch (err: any) {
        set({ error: err.message || "Failed to update category" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === DELETE CATEGORY =============================================
    // =================================================================
    deleteCategory: async (id: string) => {
      set({ loading: true, error: undefined });
      try {
        await categoryService.deleteCategory(id);
        set({ categories: get().categories.filter((cat) => cat.id !== id) });
      } catch (err: any) {
        set({ error: err.message || "Failed to delete category" });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
