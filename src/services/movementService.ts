import axiosClient from "@/lib/axiosClient";

/**
 * Fetches stock movements with optional pagination and filters.
 * @param params - An object containing pagination and filter options.
 */
export const getAllStockMovements = (
  params: { page?: number; limit?: number; [key: string]: any } = {}
) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

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

  return axiosClient.get(`/stock-movements?${queryParams.toString()}`);
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
