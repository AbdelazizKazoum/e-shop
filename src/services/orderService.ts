import axiosClient from "@/lib/axiosClient";
import {
  OrderFilters,
  OrderStatus,
  PaginationParams,
  PaymentStatus,
} from "@/types/order";

export interface UpdateOrderData {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

/**
 * Creates a new order.
 * @param data - The order creation data.
 */
export const createOrder = (data: any) => {
  console.log("🚀 ~ createOrder ~ data:", data);
  return axiosClient.post("/orders", data);
};

/**
 * Fetches orders with pagination and filtering.
 * @param params - An object containing pagination and filter options.
 */
export const getAllOrders = (params: PaginationParams & OrderFilters) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  Object.entries(params).forEach(([key, value]) => {
    if (
      key !== "page" &&
      key !== "limit" &&
      value !== undefined &&
      value !== "" &&
      value !== null
    ) {
      queryParams.append(key, String(value));
    }
  });

  return axiosClient.get(`/orders?${queryParams.toString()}`);
};

/**
 * Gets a single order's details by its ID.
 * @param id - The unique identifier of the order.
 */
export const getOrderById = (id: string) => {
  return axiosClient.get(`/orders/${id}`);
};

/**
 * Updates an order's status or payment status.
 * @param id - The ID of the order to update.
 * @param data - An object containing the new status and/or paymentStatus.
 */
export const updateOrder = (id: string, data: UpdateOrderData) => {
  return axiosClient.patch(`/orders/${id}`, data);
};

/**
 * Cancels an order.
 * @param id - The unique identifier of the order to cancel.
 */
export const cancelOrder = (id: string) => {
  return axiosClient.patch(`/orders/${id}/cancel`);
};
