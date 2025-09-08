import { create } from "zustand";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
} from "@/services/orderService";
import {
  Order,
  OrderFilters,
  PaginationParams,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

// --- STORE STATE AND ACTIONS ---

// Defines the shape of the store's state
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}

// Defines the actions available in the store
interface OrderActions {
  fetchAllOrders: (
    params: Omit<PaginationParams, "limit"> & OrderFilters
  ) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createNewOrder: (data: any) => Promise<any>;
  updateOrder: (
    id: string,
    data: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => Promise<void>;
  clearSelectedOrder: () => void;
  setPage: (page: number) => void;
}

// Combines state and actions into a single type for the store
type OrderStore = OrderState & OrderActions;

// --- INITIAL STATE ---

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10, // Default items per page
  totalOrders: 0,
  totalPages: 1,
};

// --- ZUSTAND STORE CREATION ---

export const useOrderStore = create<OrderStore>((set, get) => ({
  ...initialState,

  /**
   * Fetches all orders with filtering and pagination.
   */
  fetchAllOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      const { limit } = get();
      const response = await getAllOrders({
        limit,
        ...params,
      });

      const { data, total } = response.data;

      set({
        orders: data,
        totalOrders: total,
        totalPages: Math.ceil(total / limit),
        currentPage: params.page,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch orders.";
      console.error("Error fetching orders:", err);
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Fetches a single order by its unique identifier.
   */
  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null, selectedOrder: null });
    try {
      const response = await getOrderById(id);
      set({ selectedOrder: response.data, loading: false });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch order details.";
      console.error(`Error fetching order ${id}:`, err);
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Creates a new order.
   */
  createNewOrder: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await createOrder(data);
      set({ loading: false });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create order.";
      console.error("Error creating order:", err);
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  /**
   * Updates an existing order.
   */
  updateOrder: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await updateOrder(id, data);
      const updatedOrder = response.data;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, ...updatedOrder } : order
        ),
        selectedOrder:
          state.selectedOrder?.id === id
            ? { ...state.selectedOrder, ...updatedOrder }
            : state.selectedOrder,
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order.";
      console.error(`Error updating order ${id}:`, err);
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  /**
   * Clears the currently selected order from the state.
   */
  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },

  /**
   * Sets the current page for pagination and triggers a refetch.
   */
  setPage: (page: number) => {
    const { fetchAllOrders } = get();
    // Note: This will refetch with the last used filters.
    // Consider storing filters in state if they need to persist across page changes independently.
    fetchAllOrders({ page });
  },
}));
