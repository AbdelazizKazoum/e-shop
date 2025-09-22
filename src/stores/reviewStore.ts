import { create } from "zustand";
import { reviewService } from "@/services/reviewService";
import { Review, ReviewCreateInput, ReviewUpdateInput } from "@/types/review";
import { toast } from "react-toastify";

type ReviewState = {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  averageRating: number | null;
  reviewCount: number | null;
  loading: boolean;
  error: string | null;
  fetchReviews: (
    productId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchAverageRating: (productId: string) => Promise<void>;
  setPage: (newPage: number) => void;
  setLimit: (newLimit: number) => void;
  addReview: (data: ReviewCreateInput) => Promise<void>;
  updateReview: (
    id: string,
    userId: string,
    data: ReviewUpdateInput
  ) => Promise<void>;
  deleteReview: (id: string, userId: string) => Promise<void>;
};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  total: 0,
  page: 1,
  limit: 10,
  averageRating: null,
  reviewCount: null,
  loading: false,
  error: null,

  fetchReviews: async (productId: string, page?: number, limit?: number) => {
    set({ loading: true, error: null });
    try {
      const currentPage = page ?? get().page;
      const currentLimit = limit ?? get().limit;
      const res = await reviewService.getProductReviews(
        productId,
        currentPage,
        currentLimit
      );
      set({
        reviews: res.data,
        total: res.total,
        page: res.page,
        limit: res.limit,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch reviews.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchAverageRating: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const avg = await reviewService.getProductAverageRating(productId);
      set({
        averageRating: avg.rating,
        reviewCount: avg.reviewCount,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch average rating.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  setPage: (newPage: number) => {
    set({ page: newPage });
    // Refetch reviews for the current productId
    // You may need to store the current productId in the store for this to work seamlessly
  },

  setLimit: (newLimit: number) => {
    set({ limit: newLimit, page: 1 });
    // Refetch reviews for the current productId
    // You may need to store the current productId in the store for this to work seamlessly
  },

  addReview: async (data: ReviewCreateInput) => {
    set({ loading: true, error: null });
    try {
      await reviewService.createReview(data);
      toast.success("Review added!");
      get().fetchReviews(data.productId, get().page, get().limit);
      get().fetchAverageRating(data.productId);
      set({ loading: false });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Failed to add review.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage); // <-- Ensure error is shown
    }
  },

  updateReview: async (id: string, userId: string, data: ReviewUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const updated = await reviewService.updateReview(id, userId, data);
      toast.success("Review updated!");
      if (typeof updated.product.id === "string") {
        get().fetchReviews(updated.product.id, get().page, get().limit);
        get().fetchAverageRating(updated.product.id);
      } else {
        toast.error("Product ID is missing after update.");
      }
      set({ loading: false });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update review.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  deleteReview: async (id: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      const review = get().reviews.find((r) => r.id === id);
      await reviewService.deleteReview(id, userId);
      toast.success("Review deleted!");
      if (review && typeof review.product.id === "string") {
        get().fetchReviews(review.product.id, get().page, get().limit);
        get().fetchAverageRating(review.product.id);
      } else if (review) {
        toast.error("Product ID is missing for the deleted review.");
      }
      set({ loading: false });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete review.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));
