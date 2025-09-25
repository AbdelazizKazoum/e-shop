"use client";

import React, { FC, useEffect, useState, useRef } from "react";
import { Product } from "@/types/product";
import { useProductStore } from "@/stores/productStore";
import { useFilterStore } from "@/stores/filterStore";
import ProductCard from "../products/ProductCardTest";
import Pagination from "../products/Pagination";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

// --- SKELETON COMPONENT for loading state ---
const ProductGridSkeleton = () => (
  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- CLIENT COMPONENT for rendering products ---
export function RenderProducts({
  initialProducts,
  className,
}: {
  initialProducts: Product[];
  className?: string;
}) {
  const {
    products: storeProducts,
    loading,
    page,
    limit,
    total,
    fetchProductsClient,
    setPage,
  } = useProductStore();

  // ✅ FIX: Select each piece of state individually.
  // This avoids creating a new object on every render.
  const categories = useFilterStore((state) => state.categories);
  const brands = useFilterStore((state) => state.brands); // 👈 Add this line
  const sizes = useFilterStore((state) => state.sizes);
  const priceRange = useFilterStore((state) => state.priceRange);
  const sortOrder = useFilterStore((state) => state.sortOrder);
  const gender = useFilterStore((state) => state.gender);
  const name = useFilterStore((state) => state.name); // 👈 added
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // Add any other filters you need here in the same way

  const [hasMounted, setHasMounted] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const isUnmounting = useRef(false);

  // Reset filters only when the component is truly unmounting
  useEffect(() => {
    isUnmounting.current = false;
    return () => {
      isUnmounting.current = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isUnmounting.current) {
        resetFilters();
      }
    };
  }, [resetFilters]);

  // ✅ FIX: Use the individual state values in the dependency array.
  // React can now correctly track when they actually change.
  useEffect(() => {
    if (categories.length <= 0 && brands.length <= 0) {
      if (!hasMounted) return;
    }

    const queryFilters = {
      name,
      categories: categories,
      brands: brands, // 👈 Add brands to filters
      sizes: sizes,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortOrder,
      gender,
    };

    setFiltersApplied(true);

    fetchProductsClient(page, limit, queryFilters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categories,
    brands, // 👈 Add brands to dependencies
    sizes,
    priceRange,
    sortOrder,
    gender,
    page,
    limit,
    name,
    fetchProductsClient,
  ]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ only switch to storeProducts if filters/pagination were applied
  const productsToDisplay = filtersApplied ? storeProducts : initialProducts;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1">
      {loading ? (
        <ProductGridSkeleton />
      ) : productsToDisplay.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Aucun produit trouvé
        </div>
      ) : (
        <div className={className}>
          {productsToDisplay.map((item) => (
            <ProductCard data={item} key={item.id} isLiked={false} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {/* {total > 0 && !loading && productsToDisplay.length > 0 && (
        <div className="flex justify-center mt-16">
          <nav className="flex items-center gap-2">
            <ButtonCircle
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="!flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </ButtonCircle>
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <ButtonCircle
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="!flex items-center justify-center"
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </nav>
        </div>
      )} */}

      {/* PAGINATION */}
      {total > 0 && !loading && productsToDisplay.length > 0 && (
        <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          <ButtonPrimary
            loading={loading}
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Show me more
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}
