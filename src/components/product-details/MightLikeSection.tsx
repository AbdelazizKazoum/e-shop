// MightLikeSection.tsx

"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import NextPrev from "@/shared/NextPrev/NextPrev";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import ProductCardSmall from "../products/ProductCardSmall";
import { useProductStore } from "@/stores/productStore";

// Simple skeleton loader for product cards
const ProductCardSmallSkeleton: FC = () => (
  <div className="animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800 h-64 w-full flex flex-col items-center justify-center">
    <div className="h-32 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
  </div>
);

const DEFAULT_CATEGORY = "Accessoires";

const MightLikeSection: FC = () => {
  const [slider, setSlider] = useState<any>(null);
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  // Store hooks
  const { productsByCategory, loading, fetchProductsByCategory } =
    useProductStore();

  // Fetch products by category if not already loaded
  useEffect(() => {
    if (
      !productsByCategory ||
      productsByCategory.length === 0 ||
      (productsByCategory[0]?.category?.displayText !== DEFAULT_CATEGORY &&
        productsByCategory[0]?.category?.category !== DEFAULT_CATEGORY)
    ) {
      fetchProductsByCategory(DEFAULT_CATEGORY);
    }
    // eslint-disable-next-line
  }, []);

  // Glide slider setup
  useEffect(() => {
    const OPTIONS = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { perView: 3 },
        1024: { gap: 20, perView: 3 },
        768: { gap: 20, perView: 2 },
        640: { gap: 20, perView: 1.5 },
        500: { gap: 20, perView: 1.3 },
      },
    };
    if (!sliderRef.current) return;
    let glideSlider = new Glide(sliderRef.current, OPTIONS);
    glideSlider.mount();
    setSlider(glideSlider);
    setIsShow(true);
    return () => {
      glideSlider.destroy();
    };
  }, [sliderRef, productsByCategory]);

  // If loading, show skeletons
  if (loading) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Accessories you might like
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <ProductCardSmallSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // If there are no products to suggest, don't render the section
  if (!productsByCategory || productsByCategory.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Accessories you might like
        </h2>
        <NextPrev
          onClickNext={() => slider && slider.go(">")}
          onClickPrev={() => slider && slider.go("<")}
        />
      </div>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {productsByCategory.map((product, index) => (
              <li key={product.id} className="glide__slide">
                <ProductCardSmall data={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MightLikeSection;
