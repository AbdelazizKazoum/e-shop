import React from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "error" | "info";
  title?: string;
  message?: string;
}

// SVG icon for the 'info' type (teal for ecommerce style)
const InfoIcon = () => (
  <svg
    className="h-12 w-12 text-teal-500"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4m0 4h.01"
      strokeWidth="2.5"
    />
  </svg>
);

// SVG icon for the 'error' type
const ErrorIcon = () => (
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
);

/**
 * A reusable modal to show notifications like errors or information.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {Function} onClose - Function to call when the modal should be closed.
 * @param {'error' | 'info'} [type='error'] - The type of notification.
 * @param {string} [title] - The title of the modal.
 * @param {string} [message] - The message to display.
 */
const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type = "error",
  title = "An Error Occurred",
  message = "An unexpected error occurred. Please try again.",
}) => {
  if (!isOpen) {
    return null;
  }

  // Configuration object to hold styles and content for each modal type
  const config = {
    info: {
      icon: <InfoIcon />,
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
      buttonClass: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
      buttonText: "OK",
    },
    error: {
      icon: <ErrorIcon />,
      iconBg: "bg-red-100 dark:bg-red-900/50",
      buttonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      buttonText: "Try Again",
    },
  };

  const currentConfig = config[type];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 opacity-100 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-5 ${currentConfig.iconBg}`}
        >
          {currentConfig.icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">
          {message}
        </p>
        <div className="mt-8">
          <button
            onClick={onClose}
            className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentConfig.buttonClass}`}
          >
            {currentConfig.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
