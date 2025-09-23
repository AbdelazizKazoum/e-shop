"use client";
import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import ReviewItem from "@/components/ReviewItem";
import { Review } from "@/types/review";
import AddReviewModal from "../modals/AddReviewModal";
import { User } from "next-auth";
import ModalViewAllReviews1 from "@/app/(client)/product-detail/ModalViewAllReviews1";
import { useReviewStore } from "@/stores/reviewStore";

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  onAddReview?: () => void;
  product: { id: string };
  user?: User; // Assuming user object with at least an id
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  rating,
  reviewCount,
  reviews,
  onAddReview,
  product,
  user,
}) => {
  console.log("🚀 ~ ProductReviews ~ user:", user);
  const [showModal, setShowModal] = useState(false);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);

  // Get latest values from the store
  const averageRating = useReviewStore((s) => s.averageRating);
  const storeReviewCount = useReviewStore((s) => s.reviewCount);
  const storeReviews = useReviewStore((s) => s.reviews);

  // Use store values if available, otherwise fallback to props
  const displayRating = averageRating ?? rating;
  const displayReviewCount = storeReviewCount ?? reviewCount;

  // Use first 2 reviews from the store if available, otherwise fallback to props
  const displayReviews =
    storeReviews && storeReviews.length > 0
      ? storeReviews.slice(0, 2)
      : reviews.slice(0, 2);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5">
            {displayRating || 0} · {displayReviewCount || 0} Reviews
          </span>
        </h2>
        <ButtonSecondary
          className="border border-slate-300 dark:border-slate-700"
          onClick={() => setShowModal(true)}
        >
          Add a Review
        </ButtonSecondary>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
          {displayReviews.length > 0 ? (
            displayReviews.map((review) => (
              <ReviewItem
                key={review.id}
                data={{
                  name:
                    review.user?.firstName + " " + review.user?.lastName ||
                    "Anonymous",
                  avatar: review.user?.image || undefined,
                  date: new Date(review.reviewDate).toLocaleDateString("en-US"),
                  comment: review.comment,
                  starPoint: review.rating,
                }}
              />
            ))
          ) : (
            <div className="text-slate-500 col-span-2">No reviews yet.</div>
          )}
        </div>
        <ButtonSecondary
          onClick={() => setIsOpenModalViewAllReviews(true)}
          className="mt-10 border border-slate-300 dark:border-slate-700 "
        >
          Show me all {displayReviewCount || 0} reviews
        </ButtonSecondary>
      </div>
      <AddReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        productId={product.id}
        userId={user?.id}
      />

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews1
        productId={product.id}
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  );
};

export default ProductReviews;
