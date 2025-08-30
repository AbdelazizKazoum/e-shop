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
    const res = await axiosClient.get(`/products/categories`);
    return res.data;
  },

  // =================================================================
  // === GET CATEGORY BY ID ==========================================
  // =================================================================
  async getCategoryById(categoryId: string): Promise<Category> {
    const res = await axiosClient.get(`/products/categories/${categoryId}`);
    return res.data;
  },

  // =================================================================
  // === CREATE CATEGORY =============================================
  // =================================================================
  async createCategory(data: CategoryCreateInput): Promise<Category> {
    const formData = new FormData();

    // Convert the rest of the data to a JSON string and append
    const { imageFile, ...rest } = data;
    formData.append("data", JSON.stringify(rest));

    // Append image if exists
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const res = await axiosClient.post(`/products/categories`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // =================================================================
  // === UPDATE CATEGORY =============================================
  // =================================================================
  async updateCategory(data: CategoryUpdateInput): Promise<Category> {
    const formData = new FormData();

    const { id, imageFile, ...rest } = data;
    formData.append("data", JSON.stringify(rest));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const res = await axiosClient.patch(
      `/products/categories/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  // =================================================================
  // === DELETE CATEGORY =============================================
  // =================================================================
  async deleteCategory(categoryId: string): Promise<void> {
    await axiosClient.delete(`/products/categories/${categoryId}`);
  },
};
