import axiosClient from "@/lib/axiosClient";
import { Review, ReviewCreateInput, ReviewUpdateInput } from "@/types/review";

// Define the return type for average rating response
export type ProductAverageRatingResponse = {
  rating: number;
  reviewCount: number;
};

export const reviewService = {
  // =================================================================
  // === CREATE REVIEW ===============================================
  // =================================================================
  async createReview(data: ReviewCreateInput): Promise<Review> {
    const res = await axiosClient.post(`/reviews`, data);
    return res.data;
  },

  // =================================================================
  // === GET REVIEWS FOR PRODUCT (Paginated) =========================
  // =================================================================
  async getProductReviews(
    productId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const res = await axiosClient.get(`/reviews/product/${productId}`, {
      params,
    });
    return res.data;
  },

  // =================================================================
  // === GET PRODUCT AVERAGE RATING ==================================
  // =================================================================
  async getProductAverageRating(
    productId: string
  ): Promise<ProductAverageRatingResponse> {
    const res = await axiosClient.get(
      `/reviews/product/${productId}/average-rating`
    );
    return res.data;
  },

  // =================================================================
  // === UPDATE REVIEW ===============================================
  // =================================================================
  async updateReview(
    id: string,
    userId: string,
    data: ReviewUpdateInput
  ): Promise<Review> {
    const res = await axiosClient.patch(`/reviews/${id}`, { userId, ...data });
    return res.data;
  },

  // =================================================================
  // === DELETE REVIEW ===============================================
  // =================================================================
  async deleteReview(id: string, userId: string): Promise<void> {
    await axiosClient.delete(`/reviews/${id}`, { data: { userId } });
  },
};
