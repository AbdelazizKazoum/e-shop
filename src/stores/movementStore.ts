import { create } from "zustand";
import {
  getAllStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
} from "@/services/movementService";

// Define types for stock movement and filters (customize as needed)
export interface StockMovement {
  id: string;
  type: string;
  reason: string;
  variantId: string;
  supplierId?: string;
  userId?: string;
  quantity: number;
  note?: string;
  createdAt?: string;
  // Add other fields as needed
}

export interface StockMovementFilters {
  type?: string;
  reason?: string;
  variantId?: string;
  supplierId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// --- STORE STATE AND ACTIONS ---

interface MovementState {
  movements: StockMovement[];
  selectedMovement: StockMovement | null;
  loading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  limit: number;
  totalMovements: number;
  totalPages: number;
}

interface MovementActions {
  fetchAllMovements: (
    params?: PaginationParams & StockMovementFilters
  ) => Promise<void>;
  fetchMovementById: (id: string) => Promise<void>;
  createNewMovement: (data: any) => Promise<any>;
  updateMovement: (id: string, data: any) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
  clearSelectedMovement: () => void;
  setPage: (page: number) => void;
}

type MovementStore = MovementState & MovementActions;

// --- INITIAL STATE ---

const initialState: MovementState = {
  movements: [],
  selectedMovement: null,
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  totalMovements: 0,
  totalPages: 1,
};

// --- ZUSTAND STORE CREATION ---

export const useMovementStore = create<MovementStore>((set, get) => ({
  ...initialState,

  /**
   * Fetches all stock movements with filtering and pagination.
   */
  fetchAllMovements: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { limit, currentPage } = get();
      const response = await getAllStockMovements({
        limit,
        page: params.page ?? currentPage,
        ...params,
      });
      const { data, total } = response.data;
      set({
        movements: data,
        totalMovements: total,
        totalPages: Math.ceil(total / limit),
        currentPage: params.page ?? currentPage,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch stock movements.";
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Fetches a single stock movement by its unique identifier.
   */
  fetchMovementById: async (id: string) => {
    set({ loading: true, error: null, selectedMovement: null });
    try {
      const response = await getStockMovementById(id);
      set({ selectedMovement: response.data, loading: false });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch stock movement details.";
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Creates a new stock movement.
   */
  createNewMovement: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await createStockMovement(data);
      set({ loading: false });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create stock movement.";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  /**
   * Updates an existing stock movement.
   */
  updateMovement: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateStockMovement(id, data);
      const updatedMovement = response.data;
      set((state) => ({
        movements: state.movements.map((m) =>
          m.id === id ? { ...m, ...updatedMovement } : m
        ),
        selectedMovement:
          state.selectedMovement?.id === id
            ? { ...state.selectedMovement, ...updatedMovement }
            : state.selectedMovement,
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update stock movement.";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  /**
   * Deletes a stock movement.
   */
  deleteMovement: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteStockMovement(id);
      set((state) => ({
        movements: state.movements.filter((m) => m.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete stock movement.";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  /**
   * Clears the currently selected stock movement from the state.
   */
  clearSelectedMovement: () => {
    set({ selectedMovement: null });
  },

  /**
   * Sets the current page for pagination and triggers a refetch.
   */
  setPage: (page: number) => {
    const { fetchAllMovements } = get();
    fetchAllMovements({ page });
  },
}));
