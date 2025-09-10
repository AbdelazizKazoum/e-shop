// stores/stockStore.ts
import { create } from "zustand";
import { stockService } from "@/services/stockService";
import { Stock } from "@/types/stock";
import { toast } from "react-toastify";

// Define the filters type
type StockFilters = {
  productName?: string;
  minQte?: number;
  maxQte?: number;
  sortBy?: "newest" | "oldest";
};

// Define the state and actions
type StockState = {
  stockItems: Stock[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  filters: StockFilters;
  fetchStock: (
    page?: number,
    limit?: number,
    filters?: StockFilters
  ) => Promise<void>;
  setFilters: (newFilters: StockFilters) => void;
  setPage: (newPage: number) => void;
};

/**
 * Zustand store for managing stock-related state.
 */
export const useStockStore = create<StockState>((set, get) => ({
  // Initial state
  stockItems: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  filters: {},

  /**
   * Fetches stock items from the service with pagination and filters.
   */
  fetchStock: async (page, limit, filters) => {
    set({ loading: true, error: null });
    try {
      const {
        page: currentPage,
        limit: currentLimit,
        filters: currentFilters,
      } = get();
      const response = await stockService.fetchAllStock(
        page ?? currentPage,
        limit ?? currentLimit,
        filters ?? currentFilters
      );
      set({
        stockItems: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch stock.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  /**
   * Updates the filters and refetches the stock data.
   * @param newFilters - The new filter values to apply.
   */
  setFilters: (newFilters: StockFilters) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters, page: 1 }); // Reset to page 1 on filter change
    get().fetchStock(1, get().limit, updatedFilters);
  },

  /**
   * Sets the current page and fetches the corresponding stock data.
   * @param newPage - The new page number.
   */
  setPage: (newPage: number) => {
    set({ page: newPage });
    get().fetchStock(newPage, get().limit, get().filters);
  },
}));
