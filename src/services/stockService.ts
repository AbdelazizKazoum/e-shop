import axiosClient from "@/lib/axiosClient";

export const stockService = {
  // Get stock quantity for a single variant by its ID
  async getStockQuantityByVariant(variantId: string) {
    try {
      const response = await axiosClient.get(`/stock/variant/${variantId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get stock quantities for multiple variants by their IDs
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
