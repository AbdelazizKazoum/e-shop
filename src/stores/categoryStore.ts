// stores/categoryStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { categoryService } from "@/services/categoryService";
import type {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/types/category";
import { toast } from "react-toastify";

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
        toast.error(err.message || "Failed to fetch categories");
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
        toast.error(err.message || "Failed to fetch category");
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

        toast.success("Category created successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to create category");
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

        toast.success("Category updated successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to update category");
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
        toast.success("Category deleted successfully");
      } catch (err: any) {
        toast.error("Failed to delete category");
        toast.error(err.message || "Failed to delete category");
        set({ error: err.message || "Failed to delete category" });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
