// services/categoryService.ts
import axiosClient from "@/lib/axiosClient";
import type {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/types/category";

export const categoryService = {
  // =================================================================
  // === FETCH ALL CATEGORIES ========================================
  // =================================================================
  async fetchCategories(): Promise<Category[]> {
    const res = await axiosClient.get(`/categories`);
    return res.data;
  },

  // =================================================================
  // === GET CATEGORY BY ID ==========================================
  // =================================================================
  async getCategoryById(categoryId: string): Promise<Category> {
    const res = await axiosClient.get(`/categories/${categoryId}`);
    return res.data;
  },

  // =================================================================
  // === CREATE CATEGORY =============================================
  // =================================================================
  async createCategory(data: CategoryCreateInput): Promise<Category> {
    const res = await axiosClient.post(`/categories`, data);
    return res.data;
  },

  // =================================================================
  // === UPDATE CATEGORY =============================================
  // =================================================================
  async updateCategory(data: CategoryUpdateInput): Promise<Category> {
    const res = await axiosClient.put(`/categories/${data.id}`, data);
    return res.data;
  },

  // =================================================================
  // === DELETE CATEGORY =============================================
  // =================================================================
  async deleteCategory(categoryId: string): Promise<void> {
    await axiosClient.delete(`/categories/${categoryId}`);
  },
};
