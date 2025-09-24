"use client";
import React, { useState } from "react";
import { StarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import ReviewItem from "@/components/ReviewItem";
import { Review } from "@/types/review";
import AddReviewModal from "../modals/AddReviewModal";
import { User } from "next-auth";
import ModalViewAllReviews1 from "@/app/(client)/product-detail/ModalViewAllReviews1";
import { useReviewStore } from "@/stores/reviewStore";
import { useRouter, usePathname } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  onAddReview?: () => void;
  product: { id: string };
  user?: User;
}

const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}> = ({ open, onClose, onLogin, onSignup }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        <div className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            You must log in to leave a review on this product.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <ButtonPrimary onClick={onLogin}>Login</ButtonPrimary>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              New user?{" "}
              <button
                onClick={onSignup}
                className="text-green-600 hover:underline font-medium"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({
  rating,
  reviewCount,
  reviews,
  onAddReview,
  product,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

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

  const handleAddReviewClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const handleSignup = () => {
    router.push(`/signup?callbackUrl=${encodeURIComponent(pathname)}`);
  };

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
          onClick={handleAddReviewClick}
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

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
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
