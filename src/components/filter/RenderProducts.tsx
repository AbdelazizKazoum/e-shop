"use client";

import React, { FC, useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCardTest";
import { useProductStore } from "@/stores/productStore";
import { useFilterStore } from "@/stores/filterStore";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

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
}: {
  initialProducts: Product[];
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
  const sizes = useFilterStore((state) => state.sizes);
  const priceRange = useFilterStore((state) => state.priceRange);
  // Add any other filters you need here in the same way

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ FIX: Use the individual state values in the dependency array.
  // React can now correctly track when they actually change.
  useEffect(() => {
    if (!hasMounted) return;

    const queryFilters = {
      categories: categories,
      sizes: sizes,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    fetchProductsClient(page, limit, queryFilters);
  }, [
    categories,
    sizes,
    priceRange,
    page,
    limit,
    fetchProductsClient,
    hasMounted,
  ]);

  const productsToDisplay =
    storeProducts.length > 0 ? storeProducts : initialProducts;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1">
      {loading ? (
        <ProductGridSkeleton />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
          {productsToDisplay.map((item) => (
            <ProductCard data={item} key={item.id} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {total > 0 && !loading && (
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
      )}
    </div>
  );
}
