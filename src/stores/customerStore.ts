import { create } from "zustand";
import { customerService } from "@/services/customersService";
import { Customer } from "@/types/customer";

// --- STORE STATE AND ACTIONS ---

// Defines the shape of the store's state
interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  limit: number;
  totalCustomers: number;
  totalPages: number;
}

// Defines the actions available in the store
interface CustomerActions {
  fetchAllCustomers: (params: { page: number; filters?: any }) => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  clearSelectedCustomer: () => void;
  setPage: (page: number) => void;
}

// Combines state and actions into a single type for the store
type CustomerStore = CustomerState & CustomerActions;

// --- INITIAL STATE ---

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10, // Default items per page
  totalCustomers: 0,
  totalPages: 1,
};

// --- ZUSTAND STORE CREATION ---

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  ...initialState,

  /**
   * Fetches all customers with filtering and pagination.
   */
  fetchAllCustomers: async (params) => {
    set({ loading: true, error: null });
    try {
      const { limit } = get();
      const response = await customerService.fetchAllCustomers(
        params.page,
        limit,
        params.filters
      );

      const { data, total } = response;

      set({
        customers: data,
        totalCustomers: total,
        totalPages: Math.ceil(total / limit),
        currentPage: params.page,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch customers.";
      console.error("Error fetching customers:", err);
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Fetches a single customer by their unique identifier.
   */
  fetchCustomerById: async (id: string) => {
    set({ loading: true, error: null, selectedCustomer: null });
    try {
      const response = await customerService.getCustomerById(id);
      set({ selectedCustomer: response, loading: false });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch customer details.";
      console.error(`Error fetching customer ${id}:`, err);
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Clears the currently selected customer from the state.
   */
  clearSelectedCustomer: () => {
    set({ selectedCustomer: null });
  },

  /**
   * Sets the current page for pagination and triggers a refetch.
   */
  setPage: (page: number) => {
    const { fetchAllCustomers } = get();
    // Note: This will refetch with the last used filters.
    // You might want to store filters in the state if they need to persist across page changes.
    fetchAllCustomers({ page });
  },
}));
