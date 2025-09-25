"use client";

import React, { useEffect, useRef, useState } from "react";
import Heading from "./Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { Brand } from "@/types/brand";
import BrandCard from "./cards/BrandCard";

const COLORS = ["bg-yellow-50", "bg-red-50", "bg-blue-50", "bg-green-50"];

const DiscoverBrands = ({ brands = [] }: { brands: Brand[] }) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 2.8,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: { gap: 28, perView: 2.5 },
        1279: { gap: 20, perView: 2.15 },
        1023: { gap: 20, perView: 1.6 },
        768: { gap: 20, perView: 1.2 },
        500: { gap: 20, perView: 1.3 },
      },
    };
    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);

  return (
    <div
      ref={sliderRef}
      className={`nc-DiscoverMoreSlider nc-p-l-container ${
        isShow ? "" : "invisible"
      }`}
    >
      <Heading
        className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 nc-p-r-container "
        desc=""
        // rightDescText="Explore the best brands"
        hasNextPrev
      >
        Top Brands
      </Heading>
      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-md">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No brands available
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            We’re working hard to bring you the best brands. Please check back
            soon!
          </p>
        </div>
      ) : (
        <div className="" data-glide-el="track">
          <ul className="glide__slides">
            {brands.map((brand, index) => (
              <li key={brand.id} className="glide__slide">
                <BrandCard
                  name={brand.name}
                  desc={brand.description}
                  featuredImage={brand.imageUrl}
                  color={COLORS[index % COLORS.length]}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiscoverBrands;
