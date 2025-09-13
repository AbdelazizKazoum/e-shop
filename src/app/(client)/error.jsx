"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl shadow-blue-500/10">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          An unexpected error has occurred. We&#39;ve been notified and are
          looking into it. Please try again.
        </p>

        {/* Optional: Display error message during development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg p-4 mb-6 text-left">
            <p className="font-mono">
              {error?.message || "No error message available."}
            </p>
          </div>
        )}

        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
