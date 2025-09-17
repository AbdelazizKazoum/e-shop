// services/brandService.ts
import axiosClient from "@/lib/axiosClient";
import { Brand, BrandCreateInput, BrandUpdateInput } from "@/types/brand";

export const brandService = {
  // =================================================================
  // === FETCH ALL BRANDS (Paginated & Filtered) =====================
  // =================================================================
  async fetchBrands(params?: {
    page?: number;
    limit?: number;
    filter?: string;
  }): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    const query: Record<string, any> = {};
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;
    if (params?.filter) query.filter = params.filter;
    const res = await axiosClient.get(`/products/brands`, { params: query });
    return res.data;
  },

  // =================================================================
  // === GET BRAND BY ID =============================================
  // =================================================================
  async getBrandById(brandId: string): Promise<Brand> {
    const res = await axiosClient.get(`/products/brands/${brandId}`);
    return res.data;
  },

  // =================================================================
  // === CREATE BRAND ================================================
  // =================================================================
  async createBrand(data: BrandCreateInput): Promise<Brand> {
    const formData = new FormData();
    const { imageFile, ...rest } = data;
    formData.append("data", JSON.stringify(rest));
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    const res = await axiosClient.post(`/products/brands`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // =================================================================
  // === UPDATE BRAND ================================================
  // =================================================================
  async updateBrand(data: BrandUpdateInput): Promise<Brand> {
    const formData = new FormData();
    const { id, imageFile, ...rest } = data;
    formData.append("data", JSON.stringify(rest));
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    const res = await axiosClient.patch(`/products/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // =================================================================
  // === DELETE BRAND ================================================
  // =================================================================
  async deleteBrand(brandId: string): Promise<void> {
    await axiosClient.delete(`/products/brands/${brandId}`);
  },
};
