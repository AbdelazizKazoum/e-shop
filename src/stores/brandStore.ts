// stores/brandStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { brandService } from "@/services/brandService";
import type { Brand, BrandCreateInput, BrandUpdateInput } from "@/types/brand";
import { toast } from "react-toastify";

interface BrandState {
  brands: Brand[];
  loading: boolean;
  error?: string;
  page?: number;
  limit?: number;
  total?: number;

  // actions
  fetchBrands: (params?: {
    page?: number;
    limit?: number;
    filter?: string;
  }) => Promise<void>;
  getBrandById: (id: string) => Promise<Brand | undefined>;
  createBrand: (data: BrandCreateInput) => Promise<void>;
  updateBrand: (data: BrandUpdateInput) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
}

export const useBrandStore = create<BrandState>()(
  devtools((set, get) => ({
    brands: [],
    loading: false,
    error: undefined,

    // =================================================================
    // === FETCH ALL BRANDS ============================================
    // =================================================================
    fetchBrands: async (params) => {
      set({ loading: true, error: undefined });
      try {
        const result = await brandService.fetchBrands(params);
        set({
          brands: result.data,
          page: result.page,
          limit: result.limit,
          total: result.total,
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch brands");
        set({ error: err.message || "Failed to fetch brands" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === GET BRAND BY ID =============================================
    // =================================================================
    getBrandById: async (id: string) => {
      set({ loading: true, error: undefined });
      try {
        const brand = await brandService.getBrandById(id);
        return brand;
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch brand");
        set({ error: err.message || "Failed to fetch brand" });
        return undefined;
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === CREATE BRAND ================================================
    // =================================================================
    createBrand: async (data: BrandCreateInput) => {
      set({ loading: true, error: undefined });
      try {
        const newBrand = await brandService.createBrand(data);
        set({ brands: [...get().brands, newBrand] });
        toast.success("Brand created successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to create brand");
        set({ error: err.message || "Failed to create brand" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === UPDATE BRAND ================================================
    // =================================================================
    updateBrand: async (data: BrandUpdateInput) => {
      set({ loading: true, error: undefined });
      try {
        const updatedBrand = await brandService.updateBrand(data);
        set({
          brands: get().brands.map((b) =>
            b.id === updatedBrand.id ? updatedBrand : b
          ),
        });
        toast.success("Brand updated successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to update brand");
        set({ error: err.message || "Failed to update brand" });
      } finally {
        set({ loading: false });
      }
    },

    // =================================================================
    // === DELETE BRAND ================================================
    // =================================================================
    deleteBrand: async (id: string) => {
      set({ loading: true, error: undefined });
      try {
        await brandService.deleteBrand(id);
        set({ brands: get().brands.filter((b) => b.id !== id) });
        toast.success("Brand deleted successfully");
      } catch (err: any) {
        toast.error("Failed to delete brand");
        toast.error(err.message || "Failed to delete brand");
        set({ error: err.message || "Failed to delete brand" });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
