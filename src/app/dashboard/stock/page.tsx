"use client";

import React, { useState, useEffect, FormEvent, useMemo } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useStockStore } from "@/stores/stockStore";
import { Stock } from "@/types/stock";
import Image from "next/image";

// --- HOOK for Debouncing ---
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- UI COMPONENTS ---

const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div>
    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 md:text-3xl">
      {title}
    </h1>
    {subtitle && <p className="text-neutral-500">{subtitle}</p>}
  </div>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, id, ...props }, ref) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    />
  </div>
));
Input.displayName = "Input";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
>(({ label, id, children, ...props }, ref) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {label}
    </label>
    <select
      id={id}
      ref={ref}
      {...props}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {children}
    </select>
  </div>
));
Select.displayName = "Select";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-primary-500 text-white"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-sm">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const FilterHeader = ({
  onFilter,
  onSearch,
}: {
  onFilter: (filters: any) => void;
  onSearch: (term: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    onFilter(filters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Filter size={16} />
          <span>Filters</span>
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={16}
          />
        </button>
      </div>
      {isOpen && (
        <form
          onSubmit={handleFilterSubmit}
          className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border dark:border-neutral-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              name="minQte"
              label="Min Quantity"
              type="number"
              placeholder="e.g., 10"
            />
            <Input
              name="maxQte"
              label="Max Quantity"
              type="number"
              placeholder="e.g., 100"
            />
            <Select name="sortBy" label="Sort By">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="reset"
              className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const StockListSkeleton = () => (
  <div className="animate-pulse">
    <div className="hidden md:grid md:grid-cols-10 gap-4 p-4 mb-2">
      <div className="col-span-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
      <div className="col-span-2 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
    </div>
    <div className="space-y-4 md:space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg md:grid md:grid-cols-10 items-center gap-4"
        >
          <div className="col-span-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
              <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
            </div>
          </div>
          <div className="col-span-2 h-5 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 flex justify-end items-center gap-2 mt-2 md:mt-0">
            <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StockList = ({ items }: { items: Stock[] }) => {
  const quantityColor = (q: number) => {
    if (q === 0) return "text-red-500 font-bold";
    if (q <= 10) return "text-orange-500 font-semibold";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <div>
      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-10 gap-4 p-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 border-b dark:border-neutral-700">
        <div className="col-span-4">Product</div>
        <div className="col-span-2 text-center">In Stock</div>
        <div className="col-span-2">Last Updated</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {/* Table Body */}
      <div className="space-y-4 md:space-y-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg md:rounded-none md:grid md:grid-cols-10 md:gap-4 md:items-center border-b dark:border-neutral-700/50 last:border-b-0 md:border-b"
          >
            <div className="md:col-span-4 flex items-center gap-4">
              <Image
                src={item.variant.product.image as string}
                alt={item.variant.product.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-md object-cover bg-neutral-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium text-neutral-800 dark:text-neutral-100 truncate">
                  {item.variant.product.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>{item.variant.size}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full border border-neutral-300"
                      style={{ backgroundColor: item.variant.color }}
                    ></span>
                    <span className="font-mono text-xs">
                      {item.variant.color}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`mt-2 md:mt-0 md:col-span-2 text-center md:text-lg ${quantityColor(
                item.quantity
              )}`}
            >
              <span className="md:hidden text-sm font-medium text-neutral-400">
                In Stock:{" "}
              </span>
              {item.quantity}
            </div>
            <div className="mt-2 md:mt-0 md:col-span-2 text-sm text-neutral-500">
              <span className="md:hidden font-medium text-neutral-400">
                Updated:{" "}
              </span>
              {new Date(item.updated).toLocaleDateString()}
            </div>
            <div className="mt-4 md:mt-0 md:col-span-2 flex justify-end items-center gap-2">
              <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <Edit size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function StockPage() {
  // Local state for UI interaction
  const [searchTerm, setSearchTerm] = useState("");

  // State from Zustand store
  const {
    stockItems,
    total,
    page,
    limit,
    loading,
    fetchStock,
    setFilters,
    setPage,
  } = useStockStore();

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Initial fetch and fetch on search term change
  useEffect(() => {
    // Fetch only if the store is empty to preserve data, or if searching
    if (
      useStockStore.getState().stockItems.length === 0 ||
      debouncedSearchTerm
    ) {
      fetchStock(1, limit, { productName: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, fetchStock, limit]);

  // Calculate total pages based on store's total
  const totalPages = Math.ceil(total / limit);

  const handleFilter = (newFilters: any) => {
    console.log("Applying filters:", newFilters);
    // setFilters action will reset page to 1 and fetch data
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    // Update local search term immediately for responsive UI
    setSearchTerm(term);
  };

  const handleReload = () => {
    console.log("Reloading data...");
    // Force a refetch of the current page and filters
    fetchStock(page, limit, useStockStore.getState().filters);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Stock Management"
          subtitle={`View and manage inventory levels (${total} items)`}
        />
        <button
          onClick={handleReload}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Reload Data</span>
        </button>
      </div>
      <div className="mt-8">
        <FilterHeader onFilter={handleFilter} onSearch={handleSearch} />
        <div className="nc-box-has-hover nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading && stockItems.length === 0 ? (
            <StockListSkeleton />
          ) : (
            <StockList items={stockItems} />
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
