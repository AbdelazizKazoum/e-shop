import { Dialog, Transition } from "@/app/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment, useEffect } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import { useReviewStore } from "@/stores/reviewStore";

// Simple skeleton loader for reviews
const ReviewSkeleton = () => (
  <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-32 w-full mb-6" />
);

export interface ModalViewAllReviewsProps {
  productId: string;
  show: boolean;
  onCloseModalViewAllReviews: () => void;
}

const ModalViewAllReviews1: FC<ModalViewAllReviewsProps> = ({
  productId,
  show,
  onCloseModalViewAllReviews,
}) => {
  const {
    reviews,
    total,
    averageRating,
    loading,
    fetchReviews,
    fetchAverageRating,
    page,
    limit,
  } = useReviewStore();

  useEffect(() => {
    if (show && productId) {
      fetchReviews(productId, page, limit);
      fetchAverageRating(productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, productId]);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModalViewAllReviews}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block py-8 h-screen w-full max-w-5xl">
              <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    View all reviews
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModalViewAllReviews} />
                  </span>
                </div>
                <div className="px-8 my-5 flex justify-between flex-wrap">
                  {loading ? (
                    <div className="flex items-center">
                      <StarIcon className="w-7 h-7 mb-0.5 text-gray-300 animate-pulse" />
                      <span className="ml-1.5 text-gray-400 animate-pulse">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-semibold flex items-center">
                      <StarIcon className="w-7 h-7 mb-0.5 text-yellow-400" />
                      <span className="ml-1.5">
                        {averageRating?.toFixed(2) || 0} · {total} Reviews
                      </span>
                    </h2>
                  )}
                  <SortOrderFilter
                    className="my-2"
                    data={[
                      { name: "Sort order" },
                      { name: "Newest rating" },
                      { name: "Highest rating" },
                      { name: "Lowest rating" },
                    ]}
                  />
                </div>
                <div className="px-8 py-8 border-t border-slate-200 dark:border-slate-700 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <ReviewSkeleton key={idx} />
                    ))
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewItem
                        key={review.id}
                        data={{
                          name:
                            review.user?.firstName +
                              " " +
                              review.user?.lastName || "Anonymous",
                          avatar: review.user?.image || undefined,
                          date: new Date(
                            review.reviewDate
                          ).toLocaleDateString(),
                          comment: review.comment,
                          starPoint: review.rating,
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-slate-500 text-center">
                      No reviews yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalViewAllReviews1;
