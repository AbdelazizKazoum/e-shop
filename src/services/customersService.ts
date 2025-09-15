import axiosClient from "@/lib/axiosClient";
import { Customer } from "@/types/customer";

/**
 * A collection of functions for interacting with the user-related API endpoints.
 */
export const customerService = {
  /**
   * Fetches a paginated and filtered list of users.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of items per page (default: 10).
   * @param filters - Optional filters for users.
   * @returns A promise that resolves to an object containing user data and pagination info.
   */
  async fetchAllCustomers(
    page = 1,
    limit = 10,
    filters?: any
  ): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    try {
      const res = await axiosClient.get(`/users`, {
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
   * Retrieves a single user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the user's data.
   */
  async getCustomerById(id: string): Promise<Customer> {
    try {
      const res = await axiosClient.get(`/users/${id}`);
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Retrieves a single user by their email.
   * @param email - The email of the user to retrieve.
   * @returns A promise that resolves to the user's data.
   */
  async getCustomerByEmail(email: string): Promise<Customer> {
    try {
      const res = await axiosClient.get(`/users/email/${email}`);
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
