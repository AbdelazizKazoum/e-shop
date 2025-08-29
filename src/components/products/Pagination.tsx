import React, { FC } from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
  className = "",
}) => {
  const pages: number[] = [];

  // generate pages numbers (you can customize if you want ellipsis)
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      className={`nc-Pagination inline-flex space-x-2 text-base font-medium ${className}`}
    >
      {/* Previous Button */}
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`inline-flex w-10 h-10 items-center justify-center rounded-full ${
            p === page
              ? "bg-primary-500 text-white"
              : "bg-white border border-neutral-200 hover:bg-neutral-100"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
