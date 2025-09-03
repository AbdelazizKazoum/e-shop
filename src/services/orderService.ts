// services/orderService.ts
import axiosClient from "@/lib/axiosClient";

// Create a new order (guest or user)
export const createOrder = (data: any) => {
  return axiosClient.post("/orders", data);
};

// Get all orders for authenticated user
export const getOrders = () => {
  return axiosClient.get("/orders");
};

// Get single order details by ID
export const getOrderById = (id: string) => {
  return axiosClient.get(`/orders/${id}`);
};

// Cancel an order (optional, if backend supports it)
export const cancelOrder = (id: string) => {
  return axiosClient.patch(`/orders/${id}/cancel`);
};
