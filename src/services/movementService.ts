import axiosClient from "@/lib/axiosClient";

/**
 * Create a new stock movement.
 */
export const createStockMovement = (data: any) => {
  return axiosClient.post("/stock-movements", data);
};

/**
 * Fetch all stock movements with optional filters and pagination.
 */
export const getAllStockMovements = (
  params: {
    page?: number;
    limit?: number;
    type?: string;
    reason?: string;
    variantId?: string;
    supplierId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  return axiosClient.get(`/stock-movements?${queryParams.toString()}`);
};

/**
 * Fetch a single stock movement by ID.
 */
export const getStockMovementById = (id: string) => {
  return axiosClient.get(`/stock-movements/${id}`);
};

/**
 * Update a stock movement by ID.
 */
export const updateStockMovement = (id: string, data: any) => {
  return axiosClient.patch(`/stock-movements/${id}`, data);
};

/**
 * Delete a stock movement by ID.
 */
export const deleteStockMovement = (id: string) => {
  return axiosClient.delete(`/stock-movements/${id}`);
};

/**
 * Fetches variants by product name with optional pagination.
 * @param params - An object containing productName, page, and limit.
 */
export const getVariantsByProductName = (params: {
  productName: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("productName", params.productName);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  return axiosClient.get(
    `/products/variants/variants-by-product-name?${queryParams.toString()}`
  );
};
