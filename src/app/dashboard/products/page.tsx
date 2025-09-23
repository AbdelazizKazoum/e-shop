"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Filter,
} from "lucide-react";
import { useProductStore } from "@/stores/productStore"; // Assuming this is the correct path
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";

// --- TYPE DEFINITIONS (would be in src/lib/types.ts) ---
export interface Category {
  id: string;
  displayText: string;
}

export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

// --- UI COMPONENT: PageTitle (would be in src/components/ui/PageTitle.tsx) ---
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

// --- UI COMPONENT: Pagination (would be in src/components/ui/Pagination.tsx) ---
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

// --- UI COMPONENT: ProductListSkeleton (would be in src/components/products/ProductListSkeleton.tsx) ---
const ProductListSkeleton = () => (
  <div className="w-full overflow-x-auto">
    <table className="w-full animate-pulse">
      <thead>
        <tr className="border-b border-neutral-200/70 dark:border-neutral-700/50">
          <th className="px-4 py-3 text-left">
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
          <th className="px-4 py-3 text-left">
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
          <th className="px-4 py-3 text-left">
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
          <th className="px-4 py-3 text-left">
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
          <th className="px-4 py-3 text-center">
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
          <th className="px-4 py-3 text-center">
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr
            key={i}
            className="border-b border-neutral-200/70 dark:border-neutral-700/50"
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="h-6 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700 mx-auto"></div>
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-center items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="h-8 w-8 rounded-md bg-neutral-200 dark:bg-neutral-700"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- UI COMPONENT: ProductList (would be in src/components/products/ProductList.tsx) ---
const ProductList = ({ products }: { products: Product[] }) => {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/70 dark:border-neutral-700/50">
              <th className="px-4 py-3 text-sm font-medium text-neutral-500">
                Product
              </th>
              <th className="px-4 py-3 text-sm font-medium text-neutral-500">
                Brand
              </th>
              <th className="px-4 py-3 text-sm font-medium text-neutral-500">
                Gender
              </th>
              <th className="px-4 py-3 text-sm font-medium text-neutral-500">
                Created At
              </th>
              <th className="px-4 py-3 text-sm font-medium text-neutral-500 text-center">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-medium text-neutral-500 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-700/50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image as string}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-neutral-800 dark:text-neutral-100">
                        {product.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {product.category.displayText}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                  {product.brand?.name}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                  {product.gender}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                  {product.createAt}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {product.status === "active" ? "Active" : "Archived"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                      className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card/List for mobile screens */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={product.image as string}
                alt={product.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-100">
                  {product.name}
                </p>
                <p className="text-sm text-neutral-500">
                  {product.category.displayText}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <span>
                <strong>Brand:</strong> {product.brand?.name}
              </span>
              <span>
                <strong>Gender:</strong> {product.gender}
              </span>
              <span>
                <strong>Created:</strong> {product.createAt}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
                }`}
              >
                {product.status === "active" ? "Active" : "Archived"}
              </span>
              <div className="flex gap-2">
                <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400">
                  <Eye size={18} />
                </button>
                <button
                  onClick={() =>
                    router.push(`/dashboard/products/${product.id}`)
                  }
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- UI COMPONENT: ProductFilters (would be in src/components/products/ProductFilters.tsx) ---
const ProductFilters = ({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) => {
  const [filters, setFilters] = useState({ name: "", brand: "", gender: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = { name: "", brand: "", gender: "" };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg mb-6 border border-neutral-200/70 dark:border-neutral-700/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          placeholder="Filter by name..."
          className="w-full rounded-md border-neutral-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
        />
        <input
          name="brand"
          value={filters.brand}
          onChange={handleInputChange}
          placeholder="Filter by brand..."
          className="w-full rounded-md border-neutral-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
        />
        <select
          name="gender"
          value={filters.gender}
          onChange={handleInputChange}
          className="w-full rounded-md border-neutral-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unisex">Unisex</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApply}
            className="w-full rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="w-full rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT (would be in src/app/(admin)/products/page.tsx) ---
export default function ProductsPage() {
  const { products, total, loading, fetchProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchProducts(currentPage, limit, appliedFilters);
  }, [currentPage, appliedFilters, fetchProducts]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <PageTitle
          title="Products"
          subtitle={`Manage all products in your store (${total} total)`}
        />
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
          >
            <Filter size={18} /> Filters
          </button>
          <a
            href="/dashboard/products/new"
            className="flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            <PlusCircle size={18} /> Add Product
          </a>
        </div>
      </div>

      {showFilters && <ProductFilters onApplyFilters={setAppliedFilters} />}

      <div className="rounded-lg border border-neutral-200/70 bg-white dark:border-neutral-700/50 dark:bg-neutral-800/20 p-4 md:p-6">
        {loading ? (
          <ProductListSkeleton />
        ) : (
          <ProductList products={products} />
        )}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
