import React, { useState } from "react";
import Input from "@/shared/Input/Input";
import Textarea from "@/shared/Textarea/Textarea";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { useReviewStore } from "@/stores/reviewStore";
import { ReviewCreateInput } from "@/types/review";
import { StarIcon } from "@heroicons/react/24/solid";

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  userId?: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  open,
  onClose,
  productId,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const addReview = useReviewStore((state) => state.addReview);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the overlay itself is clicked, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data: ReviewCreateInput = {
      productId,
      title,
      rating,
      comment,
    };
    await addReview(data);
    setLoading(false);
    onClose();
    setTitle("");
    setRating(5);
    setComment("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleOverlayClick}
      aria-label="Close modal overlay"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
      >
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <div className="px-6 pt-6 pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold">Add a Review</h3>
        </div>
        <div className="px-6 py-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Review title"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    <StarIcon
                      className={`w-7 h-7 ${
                        (hoverRating ?? rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-500">
                  {rating} / 5
                </span>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Write your review..."
              />
            </div>
            <ButtonPrimary type="submit" loading={loading}>
              Submit Review
            </ButtonPrimary>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
