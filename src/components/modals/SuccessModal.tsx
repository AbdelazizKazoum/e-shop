import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A modern, reusable success modal component.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {Function} onClose - Function to call when the modal should be closed.
 */
const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      // Added an onClick to the backdrop to close the modal, which is a common UX pattern.
      // The e.stopPropagation() on the modal content itself prevents it from closing when clicking inside the card.
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 opacity-100 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/50 mb-5">
          <svg
            className="h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Order Placed Successfully!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">
          Thank you for your purchase. You&lsquo;ll receive a confirmation email
          with your order details shortly.
        </p>
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-950 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// You might want to add this simple animation to your global CSS file (e.g., globals.css)
/*
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
*/

export default SuccessModal;
