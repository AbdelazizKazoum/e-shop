import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {title && (
          <div className="px-6 pt-6 pb-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="px-6 py-6">{children}</div>
      </div>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
    </div>
  );
};

export default Modal;
