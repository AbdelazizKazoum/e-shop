import React from "react";

interface FailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

/**
 * A modern, reusable modal to indicate a failed operation.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {Function} onClose - Function to call when the modal should be closed.
 * @param {string} [message] - The error message to display.
 */
const FailedModal: React.FC<FailedModalProps> = ({
  isOpen,
  onClose,
  message = "An unexpected error occurred. Please try again.",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 opacity-100 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/50 mb-5">
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Order Submission Failed
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">
          {message}
        </p>
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
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

export default FailedModal;
