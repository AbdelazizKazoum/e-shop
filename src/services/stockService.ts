// services/stockService.ts
import axiosClient from "@/lib/axiosClient";
import { Stock } from "@/types/stock";

/**
 * A collection of functions for interacting with the stock-related API endpoints.
 */
export const stockService = {
  /**
   * Fetches a paginated and filtered list of stock items.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of items per page (default: 10).
   * @param filters - Optional filters for product name, quantity, and sorting.
   * @returns A promise that resolves to an object containing stock data and pagination info.
   */
  async fetchAllStock(
    page = 1,
    limit = 10,
    filters?: {
      productName?: string;
      minQte?: number;
      maxQte?: number;
      sortBy?: "newest" | "oldest";
    }
  ): Promise<{ data: Stock[]; total: number; page: number; limit: number }> {
    try {
      const res = await axiosClient.get(`/stock`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Retrieves the stock quantity for a single variant by its ID.
   * @param variantId - The ID of the variant to check.
   * @returns A promise that resolves to the stock information for the variant.
   */
  async getStockQuantityByVariant(variantId: string) {
    try {
      const response = await axiosClient.get(`/stock/variant/${variantId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Retrieves stock quantities for multiple variants by their IDs.
   * @param variantIds - An array of variant IDs.
   * @returns A promise that resolves to a list of stock quantities for the given variants.
   */
  async getQuantitiesForVariants(variantIds: string[]) {
    try {
      const response = await axiosClient.post(`/stock/quantities-by-variants`, {
        variantIds,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
